import { Component, OnInit } from "@angular/core";
declare const $: any;

@Component({
  selector: "app-email-setup",
  templateUrl: "./email-setup.component.html",
  styleUrls: ["./email-setup.component.css"],
})

export class EmailSetupComponent implements OnInit {
   public spinner: boolean = false;
   public showCurrentPassword: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
    $(function(){
        var $select = $(".restricton");
        for (let i=1;i<=100;i++){
            $select.append($('<option></option>').val(i).html(i))
        }
    });​
  }

}
