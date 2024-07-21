import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { RackTemperatureService } from '../rack-temperature.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatCard, MatCardActions, MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule, MatCard, MatCardActions, MatCardModule],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.css',
})
export class LogsComponent implements OnInit, OnDestroy {
  logs: any[] = [];
  private dataSubscription!: Subscription;

  constructor(
    private rackTemperatureService: RackTemperatureService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {}
  ngAfterViewInit(): void {
    this.dataSubscription =
      this.rackTemperatureService.serverRoomData$.subscribe((data) => {
        this.processNewData(data);
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  processNewData(data: any) {
    if (data) {
      const logEntry = {
        timestamp: data.timestamp,
        messages: data.racks.map(
          (rack: { id: any; temperature: any; status: string }) => ({
            id: rack.id,
            temperature: rack.temperature,
            status: rack.status,
            isDangerous: rack.status === 'Too Hot',
          })
        ),
      };
      this.logs.unshift(logEntry); // Add new log to the beginning of the array
      if (this.logs.length > 100) {
        this.logs.pop(); // Keep only the latest 100 logs
      }
    }
  }

  downloadCSV() {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Timestamp,Rack ID,Temperature,Status\n';

    this.logs.forEach((log) => {
      log.messages.forEach(
        (message: { id: any; temperature: any; status: any }) => {
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
