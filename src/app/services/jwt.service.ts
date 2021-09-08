import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class JwtService {
  private userDetails: BehaviorSubject<any> = new BehaviorSubject({});
  constructor() {}
  async saveToken(token) {
    await localStorage.setItem("token", token);
  }
  getToken() {
    return window.localStorage.getItem("token");
  }
  async destroyToken() {
    await window.localStorage.clear();
  }
  getUserActivities() {
    return JSON.parse(window.localStorage.getItem("userActivities"));
  }
  saveUserDetails(user) {
    window.localStorage.setItem("userDetails", JSON.stringify(user));
    this.userDetails.next(user);
  }
  async saveHrmUserDetails(hrmUser) {
    await window.localStorage.setItem(
      "hrmUserDetails",
      JSON.stringify(hrmUser)
    );
    this.userDetails.next(hrmUser);
  }
  async getHrmUserDetails() {
    return JSON.parse(window.localStorage.getItem("hrmUserDetails"));
  }
  getUserDetails() {
    // const data = JSON.parse(window.localStorage.getItem("userDetails"));
    // this.userDetails.next(data);
    return JSON.parse(window.localStorage.getItem("userDetails"));
  }

  getData(): Observable<any> {
    return this.userDetails;
  }
  async saveUserActivities(activities) {
    await window.localStorage.setItem(
      "userActivities",
      JSON.stringify(activities)
    );
  }
}
