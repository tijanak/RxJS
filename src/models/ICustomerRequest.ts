import { ILocation } from "./ILocation";

export interface ICustomerRequest {
  customerName: string;
  origin: ILocation;
  destination: ILocation;
}
