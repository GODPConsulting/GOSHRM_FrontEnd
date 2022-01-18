import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoComponent implements OnInit {
  @Input('info_message') info_message: string = 'All fields are required';
  @Input('loading') loading: boolean = false;
  constructor() {}

  ngOnInit(): void {}
}
