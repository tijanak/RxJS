import {
  GeocodingResponse,
  ResponseRoute,
  RoutesResponse,
  RoutesResponseResult,
} from "traveltime-api";
import { ILocation } from "../models/ILocation";
import { ITaxi, Taxi } from "../models/ITaxi";

export function getTaxis(): Promise<ITaxi[]> {
  return fetch(`${process.env.SERVER}taxis`)
    .then((response) => {
      if (response.ok) return response.json();
      else throw new Error("connection issue");
    })
    .then((data) => {
      return data;
    })
    .catch((err) => console.error(err));
}
export function getCoordinates(location: string): Promise<GeocodingResponse> {
  return fetch(
    `https://api.traveltimeapp.com/v4/geocoding/search?query=${location}&limit=1&format.exclude.country=true&format.name=true&bounds=43%2C22.5%2C43.5%2C21.5&app_id=${process.env.APP_ID}&api_key=${process.env.API_KEY}`,
    {
      method: "GET",
      headers: {
        "Accept-Language": "en-US",
      },
    }
  ).then((res) => {
    if (res.ok) return res.json();
    else throw new Error("Lokacija je van dometa taksi servisa");
  });
}
export function getRouteInformation(
  origin: ILocation,
  destination: ILocation
): Promise<RoutesResponse> {
  return fetch(
    `https://api.traveltimeapp.com/v4/routes?type=driving&origin_lat=${
      origin.latitude
    }&origin_lng=${origin.longitude}&destination_lat=${
      destination.latitude
    }&destination_lng=${
      destination.longitude
    }&departure_time=${new Date().toISOString()}&app_id=${
      process.env.APP_ID
    }&api_key=${process.env.API_KEY}`
  )
    .then((response) => {
      if (response.ok) return response.json();
      else throw new Error("connection issue");
    })
    .then((data) => {
      return data;
    })
    .catch((err) => console.error(err));
}