import { ElementRef, Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ApiService } from "./api.service";
import swal from "sweetalert2";
import { saveAs } from "file-saver";
import { isInteger } from "lodash";

@Injectable({
  providedIn: "root",
})
export class UtilitiesService {
  getCountryUrl: string = "/common/countries";

  constructor(private apiService: ApiService) {}

  // Validates the file to be uploaded
  uploadFileValidator(
    event: Event,
    form: FormGroup,
    staffId?: number | string
  ) {
    const file = (<HTMLInputElement>event.target).files[0];
    console.log(file);

    // Acceptable excel formats
    const excelTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    // Checks if the file type is same as any of the accpetable excel formats
    const isExcelFile = excelTypes.some((str) => file.type.includes(str));

    // If upload is from employee page and is not an image or pdf
    if (
      isInteger(staffId) &&
      !file.type.includes("image") &&
      file.type !== "application/pdf"
    ) {
      swal.fire(
        "GOSHRM",
        "Please select a valid file of formats jpg, png or pdf",
        "error"
      );
      (<HTMLInputElement>event.target).value = "";
    } else if (!staffId && !file.type.includes("image")) {
      swal.fire("GOSHRM", "Please select a valid image file format", "error");
      (<HTMLInputElement>event.target).value = "";
    } else if (staffId === "hr" && !isExcelFile) {
      // If upload is not from employee page and not excel file
      swal.fire(
        "GOSHRM",
        "Please select a valid file of excel(.xls or .xlsx) format",
        "error"
      );
      (<HTMLInputElement>event.target).value = "";
    } else {
      // Appends a selected file to the form property
      form.patchValue({
        [(<HTMLInputElement>event.target).name]: file,
      });
      return file;
    }
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

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
}
