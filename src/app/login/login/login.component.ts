import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {JwtService} from "../../services/jwt.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
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
    return this.authService.userLogin(payload).subscribe(res => {
     this.jwtService.saveToken(res.token).then(() => {
       this.router.navigateByUrl('/')
     })
    }, err => {
      console.log(err);
    })
  }
}
