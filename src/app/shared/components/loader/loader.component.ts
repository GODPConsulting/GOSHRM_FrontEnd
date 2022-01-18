import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {
  @Input() width: number = 20;
  @Input() loading: boolean = true;
  @Input() color: string = '#ffffff';

  constructor() {}

  ngOnInit(): void {}
}
