import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-docstream-skeleton-loader',
  templateUrl: './docstream-skeleton-loader.component.html',
  styleUrls: ['./docstream-skeleton-loader.component.scss'],
})
export class DocstreamSkeletonLoaderComponent implements OnInit {
  @Input('count') count: number = 1;
  @Input('appearance') appearance: 'circle' | 'line' = 'line';
  @Input('animation') animation: 'progress' | 'progress-dark' | 'pulse' =
    'pulse';
  @Input('width') width: string = '100%';
  @Input('height') height: string = '1rem';
  @Input('border_radius') 'border_radius': string = '';
  @Input('border') border: string = '1px solid white';
  @Input('background_color') 'background_color': string = '';
  @Input('margin_bottom') 'margin_bottom': string = '1rem';

  constructor() {}

  ngOnInit(): void {}
}
