import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "sentenceCase",
})
export class SentenceCasePipe implements PipeTransform {
  transform(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
