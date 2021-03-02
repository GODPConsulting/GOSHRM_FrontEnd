import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { JwtService } from "../../services/jwt.service";
import { AuthService } from "../../services/auth.service";
import swal from "sweetalert2";
import { DataService } from "src/app/services/data.service";
import { exists } from "fs";
import { EmployeeService } from "src/app/services/employee.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading: boolean;
  redirectURL: any;
  spinner: boolean = false;
  user: any;
  hrmUser: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private jwtService: JwtService,
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit() {
    // this.setTitle('GOS ERP | Login');
    let params = this.route.snapshot.queryParams;

    if (params["returnUrl"]) {
      this.redirectURL = params["returnUrl"];
    }

    if (this.redirectURL) {
      this.router
        .navigateByUrl(this.redirectURL)
        .catch(() => this.router.navigate(["/"]));
    } else {
      this.router.navigate(["/"]);
    }

    this.loginForm = this.fb.group({
      userName: [""],
      password: [""],
    });
  }

  getUserDetails() {
    return this.authService.getProfile().subscribe(
      (data) => {
        console.log(data);
        this.user = data;
        this.getEmployeeByEmail(this.user.email);
        if (data != null) {
          this.jwtService.saveUserDetails(data);
          let activities;
          if (data.activities != null) {
            activities = data.activities.map((item) => {
              return item.toLocaleLowerCase();
            });
            this.jwtService.saveUserActivities(activities).then(() => {
              this.router.navigateByUrl(this.redirectURL);
            });
          } else {
            swal
              .fire(
                "Error",
                `User won't be able to see any page, contact the super admin`,
                "error"
              )
              .then(() => {
                this.router.navigate(["/"]);
              });
          }
        }
      },
      (error) => {
        const message = error.status.message.friendlyMessage;
        swal.fire(`Error`, message, "error");
      }
    );
  }

  login(loginForm: FormGroup) {
    const payload = loginForm.value;
    this.loading = true;
    return this.authService.userLogin(payload).subscribe(
      (res) => {
        this.loading = false;
        this.jwtService.saveToken(res.token).then(() => {
          this.getUserDetails();
          // this.router.navigateByUrl('/')
        });
      },
      (err) => {
        const message = err.error.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
        this.loading = false;
      }
    );
  }

  getEmployeeByEmail(email: string) {
    this.employeeService.getEmployeeByEmail(email).subscribe((data) => {
      this.hrmUser = data.employeeList[0];
      this.hrmUser.branchId = this.user.branchId;
      this.hrmUser.branchName = this.user.branchName;
      this.hrmUser.companyId = this.user.companyId;
      this.hrmUser.companyName = this.user.companyName;
      this.hrmUser.customerName = this.user.customerName;
      this.hrmUser.departmentId = this.user.departmentId;
      this.hrmUser.lastLoginDate = this.user.lastLoginDate;
      this.hrmUser.staffName = this.user.staffName;
      this.hrmUser.userStatus = this.user.status;
      this.hrmUser.userId = this.user.userId;
      this.hrmUser.userName = this.user.userName;
      this.hrmUser.userRoleNames = [...this.user.roles];
      this.hrmUser.activities = [...this.user.activities];
      //this.userRights = this.hrmUser.activities;
      // share user data through data service
      //this.dataService.saveCurrentUser(this.hrmUser);
      this.jwtService.saveHrmUserDetails(this.hrmUser);
    });
  }
}
