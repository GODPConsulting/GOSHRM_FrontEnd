import { Component, OnInit, ChangeDetectionStrategy, Output, Input, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-upload-doc',
  templateUrl: './upload-doc.component.html',
  styleUrls: ['./upload-doc.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadDocComponent implements OnInit {
  public sub: Subscription = new Subscription();
  // public AcceptedFileTypes: string = 'application/PDF';
  @Input() bgColor: string = 'purple';
  @Output() selectedFiles: EventEmitter<File> = new EventEmitter();
  public files!: File;
  @Input() allType: boolean =  true;
  @Input() isExcel: boolean =  false;
  @Input() isImage: boolean =  false;
  @Input() isAllDocType: boolean =  false;
  @Input() isMultiple: boolean =  false;
  @Input() isVideo: boolean =  false;
  @Input() isNotVideo: boolean =  false;
  @Input() additionalInfo!: string;

  constructor(

  ) {}

  ngOnInit(): void {}


  public addFilesToList = (newFiles: any) => {
    // if(this.isMultiple){
    //   for (let i = 0; i < newFiles.length; i++) {
    //     this.files.includes(newFiles[i]) ? null : this.files.push(newFiles[i]);
    //   }
    // }
    // else{
    //   this.files = newFiles;
    // }
    // this._util.emitUploadFiles(this.files);
    this.selectedFiles.emit(newFiles);
  };

  public dragOverHandler(ev: any): void {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
    ev.stopPropagation();
  }

  public onFileDropped(event: any) {
    if (event.target.files.length > 0) {
      this.addFilesToList(event.target.files);
    }
  }
  public removeFile(index: number): void {
    // this.files.splice(index, 1);
    this.files = null as any
    this.selectedFiles.emit(this.files);
  }

  public dropHandler(ev: any): void {
    ev.preventDefault();
    ev.stopPropagation();

    if (ev.dataTransfer.items) {
      for (var i = 0; i < ev.dataTransfer.items.length; i++) {
        if (ev.dataTransfer.items[i].kind === 'file') {
          this.addFilesToList(ev.dataTransfer.files);
        }
      }
    } else {
      for (var i = 0; i < ev.dataTransfer.files.length; i++) {
        this.addFilesToList(ev.dataTransfer.files);
      }
    }
  }

}
