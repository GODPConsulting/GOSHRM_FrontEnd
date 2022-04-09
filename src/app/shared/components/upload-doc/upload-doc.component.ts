import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FileType } from '@shared/models/file-type.model';

@Component({
  selector: 'app-upload-doc',
  templateUrl: './upload-doc.component.html',
  styleUrls: ['./upload-doc.component.scss'],
})
export class UploadDocComponent implements OnInit {
  @Input() file_name: string = '';
  @Input() type: string = '';
  @Input() file_size: number = 0;
  @Output() remove: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor() {}

  ngOnInit(): void {}

  public removeFile(): void {
    this.remove.emit(true);
  }

  public getFileType(): string {
    switch (true) {
      case this.type.toLocaleLowerCase().includes(FileType.PDF):
        return 'assets/images/pdf.svg';
      case this.type.toLocaleLowerCase().includes(FileType.WORD):
        return 'assets/images/word.svg';
      case this.type.toLocaleLowerCase().includes(FileType.IMG):
        return 'assets/images/img.svg';
      default:
        return 'assets/images/img.svg';
    }
  }

  public formatBytes(decimals = 2): string {
    if (this.file_size === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(this.file_size) / Math.log(k));
    return (
      parseFloat((this.file_size / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
    );
  }
}