import { IGeocode } from "./IGeocode";

export interface ITaxi {
  plate: string;
  available: boolean;
  location: IGeocode;
}
