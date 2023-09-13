import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ActionsService } from '@shared/services/action.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss'],
})
export class SearchbarComponent implements OnInit {
  @ViewChild('searchQuery') searchQueryElement!: ElementRef;
  @Input() routerLink: string = '';
  @Input() canInterview: boolean = false;
  @Input() canTest: boolean =  false;
  @Input() filterList: Array<string> = [];
  @Input() sortList: Array<string> = [];
  @Output() btnAction = new EventEmitter();
  @Output() deleteAction = new EventEmitter();
  @Output() downloadAction = new EventEmitter();
  @Output() searchAction = new EventEmitter();
  @Output() sortAction = new EventEmitter();
  @Output() replyAction = new EventEmitter();
  @Output() searchQuery: EventEmitter<string> = new EventEmitter<string>();
  @Input() canDownload: boolean = false;
  @Input() canDelete: boolean = false;
  @Input() canAdd: boolean = false;
  @Input() canReply: boolean = false;

  constructor(
    private _action: ActionsService
  ) { }

  ngOnInit(): void {}

  public btnPressed(): void {
    this.btnAction.emit();
    this._action.addNew(true);
  }

  public downloadPressed(): void {
    this.downloadAction.emit();
    this._action.download();
  }

  public deletePressed(): void {
    this.deleteAction.emit();
    this._action.addNew(false);
  }
  public searchPressed(): void {
    this.searchAction.emit(true);
  }
  public replyPressed(): void {
    this.replyAction.emit(true);
  }

  public getSearchQuery(
    searchQuery: string,
    event: KeyboardEvent | any,
    clear?: boolean
  ): void {
    clear ? (this.searchQueryElement.nativeElement.value = '') : null;
    this.searchQuery.emit(searchQuery);
    var key = event.key || event.keyCode;
    if (key == 'Enter' || key == 8 || searchQuery == '') {
      this.searchAction.emit(true);
    }
  }
}
