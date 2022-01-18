import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-loading-button',
  templateUrl: './loading-button.component.html',
  styleUrls: ['./loading-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingButtonComponent implements OnInit {
  @Input() text!: string;
  @Input() condition!: boolean;
  @Input() loaderSize: number = 20;

  constructor() {}

  ngOnInit(): void {}
}
