import { Component } from '@angular/core';
import { RackTemperatureService } from '../rack-temperature.service';

@Component({
  selector: 'app-simulation-controls',
  standalone: true,
  imports: [],
  templateUrl: './simulation-controls.component.html',
  styleUrl: './simulation-controls.component.css',
})
export class SimulationControlsComponent {
  constructor(private rackTemperatureService: RackTemperatureService) {}

  startSimulation() {
    this.rackTemperatureService.startStream();
  }

  stopSimulation() {
    this.rackTemperatureService.stopStream();
  }
}
