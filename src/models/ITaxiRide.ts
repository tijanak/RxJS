import { ICustomerRequest } from "./ICustomerRequest";
import { ILocation } from "./ILocation";

export enum RideStatus {
  Pending = "Taksi na putu do klijenta",
  OnRoute = "Na putu ka destinaciji",
  Completed = "Voznja zavrsena",
}
export interface ITaxiRide {
  duration: number;
  status: RideStatus;
  taxi: string;
  request: ICustomerRequest;
  currentLocation: ILocation;
}
