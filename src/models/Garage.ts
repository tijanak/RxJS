import { Observable, Subject } from "rxjs";
import { IGeocode } from "./IGeocode";
import { getTaxis } from "../controllers/observables";
import { ITaxi } from "./ITaxi";
import { ILocation } from "./ILocation";
export class Garage {
  private subject: Subject<ITaxi[]> = new Subject();
  public taxi$: Observable<ITaxi[]> = this.subject.asObservable();
  private taxis: Map<string, ITaxi> = new Map();
  constructor() {
    getTaxis().then((d) => {
      d.forEach((element: ITaxi) => {
        this.taxis.set(element.plate, element);
      });
      this.subject.next(d);
    });
  }
  private notify() {
    let newTaxis = this.taxis.values();
    this.subject.next(Array.from(newTaxis));
  }
  changeAvailability(plate: string, available: boolean): void {
    let taxi = this.taxis.get(plate);
    taxi.available = available;
    this.taxis.set(plate, taxi);
    this.notify();
  }
  changeLocation(plate: string, newLocation: ILocation) {
    let taxi = this.taxis.get(plate);
    taxi.location = newLocation;
    this.taxis.set(plate, taxi);
    this.notify();
  }
}
