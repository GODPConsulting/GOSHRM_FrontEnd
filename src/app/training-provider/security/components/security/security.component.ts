import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent implements OnInit {
  public changePasswordForm!: FormGroup;
  public showCurrentPassword: boolean = false;
  public showPassword: boolean = false;
  public showConfirmPassword: boolean = false;
  public isLoading: boolean = false;
  spinner: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
