import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {JwtService} from "../../services/jwt.service";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading: boolean;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private jwtService: JwtService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      userName: [''],
      password: ['']
    })
  }

  login(loginForm: FormGroup) {
    const payload = loginForm.value;
    this.loading = true;
    return this.authService.userLogin(payload).subscribe(res => {
      this.loading = false;
     this.jwtService.saveToken(res.token).then(() => {
       this.router.navigateByUrl('/')
     })
    }, err => {
      this.loading = false;
      console.log(err);
    })
  }
}
