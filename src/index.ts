import { Observable } from "rxjs";
import { Taxi } from "./Taxi";

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
