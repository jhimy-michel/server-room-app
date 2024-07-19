import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCard, MatCardActions, MatCardModule } from '@angular/material/card';
import { Subscription } from 'rxjs';

import { RackTemperatureService } from '../rack-temperature.service';
import * as d3 from 'd3';

export interface RackTemperature {
  id: string;
  temperature: number;
  status: string;
}

export interface ServerRoomData {
  timestamp: string;
  racks: RackTemperature[];
}

@Component({
  selector: 'app-rack-temperature',
  standalone: true,
  imports: [CommonModule, MatCard, MatCardActions, MatCardModule],
  templateUrl: './rack-temperature.component.html',
  styleUrls: ['./rack-temperature.component.css'],
})
export class RackTemperatureComponent implements OnInit, OnDestroy {
  serverRoomData: ServerRoomData | null = null;
  private subscription: Subscription = new Subscription();

  constructor(
    private rackTemperatureService: RackTemperatureService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.subscription = this.rackTemperatureService.serverRoomData$.subscribe(
      (data) => {
        if (data) {
          console.log('rack data: ', data);
          this.serverRoomData = data;
          this.cdr.detectChanges();
        }
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getColorForTemperature(temp: number): string {
    const coldScale = d3
      .scaleLinear<string>()
      .domain([0, 15])
      .range(['rgba(0, 0, 255, 0.5)', 'rgba(0, 128, 255, 0.5)']); // Blue shades

    const optimalScale = d3
      .scaleLinear<string>()
      .domain([15, 30])
      .range(['rgba(0, 255, 0, 0.5)', 'rgba(255, 255, 0, 0.5)']); // Green to Yellow

    const hotScale = d3
      .scaleLinear<string>()
      .domain([30, 40])
      .range(['rgba(255, 165, 0, 0.5)', 'rgba(255, 0, 0, 0.5)']); // Orange to Red

    if (temp < 15) {
      return coldScale(temp);
    } else if (temp <= 30) {
      return optimalScale(temp);
    } else {
      return hotScale(temp);
    }
  }

  getRackPosition(id: string): { top: string; left: string } {
    const positions: { [key: string]: { top: string; left: string } } = {
      R1: { top: '8%', left: '10%' },
      R2: { top: '20%', left: '10%' },
      R3: { top: '32%', left: '10%' },
      R4: { top: '44%', left: '10%' },
      R5: { top: '56%', left: '10%' },
      R6: { top: '8%', left: '35%' },
      R7: { top: '20%', left: '35%' },
      R8: { top: '32%', left: '35%' },
      R9: { top: '44%', left: '35%' },
      R10: { top: '56%', left: '35%' },
      S1: { top: '8%', left: '60%' },
      S2: { top: '20%', left: '60%' },
      S3: { top: '32%', left: '60%' },
      S4: { top: '44%', left: '60%' },
      S5: { top: '56%', left: '60%' },
      S6: { top: '8%', left: '85%' },
      S7: { top: '20%', left: '85%' },
      S8: { top: '32%', left: '85%' },
      S9: { top: '44%', left: '85%' },
      S10: { top: '56%', left: '85%' },
    };
    return positions[id] || { top: '0%', left: '0%' };
  }
}
