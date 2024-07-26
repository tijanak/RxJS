import {
  GeocodingResponse,
  ResponseRoute,
  RoutesResponse,
} from "traveltime-api";
import { IDriveRoute } from "../models/IDriveRoute";
import { ILocation } from "../models/ILocation";
import { ITaxi } from "../models/ITaxi";

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
    `https://api.traveltimeapp.com/v4/geocoding/search?query=${location}&limit=1&format.exclude.country=true&format.name=true&bounds=${process.env.SE_BOUND_LAT}%2C${process.env.SE_BOUND_LONG}%2C${process.env.NW_BOUND_LAT}%2C${process.env.NW_BOUND_LONG}&app_id=${process.env.APP_ID}&api_key=${process.env.API_KEY}`,
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

export function getRouteInfo(
  currentLocation: ILocation,
  origin: ILocation,
  destination: ILocation
): Promise<IDriveRoute> {
  const toOriginKey = "toOrigin";
  const routeKey = "route";
  const taxiLocationId = "taxiLocation";
  const originLocationId = "origin";
  const destinationLocationId = "destination";
  const params = {
    locations: [
      {
        id: taxiLocationId,
        coords: {
          lat: currentLocation.latitude,
          lng: currentLocation.longitude,
        },
      },
      {
        id: originLocationId,
        coords: {
          lat: origin.latitude,
          lng: origin.longitude,
        },
      },
      {
        id: destinationLocationId,
        coords: {
          lat: destination.latitude,
          lng: destination.longitude,
        },
      },
    ],
    departure_searches: [
      {
        id: toOriginKey,
        departure_location_id: taxiLocationId,
        arrival_location_ids: [originLocationId],
        departure_time: new Date().toISOString(),
        properties: ["route"],
        transportation: {
          type: "driving",
        },
      },
      {
        id: routeKey,
        departure_location_id: originLocationId,
        arrival_location_ids: [destinationLocationId],
        departure_time: new Date().toISOString(),
        properties: ["route"],
        transportation: {
          type: "driving",
        },
      },
    ],
  };
  return fetch("https://api.traveltimeapp.com/v4/routes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Application-Id": process.env.APP_ID,
      "X-Api-Key": process.env.API_KEY,
    },
    body: JSON.stringify(params),
  })
    .then((respone) => {
      if (respone.ok) return respone.json();
    })
    .then((data: RoutesResponse) => {
      let toOrigin = data.results.find((v) => v.search_id == toOriginKey);
      let toDestination = data.results.find((v) => v.search_id == routeKey);
      let toOriginRoute: ResponseRoute =
        toOrigin.locations[0].properties[0].route;
      let toDestinationRoute: ResponseRoute =
        toDestination.locations[0].properties[0].route;
      return { toOrigin: toOriginRoute, toDestination: toDestinationRoute };
    });
}
