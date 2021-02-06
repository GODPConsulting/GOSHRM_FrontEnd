import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ApiService } from "./api.service";
import swal from "sweetalert2";
import { saveAs } from "file-saver";

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
      idsArray.splice(idsArray.indexOf(id), 1);
      /*  idsArray = idsArray.filter((_id) => {
        return _id !== id; 
      });*/
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

  // Converts response to file and downloads it
  byteToFile(data: string, fileName: string, mimeType?: BlobPropertyBag) {
    if (data != undefined) {
      const byteString = atob(data);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const bb = new Blob([ab]);
      try {
        const file = new File([bb], fileName, mimeType);

        saveAs(file);
      } catch (err) {
        const textFileAsBlob = new Blob([bb], mimeType);
        window.navigator.msSaveBlob(textFileAsBlob, fileName);
      }
    } else {
      return swal.fire(`GOS HRM`, "Unable to download data", "error");
    }
  }
}
