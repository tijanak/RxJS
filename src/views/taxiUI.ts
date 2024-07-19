import { ITaxi } from "../models/ITaxi";
export function drawTaxis(container: HTMLDivElement, taxis: ITaxi[]) {
  container.innerHTML = "";
  taxis.forEach((taxi) => {
    drawTaxi(container, taxi);
  });
}
export function drawTaxi(container: HTMLDivElement, taxi: ITaxi) {
  container.innerText += taxi.plate + taxi.available;
}
