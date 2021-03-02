import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DataService {
  private userSource = new BehaviorSubject<any>(null);
  private mailSource = new BehaviorSubject<any>(null);

  currentUser = this.userSource.asObservable();
  currentMail = this.mailSource.asObservable();

  constructor() {}

  saveCurrentUser(data) {
    this.userSource.next(data);
  }

  saveCurrentMail(data) {
    this.mailSource.next(data);
  }
}
