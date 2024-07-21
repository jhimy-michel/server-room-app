import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatCard, MatCardModule } from '@angular/material/card';
import { RackTemperatureService } from '../rack-temperature.service';
import { RackTemperature, ServerRoomData } from '../server-room.type';


interface LogEntry {
  timestamp: string;
  messages: {
    id: string;
    temperature: number;
    status: string;
    isDangerous: boolean;
  }[];
}

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule, MatCard, MatCardModule],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.css',
})
export class LogsComponent implements OnDestroy {
  logs: LogEntry[] = [];
  private dataSubscription!: Subscription;

  constructor(
    private rackTemperatureService: RackTemperatureService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.dataSubscription =
      this.rackTemperatureService.serverRoomData$.subscribe((data) => {
        if (data) {
          this.processNewData(data);
          this.cdr.detectChanges();
        }
      });
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  processNewData(data: ServerRoomData) {
    if (data) {
      const logEntry = {
        timestamp: data.timestamp,
        messages: data.racks.map((rack: RackTemperature) => ({
          id: rack.id,
          temperature: rack.temperature,
          status: rack.status,
          isDangerous: rack.status === 'Too Hot',
        })),
      };
      this.logs.unshift(logEntry); // Add new log to the beginning of the array
      if (this.logs.length > 50) {
        this.logs.pop(); // Keep only the latest 50 logs
      }
    }
  }

  downloadCSV() {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Timestamp,Rack ID,Temperature,Status\n';

    this.logs.forEach((log) => {
      log.messages.forEach(
        (message: RackTemperature) => {
          csvContent += `${log.timestamp},${message.id},${message.temperature},${message.status}\n`;
        }
      );
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'system_logs.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
