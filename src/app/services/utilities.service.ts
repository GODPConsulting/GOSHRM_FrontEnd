import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Injectable({
  providedIn: "root",
})
export class UtilitiesService {
  constructor() {}

  // Appends a selected file to the form property
  patchFile(event: Event, form: FormGroup) {
    const file = (<HTMLInputElement>event.target).files[0];
    form.patchValue({
      [(<HTMLInputElement>event.target).name]: file,
    });
  }
}
