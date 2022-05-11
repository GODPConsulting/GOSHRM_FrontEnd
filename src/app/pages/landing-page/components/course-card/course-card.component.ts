import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.scss']
})
export class CourseCardComponent implements OnInit {
  @Input() coverImage: string = '';
  @Input() courseTitle: string = '';
  @Input() instructorName: string = '';
  @Input() price: string = '';
  @Input() competencies: string[] = [];
  @Output() route = new EventEmitter();
  @Output() cart = new EventEmitter();
  @Output() whilst = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  public goToDetail(): void {
    this.route.emit(true);
  }

  public cartCourse(): void {
    this.cart.emit(true);
  }

  public whilstCourse(): void {
    this.whilst.emit(true);
  }

}
