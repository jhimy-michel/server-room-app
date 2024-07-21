import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatCard, MatCardActions, MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';

import { RackTemperatureComponent } from './rack-temperature/rack-temperature.component';
import { HttpClientModule } from '@angular/common/http';
import { TemperatureBarChartComponent } from './temperature-bar-chart/temperature-bar-chart.component';
import { LogsComponent } from './logs/logs.component';
import { SimulationControlsComponent } from './simulation-controls/simulation-controls.component';
import { TemperatureTrendChartComponent } from './temperature-trend-chart/temperature-trend-chart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HttpClientModule,
    RackTemperatureComponent,
    TemperatureTrendChartComponent,
    TemperatureBarChartComponent,
    LogsComponent,
    SimulationControlsComponent,
    MatToolbarModule,
    MatGridList,
    MatGridTile,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'app';
}
