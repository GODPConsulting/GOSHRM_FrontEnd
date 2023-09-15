import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ResponseModel } from 'app/models/response.model';
import { Subscription } from 'rxjs';
import { UserActivitiesService } from '../../services/user-activities.service';
import { HelperService } from '@core/services/healper.service';
import { BaseComponent } from '@core/base/base/base.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-activities',
  templateUrl: './user-activities.component.html',
  styleUrls: ['./user-activities.component.scss']
})
export class UserActivitiesComponent implements OnInit {
  public sub: Subscription = new Subscription();
  public userRole: any = {
    userRoleId: 0,
    name: '',
    description: '',
    pages: [
      {
        pageId: 0,
        name: '',
        canAdd: false,
        canView: false,
        canDelete: false
      }
    ],
  };
  public userActivities: {
    pageId: 0,
    name: '',
    canAdd: false,
    canView: false,
    canDelete: false
  }[] = [];
  public frequencies: {id: number, name: string}[] = [
    {id: 1, name: 'Daily'}, {id: 2, name: 'Weekly'},
    {id: 3, name: 'Monthly'}, {id: 4, name: 'Annually'},
  ];
  public vatForm!: FormGroup;
  public vatFormSubmitted!: boolean;
  public isLoading!: boolean;
  public pages!: FormArray;
  public cols!: any[];

  constructor(
    private _fb: FormBuilder,
    private _userActivity: UserActivitiesService,
    private _helper: HelperService,
    private _base: BaseComponent,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.iniVatForm();
    this._route.queryParams.subscribe(param => {
      const id = param.id;
      id ? this.getUserRoleById(id) : this.getAdminPages();
    })
    this.cols = [
      {
        header: "name",
        field: "name",
      },
      {
        header: "rate",
        field: "rate",
      },
    ];
  }

  public getAdminPages(): void {
    this._helper.startSpinner();
    this.sub.add(
      this._userActivity.getAllPages().subscribe({
        next: (res: any) => {
          // console.log(res);
          this._helper.stopSpinner();
          this.userActivities = res;
          this.iniVatForm();
          this.patchPages();
          this.removeVatType(0);
        },
        error: (error: ResponseModel<null>) => {
          this._helper.stopSpinner();
        },
      })
    );
  }

  public getUserRoleById(id: number): void {
    this._helper.startSpinner();
    this.sub.add(
      this._userActivity.getUserRolesById(id).subscribe({
        next: (res: any) => {
          // console.log(res);
          this._helper.stopSpinner();
          this.userRole = res[0];
          this.userActivities = this.userRole.pages;
          this.iniVatForm();
          this.patchPages();
          this.removeVatType(0);
        },
        error: (error: ResponseModel<null>) => {
          this._helper.stopSpinner();
        },
      })
    );
  }

  public iniVatForm() {
    this.vatForm = this._fb.group({
      userRoleId: [this.userRole ? this.userRole.userRoleId : 0],
      name: [this.userRole ? this.userRole.name : '', Validators.required],
      description: [this.userRole ? this.userRole.description : ''],
      pages: this._fb.array([
        this._fb.group({
          pageId: [0],
          name: [0],
          canView: [false],
          canEdit: [false],
          canDelete: [false],
        })
      ]),
    });
  }

  get newPage(): FormArray {
    return this.vatForm.get('pages') as FormArray;
  }

  addNewRow(index: number): void {
    this.pages.insert(index + 1, this.createTableRow());
  }

  private createTableRow(): FormGroup {
    return this._fb.group({
        pageId: new FormControl(0, {
            validators: [Validators.required]
        }),
        name: new FormControl(0),
        canView: new FormControl(false),
        canEdit: new FormControl(false),
        canDelete: new FormControl(false)
    });
  }

  public patchPages() {
    this.userActivities.map((item: any) => {
      const tmpDict: any = {};
      tmpDict['pageId'] = new FormControl(item.pageId);
      tmpDict['name'] = new FormControl(item.name);
      tmpDict['canView'] = new FormControl(item.canView ?? false);
      tmpDict['canEdit'] = new FormControl(item.canEdit ?? false);
      tmpDict['canDelete'] = new FormControl(item.canDelete ?? false);

      this.pages = this.vatForm.get('pages') as FormArray;
      this.pages.push(new FormGroup(tmpDict));
    });
  }

  public removeVatType(index: number) {
    this.pages.removeAt(index);
  }

  public changeViewValue(index: number) {
    let canView =  (<FormArray>this.vatForm.controls['pages']).at(index).get('canView')!.value;
    (<FormArray>this.vatForm.controls['pages']).at(index).patchValue(
      {canView: canView}
    );
  }

  public changeCreateValue(index: number) {
    let canEdit =  (<FormArray>this.vatForm.controls['pages']).at(index).get('canEdit')!.value;
    (<FormArray>this.vatForm.controls['pages']).at(index).patchValue(
      {canEdit: canEdit}
    );
  }

  public changeDeleteValue(index: number) {
    let canDelete =  (<FormArray>this.vatForm.controls['pages']).at(index).get('canDelete')!.value;
    (<FormArray>this.vatForm.controls['pages']).at(index).patchValue(
      {canDelete: canDelete}
    );
  }


  public submit() {
    const payload = this.vatForm.value;
    if(this.vatForm.valid) {
      this.isLoading = true;
      this.sub.add(
        this._userActivity.addUpdateUserRole(payload).subscribe({
          next: (res: any) => {
            this.isLoading = false;
            this._base.openSnackBar(
              'Your action was successful',
              'success'
            );
            history.back();
          },
          error: (error: HttpErrorResponse) => {
            this.isLoading = false;
            this._base.openSnackBar(
              error.error,
              'Failed'
            );
          },
        })
      );
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
