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

  deleteArray(event: Event, id: number, idsArray: number[]) {
    if ((<HTMLInputElement>event.target).checked) {
      if (!idsArray.includes(id)) {
        idsArray.push(id);
      }
    } else {
      idsArray = idsArray.filter((_id) => {
        return _id !== id;
      });
    }
  }

  checkAllBoxes(event: Event, dataArray: any[]) {
    if ((<HTMLInputElement>event.target).checked) {
      return dataArray.map((item) => item.id);
    }
    return [];
  }

  setDateToPresent(event: Event, form: FormGroup, formControlName: string) {
    if ((<HTMLInputElement>event.target).checked) {
      form.get(formControlName).setValue("Present");
    } else {
      form.get(formControlName).setValue("");
    }
  }

  getCountry() {
    return this.apiService.get(this.getCountryUrl);
  }
}
