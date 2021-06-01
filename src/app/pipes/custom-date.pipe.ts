import { Pipe, PipeTransform } from "@angular/core";
import { DatePipe } from "@angular/common";

@Pipe({
  name: "customDate",
})
export class CustomDatePipe implements PipeTransform {
  transform(value: string) {
    const datePipe = new DatePipe("en-US");
    value = datePipe.transform(value, "dd-mm-yyyy");
    return value;
  }
}
