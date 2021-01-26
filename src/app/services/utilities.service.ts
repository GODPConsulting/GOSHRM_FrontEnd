import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ApiService } from "./api.service";

@Injectable({
  providedIn: "root",
})
export class UtilitiesService {
  getCountryUrl: string = "/common/countries";

  constructor(private apiService: ApiService) {}

  // Appends a selected file to the form property
  patchFile(event: Event, form: FormGroup) {
    const file = (<HTMLInputElement>event.target).files[0];
    form.patchValue({
      [(<HTMLInputElement>event.target).name]: file,
    });
  }

  getCountry() {
    return this.apiService.get(this.getCountryUrl);
  }
}
