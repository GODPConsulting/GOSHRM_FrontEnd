import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DataService {
  private userSource = new BehaviorSubject<any>(null);
  private allUsersSource = new BehaviorSubject<any>(null);

  currentUser = this.userSource.asObservable();
  allUsers = this.allUsersSource.asObservable();

  constructor() {}

  shareAllUsers(data) {
    this.allUsersSource.next(data);
  }

  saveCurrentUser(data) {
    this.userSource.next(data);
  }

  getCurrentUser() {
    return this.currentUser;
  }
}
