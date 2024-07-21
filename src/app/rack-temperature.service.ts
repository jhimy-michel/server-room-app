import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

interface RackTemperature {
  id: string;
  temperature: number;
  status: string;
}

interface ServerRoomData {
  timestamp: string;
  racks: RackTemperature[];
}

@Injectable({
  providedIn: 'root',
})
export class RackTemperatureService {
  private serverRoomDataSubject = new BehaviorSubject<ServerRoomData | null>(
    null
  );
  public serverRoomData$ = this.serverRoomDataSubject.asObservable();
  private eventSource: EventSource | null = null;

  constructor(private http: HttpClient) {}

  startStream() {
    this.http.post('https://real-time-api-i3fo7btsmq-ey.a.run.app/start', {}).subscribe(() => {
      if (!this.eventSource) {
        this.connectToStream();
      }
    });
  }

  stopStream() {
    this.http.post('https://real-time-api-i3fo7btsmq-ey.a.run.app/stop', {}).subscribe(() => {
      if (this.eventSource) {
        this.eventSource.close();
        this.eventSource = null;
      }
    });
  }

  private connectToStream() {
    this.eventSource = new EventSource(
      'https://real-time-api-i3fo7btsmq-ey.a.run.app/server-room-stream'
    );
    this.eventSource.onmessage = (event) => {
      try {
        const serverRoomData = JSON.parse(event.data);
        this.serverRoomDataSubject.next(serverRoomData);
      } catch (e) {
        console.log(e);
      }
    };
  }
}
