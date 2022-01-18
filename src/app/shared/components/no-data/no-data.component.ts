import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.scss'],
})
export class NoDataComponent implements OnInit {
  //Please specify name in singular
  @Input('name') name!: string;
  @Input('is_loading') is_loading!: boolean;
  @Input('is_initial') is_initial: boolean = true;
  @Output() open_dialog: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {}
  public openAddDialog() {
    this.open_dialog.emit(true);
  }
}
