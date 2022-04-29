import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Currency } from '@core/models/currencies.model';
import { HttpService } from '@shared/services/http.service';
import { ResponseModel } from 'app/models/response.model';
import { Observable } from 'rxjs';
import { isInteger } from "lodash";
import { HelperService } from './healper.service';

@Injectable({
  providedIn: 'root',
})

export class CurrenciesService {
  constructor(
    private http: HttpService,
    private _helper: HelperService
  ) {}

  public getAllCurrencies(
  ): Observable<ResponseModel<Currency>> {
   const endpoint = '/common/currencies';
   return this.http.getFromGate(endpoint);
  }

  public  uploadFileValidator(
    event: Event,
    form: FormGroup,
    courseId?: number | string
  ) {
      const target= event.target as HTMLInputElement;
      const file: File = (target.files as FileList)[0];
    if (!file) {
      return this._helper.triggerErrorAlert("GOSHRM", "Please select a valid file format");
    }

    // Acceptable excel formats
    const excelTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    // Checks if the file type is same as any of the accpetable excel formats
    const isExcelFile = excelTypes.some((str) => file.type.includes(str));

    if (
      isInteger(courseId) && !isExcelFile
    ) {
      this._helper.triggerErrorAlert(
        "GOSHRM",
        "Please select a valid file of excel(.xls or .xlsx) format"
      );
      (<HTMLInputElement>event.target).value = "";
    } else {
      // Appends a selected file to the form property
      form.patchValue({
        [(<HTMLInputElement>event.target).name]: file,
      });
      return "file valid";
    }
  }

}

