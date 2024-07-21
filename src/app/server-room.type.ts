export interface RackTemperature {
  id: string;
  temperature: number;
  status: string;
}

export interface ServerRoomData {
  timestamp: string;
  racks: RackTemperature[];
}
