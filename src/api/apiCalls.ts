import { ILocation } from "../models/ILocation";
import { ITaxi } from "../models/ITaxi";

export function getTaxis(): Promise<ITaxi[]> {
  return fetch(`${process.env.SERVER}taxis`)
    .then((response) => {
      if (response.ok) return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((err) => console.error(err));
}

export function getRideDuration(origin: ILocation, destination: ILocation) {
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
    })
    .then((data) => {
      return data;
    })
    .catch((err) => console.error(err));
}
