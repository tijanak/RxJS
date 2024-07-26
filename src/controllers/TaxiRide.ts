import { differenceInMinutes } from "date-fns";
import {
  BehaviorSubject,
  concatMap,
  delay,
  from,
  interval,
  Observable,
  of,
  share,
  take,
} from "rxjs";
import { ResponseRoutePart } from "traveltime-api";
import { getRouteInfo } from "../api/apiCalls";
import { ICustomerRequest } from "../models/ICustomerRequest";
import { IDriveRoute } from "../models/IDriveRoute";
import { ILocation } from "../models/ILocation";
import { ITaxiRide, RideStatus } from "../models/ITaxiRide";

export class TaxiRide implements ITaxiRide {
  private rideUpdatesSubject: BehaviorSubject<ITaxiRide>;

  public rideUpdate$: Observable<ITaxiRide>;
  public status: RideStatus;
  public duration: number;

  private lengthOfRide: number;
  private avgSpeedKMH: number = 40;
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
    routeInfoFetch.pipe(take(1)).subscribe((routeInfo: IDriveRoute) => {
      this.route = routeInfo;
      console.log(routeInfo);
      this.driveToOrigin().subscribe({
        complete: () => {
          this.driveFromOriginToDestination();
        },
      });
    });
  }
  private driveRoute(
    parts: ResponseRoutePart[]
  ): Observable<ResponseRoutePart> {
    let drive = from(parts).pipe(
      concatMap((part: ResponseRoutePart) =>
        of(part).pipe(delay((part.travel_time / 60) * this.minInMilisseconds))
      ),
      share()
    );
    drive.subscribe((part) => {
      this.currentLocation = {
        longitude: part.coords[0].lng,
        latitude: part.coords[0].lat,
      };
      this.update();
    });
    return drive;
  }
  private driveToOrigin(): Observable<ResponseRoutePart> {
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
        this.currentLocation = this.request.destination;
        drivingTimer.unsubscribe();
        this.update();
      },
    });
  }
  private update() {
    this.rideUpdatesSubject.next(this);
  }
  private getRideDurationInMin(arrival_time: Date, departure_time: Date) {
    return Math.abs(differenceInMinutes(arrival_time, departure_time));
  }
}
