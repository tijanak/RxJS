import {
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  exhaustMap,
  filter,
  from,
  fromEvent,
  map,
  Observable,
  ReplaySubject,
  scan,
  share,
  Subject,
  switchMap,
  tap,
  withLatestFrom,
} from "rxjs";
import { GeocodingResponse } from "traveltime-api";
import { getCoordinates } from "../api/apiCalls";
import { ICustomerRequest } from "../models/ICustomerRequest";
import { ILocation } from "../models/ILocation";
import { ITaxi } from "../models/ITaxi";
import { ITaxiRide } from "../models/ITaxiRide";

//TODO - sredi
export function makeRequestObs(
  inputs: HTMLInputElement[],
  formBtn: HTMLButtonElement
): Observable<ICustomerRequest> {
  const disableFormSubmission = () => (formBtn.disabled = true);
  const origin$ = locationInputObs(inputs[0], disableFormSubmission);

  const destintation$ = locationInputObs(inputs[1], disableFormSubmission);
  const request = combineLatest([origin$, destintation$]);
  request
    .pipe(
      filter((value) => {
        return (
          value[0] != undefined &&
          value[0] != null &&
          value[1] != null &&
          value[1] != undefined
        );
      })
    )
    .subscribe(() => (formBtn.disabled = false));
  const btnClick = btnObs(formBtn).pipe(
    withLatestFrom(request),
    map((v, index): ICustomerRequest => {
      return {
        id: index,
        destination: v[1][1],
        origin: v[1][0],
      };
    })
  );
  return btnClick;
}

function btnObs(btn: HTMLButtonElement): Observable<Event> {
  return fromEvent(btn, "click");
}
function locationInputObs(
  input: HTMLInputElement,
  disableFormSubmission: () => void
): Observable<ILocation> {
  return fromEvent(input, "input").pipe(
    tap(() => disableFormSubmission()),
    debounceTime(1000),
    map((ev: InputEvent) => (<HTMLInputElement>ev.target).value),
    filter((location: string) => location.length > 3),
    switchMap((location: string) => getLocationCoords(location)),
    share()
  );
}

function getLocationCoords(location: string): Observable<ILocation> {
  return from(getCoordinates(location)).pipe(
    map((geocodeResp: GeocodingResponse): ILocation => {
      if (geocodeResp && geocodeResp.features.length > 0) {
        return {
          address: location,
          latitude: geocodeResp.features[0].geometry.coordinates[1],
          longitude: geocodeResp.features[0].geometry.coordinates[0],
        };
      } else {
        alert("Lokacija je van dometa taksi servisa");
      }
    })
  );
}

export function createAvailableTaxiObs(taxi$: Observable<ITaxi[]>) {
  return taxi$.pipe(
    map((taxis: ITaxi[]) => taxis.filter((taxi) => taxi.available)),

    distinctUntilChanged((previous: ITaxi[], current: ITaxi[]) => {
      let areEqual = previous.length === current.length;
      current.forEach((taxi) => {
        if (previous.find((t) => t.plate == taxi.plate) == undefined)
          areEqual = false;
      });
      previous.forEach((taxi) => {
        if (current.find((t) => t.plate == taxi.plate) == undefined)
          areEqual = false;
      });
      return areEqual;
    })
  );
}
export function createTaxiRideObs(
  allTaxiRideStream$: Observable<ITaxiRide[][]>
): Observable<ITaxiRide[]> {
  return allTaxiRideStream$.pipe(
    map((rides: ITaxiRide[][]) => {
      return rides.reduce((acc, rides) => {
        acc.push(...rides);
        acc.sort((a, b) => b.request.id - a.request.id);
        return acc;
      }, []);
    })
  );
}
export function createUnprocessedRequestsObs(
  allRequest$: Observable<ICustomerRequest[]>,
  ride$: Observable<ITaxiRide[]>
): Observable<ICustomerRequest[]> {
  return combineLatest([allRequest$, ride$]).pipe(
    map((value) => {
      let unprocessedRequests: ICustomerRequest[] = [];
      let requests: ICustomerRequest[] = value[0];
      let rides: ITaxiRide[] = value[1];
      requests.forEach((req: ICustomerRequest) => {
        if (rides.find((ride) => ride.request.id == req.id) == undefined) {
          unprocessedRequests.push(req);
        }
      });
      return unprocessedRequests;
    })
  );
}
export function makeStreamOfStreams<T>(
  stream: Subject<Observable<T>>
): Observable<T[]> {
  return stream.pipe(
    scan((acc: Observable<T>[], stream: Observable<T>) => {
      return [...acc, stream];
    }, []),
    switchMap((streams: Observable<T>[]) => combineLatest(streams))
  );
}
export function bufferStream<T>(stream: Observable<T>): ReplaySubject<T> {
  const bufferOne: ReplaySubject<T> = new ReplaySubject(1);
  stream.subscribe((value) => bufferOne.next(value));
  return bufferOne;
}
