import { Injectable } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DataService {
  private userSource = new BehaviorSubject<any>(null);
  private mailSource = new BehaviorSubject<any>(null);
  setPageStatus: EventEmitter<number> = new EventEmitter<number>();

  currentUser = this.userSource.asObservable();
  sendUser: EventEmitter<any> = new EventEmitter<any>();
  currentMail = this.mailSource.asObservable();
  sendData: EventEmitter<any> = new EventEmitter<any>();
  constructor() {}

  saveCurrentUser(data) {
    this.userSource.next(data);
  }

  saveCurrentMail(data) {
    this.mailSource.next(data);
  }
}
