import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {
  @Output() triggerModalEvent: EventEmitter<boolean> = new EventEmitter();
  @Output() triggerRegenrateEvent: EventEmitter<boolean> = new EventEmitter();
  @Output() uploadEvent: EventEmitter<boolean> = new EventEmitter();
  @Output() deleteEvent: EventEmitter<boolean> = new EventEmitter();
  @Output() downloadEvent: EventEmitter<boolean> = new EventEmitter();
  @Output() viewEvent: EventEmitter<boolean> = new EventEmitter();
  @Output() statusEvent: EventEmitter<boolean> = new EventEmitter();
  @Output() gridEvent: EventEmitter<boolean> = new EventEmitter();
  @Output() filterEvent: EventEmitter<any> = new EventEmitter();
  @Output() filterEventBtn: EventEmitter<any> = new EventEmitter();
  @Output() approveEvent: EventEmitter<void> = new EventEmitter();
  @Output() submitEvent: EventEmitter<void> = new EventEmitter();
  @Output() discussEvent: EventEmitter<void> = new EventEmitter();
  @Output() visitorLinkEvent: EventEmitter<void> = new EventEmitter();
  @Output() refreshActionEvent: EventEmitter<void> = new EventEmitter();

  constructor() {}

    addNew(value: boolean){
      this.triggerModalEvent.emit(value);
    }

    regenerate(value: boolean){
      this.triggerRegenrateEvent.emit(value);
    }

    delete(){
      this.deleteEvent.emit(true);
    }

    download(){
      this.downloadEvent.emit(true);
    }

    view(){
      this.viewEvent.emit(true);
    }

    status(value: boolean){
      this.statusEvent.emit(value);
    }

    filter(value: any){
      this.statusEvent.emit(value);
    }

}
