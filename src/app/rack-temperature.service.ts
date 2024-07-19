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
    this.http.post('http://localhost:8080/start', {}).subscribe(() => {
      if (!this.eventSource) {
        this.connectToStream();
      }
    });
  }

  stopStream() {
    this.http.post('http://localhost:8080/stop', {}).subscribe(() => {
      if (this.eventSource) {
        this.eventSource.close();
        this.eventSource = null;
      }
    });
  }

  private connectToStream() {
    this.eventSource = new EventSource(
      'http://localhost:8080/server-room-stream'
    );
    this.eventSource.onmessage = (event) => {
      try {
        const serverRoomData = JSON.parse(event.data);
        // console.log(event.data);
        this.serverRoomDataSubject.next(serverRoomData);
      } catch (e) {
        console.log(e);
      }
    };
  }
}
