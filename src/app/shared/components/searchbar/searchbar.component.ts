import { Router } from '@angular/router';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

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
  @Output() filterAction = new EventEmitter();
  @Output() searchAction = new EventEmitter();
  @Output() sortAction = new EventEmitter();
  @Output() searchQuery: EventEmitter<string> = new EventEmitter<string>();
  @Input() canDownload: boolean = false;
  @Input() canDelete: boolean = false;
  @Input() canAdd: boolean = false;
  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {}

  public btnPressed(): void {
    this.btnAction.emit();
  }
  
  public filterPressed(): void {
    this.filterAction.emit();
  }
  public searchPressed(): void {
    this.searchAction.emit(true);
  }

  public gotToCreateJob() {
    this.router.navigate(['/employers/create-job'])
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
