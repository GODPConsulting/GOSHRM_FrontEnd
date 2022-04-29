import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  public instructorId: any;
  public current_tab:string = 'information';

  constructor(
    private _route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.instructorId = this._route.snapshot.paramMap.get('instructorId');
    // console.log(this.instructorId)
  }

  public getInformation(): void {
    this.current_tab = 'information';
    this.router.navigate(['/instructor-information', this.instructorId], { queryParams: { q: 'information' } });
  }

  public getCourses(): void {
    this.current_tab = 'courses';
    this.router.navigate(['/instructor-information', this.instructorId], { queryParams: { q: 'courses' } });
  }

}
