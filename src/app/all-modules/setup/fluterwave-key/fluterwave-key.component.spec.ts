import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FluterwaveKeyComponent } from './fluterwave-key.component';
import {ReactiveFormsModule} from '@angular/forms';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {LoadingService} from '../../../core/services/loading.service';
import {GLMappingService} from '../../../core/services/glmapping.service';

describe('FluterwaveKeyComponent', () => {
  let component: FluterwaveKeyComponent;
  let fixture: ComponentFixture<FluterwaveKeyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FluterwaveKeyComponent ],
      imports: [ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide:[ LoadingService, GLMappingService]
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FluterwaveKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
