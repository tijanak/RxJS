import {
  debounceTime,
  filter,
  from,
  fromEvent,
  map,
  Observable,
  switchMap,
} from "rxjs";
import { IGeocode } from "../models/IGeocode";
import { GeocodingResponse, TravelTimeClient } from "traveltime-api";
import { ILocation } from "../models/ILocation";

export function makeRequestObs(inputs: HTMLInputElement[]) {
  const originObs = locationInputObs(inputs[0]);
  originObs.subscribe((location: ILocation) => {
    console.log(location);
  });

  const destObs = locationInputObs(inputs[1]);
  destObs.subscribe((location: ILocation) => {
    console.log(location);
  });
}

const travelTimeClient = new TravelTimeClient(
  {
    applicationId: process.env.APP_ID,
    apiKey: process.env.API_KEY,
  },
  { rateLimitSettings: { enabled: true } }
);

interface LocationSearchInfo {
  address: string;
  geocode: GeocodingResponse;
}
export function locationInputObs(
  input: HTMLInputElement
): Observable<ILocation> {
  return fromEvent(input, "input").pipe(
    debounceTime(1000),
    map((ev: InputEvent) => (<HTMLInputElement>ev.target).value),
    filter((location: string) => location.length >= 3),
    switchMap((location: string) =>
      getLocationCoords(location).pipe(
        map((geocodeResp: GeocodingResponse) => {
          return {
            address: location,
            geocode: geocodeResp,
          };
        })
      )
    ),
    map((searchInfo: LocationSearchInfo): ILocation => {
      let geocodeResp = searchInfo.geocode;
      console.log(geocodeResp);
      return {
        address: searchInfo.address,
        latitude: geocodeResp.features[0].geometry.coordinates[1],
        longitude: geocodeResp.features[0].geometry.coordinates[0],
      };
    })
  );
}

function getLocationCoords(location: string): Observable<GeocodingResponse> {
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
        console.log(res);
        if (res.ok) return res.json();
        else throw new Error("Lokacija je van dometa taksi servisa");
      })
      .then((data) => {
        if (data.features.length > 0) return data;
        else throw new Error("Lokacija je van dometa taksi servisa");
      })
      .catch((e) => {
        console.error(e);
      })
  );
}

function getTaxis() {
  fetch(`${process.env.SERVER}taxis`)
    .then((response) => {
      if (response.ok) return response.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((e) => console.error(e));
}
//getTaxis();
