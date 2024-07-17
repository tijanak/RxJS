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

const travelTimeClient = new TravelTimeClient(
  {
    applicationId: process.env.APP_ID,
    apiKey: process.env.API_KEY,
  },
  { rateLimitSettings: { enabled: true } }
);
export function requestInputObs(input: HTMLInputElement) {
  return fromEvent(input, "input").pipe(
    debounceTime(500),
    map((ev: InputEvent) => (<HTMLInputElement>ev.target).value),
    filter((location: string) => location.length >= 3),
    switchMap((location: string) => getLocationCoords(location))
  );
}

function getLocationCoords(location: string): Observable<GeocodingResponse> {
  return from(
    fetch(
      `https://api.traveltimeapp.com/v4/geocoding/search?query=Nis&limit=1&app_id=${process.env.APP_ID}&api_key=${process.env.API_KEY}`,
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
getTaxis();
