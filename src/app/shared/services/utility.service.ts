import { Injectable } from '@angular/core';
import { saveAs } from "file-saver";
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  constructor() {}

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
}
