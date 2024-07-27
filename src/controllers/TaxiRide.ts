import {
  BehaviorSubject,
  concatMap,
  delay,
  filter,
  from,
  interval,
  Observable,
  of,
  pairwise,
  share,
  take,
} from "rxjs";
import { Coords, ResponseRoutePart } from "traveltime-api";
import { getRouteInfo } from "../api/apiCalls";
import { ICustomerRequest } from "../models/ICustomerRequest";
import { IDriveRoute } from "../models/IDriveRoute";
import { getDistanceInKm, ILocation } from "../models/ILocation";
import { ITaxiRide, RideStatus } from "../models/ITaxiRide";

export class TaxiRide implements ITaxiRide {
  private rideUpdatesSubject: BehaviorSubject<ITaxiRide>;

  public rideUpdate$: Observable<ITaxiRide>;
  public status: RideStatus;
  public duration: number;

  private minInMilisseconds = 1000;
  private route: IDriveRoute;

  constructor(
    public currentLocation: ILocation,
    public taxi: string,
    public request: ICustomerRequest
  ) {
    this.status = RideStatus.Pending;

    this.duration = 0;
    this.rideUpdatesSubject = new BehaviorSubject<ITaxiRide>(this);
    this.rideUpdate$ = this.rideUpdatesSubject.asObservable();

    this.startDrive();
  }
  private startDrive() {
    let routeInfoFetch = from(
      getRouteInfo(
        this.currentLocation,
        this.request.origin,
        this.request.destination
      )
    );
    routeInfoFetch.pipe(take(1)).subscribe({
      next: (routeInfo: IDriveRoute) => {
        this.route = routeInfo;
        this.driveToOrigin().subscribe({
          complete: () => {
            this.driveFromOriginToDestination();
          },
        });
      },
      error: (err) => {
        console.error(err);
        this.status = RideStatus.Canceled;
        this.update();
      },
    });
  }
  private driveRoute(parts: ResponseRoutePart[]): Observable<any> {
    let drive = from(parts).pipe(
      filter((part) => part.mode == "car"),
      concatMap((part: ResponseRoutePart) =>
        from(part.coords).pipe(
          pairwise(),
          concatMap((coords: [Coords, Coords], index) =>
            of(coords).pipe(
              delay(
                this.getSectionTravelTimeInMin(
                  coords,
                  part.distance,
                  part.travel_time
                ) * this.minInMilisseconds
              )
            )
          )
        )
      )
    );
    drive.subscribe((coords) => {
      this.currentLocation = {
        longitude: coords[1].lng,
        latitude: coords[1].lat,
      };
      this.update();
    });
    return drive;
  }
  private driveToOrigin(): Observable<Coords> {
    return this.driveRoute(this.route.toOrigin.parts);
  }
  private driveFromOriginToDestination(): void {
    this.status = RideStatus.OnRoute;
    this.currentLocation = this.request.origin;
    this.update();
    let drivingTimer = interval(this.minInMilisseconds).subscribe(() => {
      this.duration += 1;

      this.update();
    });
    let ride = this.driveRoute(this.route.toDestination.parts);
    ride.subscribe({
      complete: () => {
        this.status = RideStatus.Completed;
        drivingTimer.unsubscribe();
        this.update();
      },
    });
  }
  private update() {
    this.rideUpdatesSubject.next(this);
  }
  private getSectionTravelTimeInMin(
    section: [Coords, Coords],
    partDistance: number,
    partTravelTime: number
  ): number {
    let distanceInMeters =
      getDistanceInKm(
        { latitude: section[0].lat, longitude: section[0].lng },
        { latitude: section[1].lat, longitude: section[1].lng }
      ) * 1000;
    let travelTimeInSec: number =
      (distanceInMeters * partTravelTime) / partDistance;
    return travelTimeInSec / 60;
  }
}
