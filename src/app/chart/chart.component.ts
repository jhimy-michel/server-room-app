import {
  Component,
  AfterViewInit,
  OnDestroy,
  Input,
  ElementRef,
  ViewChild,
} from '@angular/core';
import * as d3 from 'd3';
import { RackTemperatureService } from '../rack-temperature.service';
import {
  RackTemperature,
  ServerRoomData,
} from '../rack-temperature/rack-temperature.component';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatCardActions, MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, MatCardActions, MatCardModule],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
})
export class ChartComponent implements AfterViewInit, OnDestroy {
  @Input() data: ServerRoomData | null = null;
  @ViewChild('chart') private chartContainer!: ElementRef;

  private svg: d3.Selection<SVGGElement, unknown, null, undefined> | undefined;
  private margin = { top: 20, right: 20, bottom: 30, left: 50 };
  private width = 600 - this.margin.left - this.margin.right;
  private height = 300 - this.margin.top - this.margin.bottom;

  private x: any;
  private y: any;
  private line: any;

  private data2: any[] = [];

  private subscription: Subscription = new Subscription();

  constructor(private rackTemperatureService: RackTemperatureService) {}

  ngOnInit() {
    /* this.subscription.add(
      this.rackTemperatureService.serverRoomData$.subscribe((data) => {
        if (data) {
          
          this.data = data;
        }
      })
    ); */
  }

  ngAfterViewInit() {
    this.createChart();
  }

  ngOnDestroy() {
    this.rackTemperatureService.stopStream();
  }

  updateData(newData: any) {
    const timestamp = new Date(newData.timestamp);
    const averageTemp = this.calculateAverageTemp(newData.racks);
    this.data2.push({ timestamp, averageTemp });

    this.updateLine(this.data2);
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
      .domain([new Date(2024, 6, 19), new Date()]) // Initial domain set for the first data point
      .range([0, this.width]);

    this.y = d3
      .scaleLinear()
      .domain([0, 40]) // Assuming temperature range between 0 and 40
      .range([this.height, 0]);

    this.line = d3
      .line()
      //@ts-ignore
      .x((d) => this.x(d.timestamp))
      //@ts-ignore
      .y((d) => this.y(d.averageTemp));

    this.svg
      .append('g')
      .attr('transform', `translate(0, ${this.height})`)
      .call(d3.axisBottom(this.x));

    this.svg.append('g').call(d3.axisLeft(this.y));

    // Add gridlines
    this.svg.append('g').attr('class', 'grid-x');

    this.svg.append('g').attr('class', 'grid-y');
  }

  private calculateAverageTemp(racks: any[]) {
    const totalTemp = racks.reduce((sum, rack) => sum + rack.temperature, 0);
    return totalTemp / racks.length;
  }

  private updateLine(data: any[]) {
    if (!this.svg && !this.line) return;
    // @ts-ignore
    this.svg.select('.line').remove();
    // @ts-ignore
    this.svg
      .append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('d', this.line)
      .attr('stroke', 'blue')
      .attr('fill', 'none');

    this.x.domain(d3.extent(data, (d) => d.timestamp));
  }

  public startRealTimeUpdates(): void {
    this.rackTemperatureService.startStream();
    this.subscription = this.rackTemperatureService.serverRoomData$.subscribe(
      (data) => {
        this.data = data;
        this.updateData(data);
        console.log('char data: ', data);
      }
    );
  }

  public stopRealTimeUpdates(): void {
    this.rackTemperatureService.stopStream();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
