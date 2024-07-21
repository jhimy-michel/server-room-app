import {
  Component,
  AfterViewInit,
  OnDestroy,
  Input,
  ElementRef,
  ViewChild,
} from '@angular/core';
import * as d3 from 'd3';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatCardActions, MatCardModule } from '@angular/material/card';

import { RackTemperatureService } from '../rack-temperature.service';
import { RackTemperature, ServerRoomData } from '../server-room.type';

interface DataPoint {
  timestamp: Date;
  averageTemp: number;
}

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, MatCardActions, MatCardModule],
  templateUrl: './temperature-trend-chart.component.html',
  styleUrls: ['./temperature-trend-chart.component.css'],
})
export class TemperatureTrendChartComponent
  implements AfterViewInit, OnDestroy
{
  @ViewChild('chart') private chartContainer!: ElementRef;

  private svg: d3.Selection<SVGGElement, unknown, null, undefined> | undefined;
  private margin = { top: 20, right: 20, bottom: 30, left: 50 };
  private width = 600 - this.margin.left - this.margin.right;
  private height = 300 - this.margin.top - this.margin.bottom;

  private x?: d3.ScaleTime<number, number>;
  private y?: d3.ScaleLinear<number, number>;
  private line?: d3.Line<DataPoint>;

  private dataPoint: DataPoint[] = [];

  private subscription: Subscription = new Subscription();

  constructor(private rackTemperatureService: RackTemperatureService) {}

  ngAfterViewInit() {
    this.createChart();
    this.subscription = this.rackTemperatureService.serverRoomData$.subscribe(
      (data) => {
        if (data) {
          this.updateData(data);
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  updateData(newData: ServerRoomData) {
    const timestamp = new Date(newData.timestamp);
    const averageTemp = this.calculateAverageTemp(newData.racks);
    this.dataPoint.push({ timestamp, averageTemp });

    this.updateLine(this.dataPoint);
  }

  private createChart(): void {
    this.svg = d3
      .select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    this.x = d3
      .scaleTime()
      .domain([new Date(), new Date()])
      .range([0, this.width]);

    this.y = d3
      .scaleLinear()
      .domain([0, 40]) // Assuming temperature range between 0 and 40
      .range([this.height, 0]);

    this.line = d3
      .line<DataPoint>()
      .x((d) => this.x?.(d.timestamp) ?? 0)
      .y((d) => this.y?.(d.averageTemp) ?? 0);

    this.svg
      .append('g')
      .attr('transform', `translate(0, ${this.height})`)
      .call(d3.axisBottom(this.x));

    this.svg.append('g').call(d3.axisLeft(this.y));

    // Add gridlines
    this.svg.append('g').attr('class', 'grid-x');

    this.svg.append('g').attr('class', 'grid-y');
  }

  private calculateAverageTemp(racks: RackTemperature[]) {
    const totalTemp = racks.reduce((sum, rack) => sum + rack.temperature, 0);
    return totalTemp / racks.length;
  }

  private updateLine(data: DataPoint[]) {
    if (!this.svg || !this.line || !this.x) return;

    // Remove old line
    this.svg.select('.line').remove();

    // Append new line
    this.svg
      .append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('d', this.line)
      .attr('stroke', 'red')
      .attr('stroke-width', '2px')
      .attr('fill', 'none')
      .attr('opacity', 0)
      .transition()
      .duration(100)
      .attr('opacity', 1);

    this.svg.select('.grid-x').remove();
    const xDomain = d3.extent(data, (d) => d.timestamp) as [Date, Date];
    this.x.domain(xDomain);
  }
}
