import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatCard, MatCardActions, MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';

import { RackTemperatureComponent } from './rack-temperature/rack-temperature.component';
import { HttpClientModule } from '@angular/common/http';
import { ChartComponent } from './chart/chart.component';
import { TemperatureBarChartComponent } from './temperature-bar-chart/temperature-bar-chart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HttpClientModule,
    RackTemperatureComponent,
    ChartComponent,
    TemperatureBarChartComponent,
    MatCard,
    MatCardActions,
    MatCardModule,
    MatToolbarModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'app';
}
