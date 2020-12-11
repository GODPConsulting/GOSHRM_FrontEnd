import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor() { }
  async saveToken(token) {
    await localStorage.setItem('token', token)
  }
  getToken() {
    return window.localStorage.getItem('token')
  }
  async destroyToken() {
   await window.localStorage.removeItem("token");
  }
  getUserActivities() {
    return JSON.parse(window.localStorage.getItem("userActivities"));
  }
  saveUserDetails(user) {
    window.localStorage.setItem("userDetails", JSON.stringify(user));
  }
  getUserDetails() {
    return JSON.parse(window.localStorage.getItem("userDetails"));
  }
  async saveUserActivities(activities) {
    await window.localStorage.setItem(
      "userActivities",
      JSON.stringify(activities)
    );
  }

}
