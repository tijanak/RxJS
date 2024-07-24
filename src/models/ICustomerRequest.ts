import { ILocation } from "./ILocation";

export interface ICustomerRequest {
  id: number;
  origin: ILocation;
  destination: ILocation;
}
