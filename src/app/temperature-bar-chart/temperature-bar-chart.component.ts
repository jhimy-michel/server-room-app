import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { RackTemperatureService } from '../rack-temperature.service';
import { Subscription } from 'rxjs';
import * as d3 from 'd3';

import { MatCard, MatCardModule } from '@angular/material/card';
import { rackDataInitializer } from '../../racks';
import { RackTemperature, ServerRoomData } from '../server-room.type';

@Component({
  selector: 'app-temperature-bar-chart',
  standalone: true,
  imports: [MatCard, MatCardModule],
  templateUrl: './temperature-bar-chart.component.html',
  styleUrl: './temperature-bar-chart.component.css',
})
export class TemperatureBarChartComponent implements OnInit, OnDestroy {
  private svg: any;
  private chart: any;
  private xAxis: any;
  private yAxis: any;
  private margin = { top: 20, right: 20, bottom: 30, left: 40 };
  private width = 600 - this.margin.left - this.margin.right;
  private height = 300 - this.margin.top - this.margin.bottom;
  private subscription!: Subscription;
  private x: any;
  private y: any;

  constructor(private rackTemperatureService: RackTemperatureService) {}

  ngOnInit() {
    this.subscription = this.rackTemperatureService.serverRoomData$.subscribe(
      (data) => {
        if (data) {
          this.updateChart(data);
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.createSvg();
    this.initializeAxes();
  }

  private createSvg() {
    this.svg = d3
      .select('#chart')
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom);

    this.chart = this.svg
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
  }

  private initializeAxes() {
    // Define scales
    this.x = d3
      .scaleBand()
      .domain(rackDataInitializer.racks.map((val) => val.id))
      .range([0, this.width])
      .padding(0.1);
    this.y = d3
      .scaleLinear()
      .domain([0, 40]) // Assuming temperature range between 0 and 40
      .range([this.height, 0]);

    // Define axes
    this.xAxis = d3
      .axisBottom(this.x)
      .tickValues(rackDataInitializer.racks.map((val) => val.id)); // Adjust tick count as needed
    this.yAxis = d3.axisLeft(this.y);

    // Append and style x-axis
    this.chart
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${this.height})`)
      .call(this.xAxis)
      .selectAll('text')
      .style('fill', 'white'); // Style x-axis labels

    // Append and style y-axis
    this.chart
      .append('g')
      .attr('class', 'y-axis')
      .call(this.yAxis)
      .selectAll('text')
      .style('fill', 'white'); // Style y-axis labels

    // Add x-axis label
    this.chart
      .append('text')
      .attr(
        'transform',
        `translate(${this.width / 2},${this.height + this.margin.top + 20})`
      )
      .style('text-anchor', 'middle')
      .style('fill', 'white');

    // Add y-axis label
    this.chart
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - this.margin.left)
      .attr('x', 0 - this.height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('fill', 'white')
      .text('Temperature (°C)');
  }

  private updateChart(data: ServerRoomData) {
    this.x.domain(data.racks.map((d: RackTemperature) => d.id));
    this.y.domain([
      0,
      d3.max(data.racks, (d: RackTemperature) => d.temperature),
    ]);

    const bars = this.chart
      .selectAll('.bar')
      .data(data.racks, (d: RackTemperature) => d.id);

    bars
      .exit()
      .transition()
      .duration(300)
      .attr('y', this.y(0))
      .attr('height', 0)
      .remove();

    bars
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('y', this.y(0))
      .attr('height', 0)
      .merge(bars)
      .transition()
      .duration(1000)
      .attr('x', (d: RackTemperature) => this.x(d.id))
      .attr('width', this.x.bandwidth())
      .attr('y', (d: RackTemperature) => this.y(d.temperature))
      .attr(
        'height',
        (d: RackTemperature) => this.height - this.y(d.temperature)
      )
      .attr('fill', (d: RackTemperature) => this.getColorByStatus(d.status));

    // Add labels on top of bars
    const labels = this.chart
      .selectAll('.bar-label')
      .data(data.racks, (d: RackTemperature) => d.id);

    labels.exit().remove();

    labels
      .enter()
      .append('text')
      .attr('class', 'bar-label')
      .merge(labels)
      .transition()
      .duration(500)
      .attr('x', (d: RackTemperature) => this.x(d.id) + this.x.bandwidth() / 2)
      .attr('y', (d: RackTemperature) => this.y(d.temperature) - 5)
      .attr('text-anchor', 'middle')
      .text((d: RackTemperature) => d.temperature.toFixed(1));
  }

  private getColorByStatus(status: string): string {
    switch (status) {
      case 'Optimal':
        return '#4CAF50';
      case 'Acceptable':
        return '#FFC107';
      case 'Too Hot':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  }
}
