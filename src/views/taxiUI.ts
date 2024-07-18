import { ITaxi } from "../models/ITaxi";
export function drawTaxis(taxis: ITaxi[]) {
  let con = document.createElement("div");
  document.body.appendChild(con);
  taxis.forEach((taxi) => {
    drawTaxi(con, taxi);
  });
}
export function drawTaxi(container: HTMLDivElement, taxi: ITaxi) {
  container.innerText += taxi.plate + taxi.available;
}
