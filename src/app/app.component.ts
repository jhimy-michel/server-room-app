import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatCard, MatCardActions, MatCardModule } from '@angular/material/card';

import { RackTemperatureComponent } from './rack-temperature/rack-temperature.component';
import { HttpClientModule } from '@angular/common/http';
import { ChartComponent } from './chart/chart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HttpClientModule,
    RackTemperatureComponent,
    ChartComponent,
    MatCard,
    MatCardActions,
    MatCardModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'app';
}
