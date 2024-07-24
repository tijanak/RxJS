export interface ILocation {
  address?: string;
  latitude: number;
  longitude: number;
}

export function getDistanceInKm(
  location1: ILocation,
  location2: ILocation
): number {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(location2.latitude - location1.latitude);
  var dLon = deg2rad(location2.longitude - location1.longitude);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(location1.latitude)) *
      Math.cos(deg2rad(location2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
