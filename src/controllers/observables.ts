import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  from,
  fromEvent,
  map,
  Observable,
  ReplaySubject,
  scan,
  Subject,
  switchMap,
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
  const subject = new Subject<ICustomerRequest>();
  const originObs = locationInputObs(inputs[0]);
  originObs.subscribe((location: ILocation) => {
    // console.log("origin");
  });

  const destObs = locationInputObs(inputs[1]);
  destObs.subscribe((location: ILocation) => {
    // console.log("dest");
  });
  const test = combineLatest([originObs, destObs]);
  test.subscribe((e) => {
    //  console.log(e);
  });
  const btnClick = btnObs(formBtn)
    .pipe(
      withLatestFrom(test),
      map((v, index): ICustomerRequest => {
        return {
          id: index,
          destination: v[1][1],
          origin: v[1][0],
        };
      }),
      filter((value) => {
        return (
          value.destination != undefined &&
          value.destination != null &&
          value.origin != null &&
          value.origin != undefined
        );
      })
    )
    .subscribe((e) => {
      subject.next(e);
    });
  return subject.asObservable();
}

function btnObs(btn: HTMLButtonElement): Observable<Event> {
  return fromEvent(btn, "click");
}
function locationInputObs(input: HTMLInputElement): Observable<ILocation> {
  return fromEvent(input, "input").pipe(
    debounceTime(1000),
    map((ev: InputEvent) => (<HTMLInputElement>ev.target).value),
    filter((location: string) => location.length > 3),
    switchMap((location: string) => getLocationCoords(location))
  );
}

function getLocationCoords(location: string): Observable<ILocation> {
  return from(
    getCoordinates(location)
      .then((data) => {
        if (data.features.length > 0) return data;
        else throw new Error("Lokacija je van dometa taksi servisa");
      })
      .catch((e) => {
        console.error(e);
        alert(e);
      })
  ).pipe(
    map((geocodeResp: GeocodingResponse): ILocation => {
      if (geocodeResp != undefined && geocodeResp != null)
        return {
          address: location,
          latitude: geocodeResp.features[0].geometry.coordinates[1],
          longitude: geocodeResp.features[0].geometry.coordinates[0],
        };
    })
  );
}

export function createAvailableTaxiObs(taxi$: Observable<ITaxi[]>) {
  return taxi$.pipe(
    map((t: ITaxi[]) => t.filter((taxi) => taxi.available)),

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
