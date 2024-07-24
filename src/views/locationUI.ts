import { ILocation } from "../models/ILocation";

export function showLocation(location: ILocation): string {
  return location.address ?? location.longitude + ", " + location.latitude;
}
