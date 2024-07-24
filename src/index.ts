import { Observable } from "rxjs";
import { differenceInMinutes } from "date-fns";
import { TravelTimeClient } from "traveltime-api";
import { createElements, drawNewRequestForm } from "./views/requestFormUI";
import { makeRequestObs } from "./controllers/observables";
import { getDistanceInKm } from "./models/ILocation";
import { DispatchService } from "./models/DispatchService";
import { createTaxiDiv, drawTaxi, drawTaxis } from "./views/taxiUI";
import { createTaxiRideDiv, drawTaxiRides } from "./views/taxiRideUI";
import { getTaxis } from "./api/apiCalls";
import {
  createUnprocessedReqDiv,
  drawRequests,
} from "./views/unprocessedRequestsUI";

let locationInputs: HTMLInputElement[] = [];
let errorTextDivs: HTMLSpanElement[] = [];
let nameInput: HTMLInputElement = document.createElement("input");
let formBtn: HTMLButtonElement = document.createElement("button");
let taxiDiv: HTMLDivElement = createTaxiDiv();
createElements(locationInputs, errorTextDivs);
drawNewRequestForm(
  document.body,
  locationInputs,
  errorTextDivs,
  nameInput,
  formBtn
);
let unprocessedRequestsDiv: HTMLDivElement = createUnprocessedReqDiv();
let ridesDiv: HTMLDivElement = createTaxiRideDiv();

let request$ = makeRequestObs(locationInputs, nameInput, formBtn);
request$.subscribe(() => {
  //TODO - ocisti input iz zahteva
});
getTaxis().then((taxis) => {
  let taxiService: DispatchService = new DispatchService(request$, taxis);

  taxiService.taxi$.subscribe((taxis) => {
    drawTaxis(taxiDiv, taxis);
  });
  taxiService.ride$.subscribe((rides) => {
    console.log("index new rides");
    drawTaxiRides(ridesDiv, rides);
  });
  taxiService.unprocessedRequest$.subscribe((requests) => {
    drawRequests(unprocessedRequestsDiv, requests);
  });
});
//TODO - obrisi
/*var btn1 = document.createElement("button");
btn1.addEventListener("click", () => {
  taxiService.changeAvailability("NIdkflsjdlf", true);
});
var btn2 = document.createElement("button");
btn2.addEventListener("click", () => {
  taxiService.changeAvailability("NSssdfdf", true);
});
btn1.textContent = "bt1";
btn2.textContent = "bt2";
document.body.appendChild(btn1);
document.body.appendChild(btn2);*/
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
