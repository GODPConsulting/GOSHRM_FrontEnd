import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocstreamSkeletonLoaderComponent } from './docstream-skeleton-loader.component';

describe('DocstreamSkeletonLoaderComponent', () => {
  let component: DocstreamSkeletonLoaderComponent;
  let fixture: ComponentFixture<DocstreamSkeletonLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocstreamSkeletonLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocstreamSkeletonLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
