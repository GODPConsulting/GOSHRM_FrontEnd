import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { JwtService } from "../../services/jwt.service";
import { AuthService } from "../../services/auth.service";
import swal from "sweetalert2";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading: boolean;
  redirectURL: any;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private jwtService: JwtService,
    private router: Router,
    private route: ActivatedRoute
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
        this.loading = false;
      }
    );
  }
}
