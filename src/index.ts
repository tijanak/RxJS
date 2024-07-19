import { Observable } from "rxjs";
import { differenceInMinutes } from "date-fns";
import { TravelTimeClient } from "traveltime-api";
import { createElements, drawNewRequestForm } from "./views/requestFormUI";
import { makeRequestObs } from "./controllers/observables";
import { getDistanceInKm } from "./models/ILocation";
import { DispatchService } from "./models/DispatchService";
import { drawTaxi, drawTaxis } from "./views/taxiUI";
import { Garage } from "./models/Garage";
import { drawTaxiRides } from "./views/taxiRideUI";

let locationInputs: HTMLInputElement[] = [];
let errorTextDivs: HTMLSpanElement[] = [];
let nameInput: HTMLInputElement = document.createElement("input");
let formBtn: HTMLButtonElement = document.createElement("button");
let taxiDiv: HTMLDivElement = document.createElement("div");
let ridesDiv: HTMLDivElement = document.createElement("div");
document.body.appendChild(taxiDiv);
createElements(locationInputs, errorTextDivs);
drawNewRequestForm(
  document.body,
  locationInputs,
  errorTextDivs,
  nameInput,
  formBtn
);

let garage: Garage = new Garage();
let request$ = makeRequestObs(locationInputs, nameInput, formBtn);
request$.subscribe(() => {
  //TODO - ocisti input iz zahteva
});
let taxiService: DispatchService = new DispatchService(garage, request$);
garage.taxi$.subscribe((taxis) => {
  drawTaxis(taxiDiv, taxis);
});
document.body.appendChild(ridesDiv);
taxiService.ride$.subscribe((rides) => {
  drawTaxiRides(ridesDiv, rides);
});
let help = document.createElement("div");
document.body.appendChild(help);
taxiService.unprocessedRequest$.subscribe((requests) => {
  help.innerHTML = "";
  requests.forEach((r) => {
    help.innerHTML += r.customerName;
  });
});
var btn1 = document.createElement("button");
btn1.addEventListener("click", () => {
  garage.changeAvailability("NIdkflsjdlf", true);
});
var btn2 = document.createElement("button");
btn2.addEventListener("click", () => {
  garage.changeAvailability("NSssdfdf", true);
});
btn1.textContent = "bt1";
btn2.textContent = "bt2";
document.body.appendChild(btn1);
document.body.appendChild(btn2);
/*setInterval(() => {
  garage.changeAvailability("NSssdfdf", b);
  b = !b;
}, 1000);*/
/*console.log(
  getDistanceInKm(
    { latitude: 43.315171374964976, longitude: 21.91652238674348 },
    { latitude: 43.324268120690455, longitude: 21.90883842550084 }
  )
);*/
/*travelTimeClient
  .geocoding("Mike Alasa 9", {
    acceptLanguage: "en-US",
    params: {
      limit: 1,
      bounds: {
        southEast: { lat: 43.2, lng: 22.3 },
        northWest: { lat: 43.5, lng: 21.5 },
      },
    },
  })
  .then((data) => {
    if (data.features.length > 0)
      console.log(data.features[0].geometry.coordinates);
  })
  .catch((e) => console.error(e));*/
