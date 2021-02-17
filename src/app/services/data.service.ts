import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DataService {
  private userSource = new BehaviorSubject<any>(null);

  currentUser = this.userSource.asObservable();

  constructor() {}

  saveCurrentUser(data) {
    this.userSource.next(data);
  }
}
