import { EventEmitter, Injectable, Output } from '@angular/core';
import { ResponseModel } from 'app/models/response.model';
import { saveAs } from "file-saver";
import swal from 'sweetalert2';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  @Output() selectedFiles: EventEmitter<File> = new EventEmitter();

  constructor(private http: HttpService) {}


  public emitUploadFiles(selectedFiles: File) {
    this.selectedFiles.emit(selectedFiles);
  }

  //Custom functions will go here
  public byteToFile(data: string, fileName: string, mimeType?: BlobPropertyBag) {
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
        // window.navigator.msSaveBlob(file, fileName);
        saveAs(file);
      } catch (err) {
        const textFileAsBlob = new Blob([bb], mimeType);
        // window.navigator.msSaveBlob(textFileAsBlob, fileName);
        console.log(textFileAsBlob);
      }
    } else {
      swal.fire(`GOS HRM`, "Unable to download data", "error");
    }
  }

  public upload(
    file: File,
    endpoint: string,
    payload?: any
  ): Observable<ResponseModel<any>> {
    const formData: FormData = new FormData();
    formData.append('uploadInput', file);
    if (payload) {
      for (let key in payload) {
        formData.append(key, payload[key]);
      }
    }
    return this.http.makeRequestWithData('post', endpoint, {}, formData);
  }

}
