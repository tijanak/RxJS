import { ILocation } from "./ILocation";

export interface ICustomerRequest {
  id: string;
  customerName: string;
  origin: ILocation;
  destination: ILocation;
}
