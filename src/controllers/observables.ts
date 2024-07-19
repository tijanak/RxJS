import {
  combineLatest,
  debounceTime,
  filter,
  from,
  fromEvent,
  interval,
  map,
  Observable,
  repeat,
  ReplaySubject,
  switchMap,
  takeLast,
  withLatestFrom,
} from "rxjs";
import { IGeocode } from "../models/IGeocode";
import { GeocodingResponse, TravelTimeClient } from "traveltime-api";
import { ILocation } from "../models/ILocation";
import { ICustomerRequest } from "../models/ICustomerRequest";
import { ITaxi } from "../models/ITaxi";

export function makeRequestObs(
  inputs: HTMLInputElement[],
  nameInput: HTMLInputElement,
  formBtn: HTMLButtonElement
): Observable<ICustomerRequest> {
  const subject = new ReplaySubject<ICustomerRequest>();
  const originObs = locationInputObs(inputs[0]);
  originObs.subscribe((location: ILocation) => {
    console.log("origin");
  });

  const destObs = locationInputObs(inputs[1]);
  destObs.subscribe((location: ILocation) => {
    console.log("dest");
  });
  const name = nameObs(nameInput);
  name.subscribe((name: string) => {
    console.log(name);
  });
  const test = combineLatest([originObs, destObs, name]);
  test.subscribe((e) => console.log(e));
  const btnClick = btnObs(formBtn)
    .pipe(
      withLatestFrom(test),
      map((v): ICustomerRequest => {
        return {
          id: "",
          customerName: v[1][2],
          destination: v[1][1],
          origin: v[1][0],
        };
      }),
      filter((value) => {
        return (
          value.customerName != null &&
          value.customerName != undefined &&
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

/*const travelTimeClient = new TravelTimeClient(
  {
    applicationId: process.env.APP_ID,
    apiKey: process.env.API_KEY,
  },
  { rateLimitSettings: { enabled: true } }
);

interface LocationSearchInfo {
  address: string;
  geocode: GeocodingResponse;
}*/
function nameObs(input: HTMLInputElement): Observable<string> {
  return fromEvent(input, "input").pipe(
    debounceTime(500),
    map((ev: InputEvent) => (<HTMLInputElement>ev.target).value),
    map((value: string) => {
      if (value.length > 0) return value;
    })
  );
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
    fetch(
      `https://api.traveltimeapp.com/v4/geocoding/search?query=${location}&limit=1&format.exclude.country=true&format.name=true&bounds=43%2C22.5%2C43.5%2C21.5&app_id=${process.env.APP_ID}&api_key=${process.env.API_KEY}`,
      {
        method: "GET",
        headers: {
          "Accept-Language": "en-US",
        },
      }
    )
      .then((res) => {
        //console.log(res);
        if (res.ok) return res.json();
        else throw new Error("Lokacija je van dometa taksi servisa");
      })
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
      //console.log(geocodeResp);
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
    filter((taxis) => taxis.length != 0)
  );
}

export function createEmptyGarageObs(taxi$: Observable<ITaxi[]>) {
  return taxi$.pipe(
    map((t: ITaxi[]) => t.filter((taxi) => taxi.available)),
    filter((taxis) => taxis.length == 0)
  );
}
