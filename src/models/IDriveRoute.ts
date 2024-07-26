import { ResponseRoute } from "traveltime-api";

export interface IDriveRoute {
  toOrigin: ResponseRoute;
  toDestination: ResponseRoute;
}
