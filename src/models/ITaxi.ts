import { ILocation } from "./ILocation";

export interface ITaxi {
  plate: string;
  available: boolean;
  location: ILocation;
}
