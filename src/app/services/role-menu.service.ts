
import { Injectable } from "@angular/core";
import {JwtService} from "./jwt.service";

@Injectable({
    providedIn: "root"
})
export class RoleMenuService {
    constructor(private jwtService: JwtService) {}

    hideOrShow(activities: any[]): boolean {
        let userActivities = this.jwtService.getUserActivities();
        // let superAdmin = ["super admin"];
        return this.checkActivities(activities, userActivities);
    }

    checkActivities(acceptedArr, incomingArr: string[]): boolean {
        if (acceptedArr.length == 0) return true;
        return (
            incomingArr.some(v => acceptedArr.indexOf(v) >= 0) ||
            incomingArr.indexOf("super admin") > -1
        );
    }
}
