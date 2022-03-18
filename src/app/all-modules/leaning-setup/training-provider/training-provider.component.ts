import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { subscribeOn } from "rxjs/operators";
import { LmsService } from "src/app/services/lms.service";
declare const $: any;

@Component({
  selector: "app-training-provider",
  templateUrl: "./training-provider.component.html",
  styleUrls: ["./training-provider.component.css"],
})

export class TrainingProviderComponent implements OnInit {
    public sub: Subscription = new Subscription();
   public spinner: boolean = false;
   public companyId: number;
   public isFetchingTrainers: boolean = false;
   public dtOptions: DataTables.Settings = {};
   public isCheck: boolean = false;
   public trainingProviderS: any[] = [];
   public SelectedTrainingProvider: any[] = [];
   public profile: any;

  constructor(
    private _lmsService: LmsService
  ) {
  }

  ngOnInit(): void {
    this.profile = JSON.parse(localStorage.getItem('userDetails'));
    this.companyId = this.profile.companyId;
    this.getAllTrainers();
  }

  getAllTrainers() {
    this.sub.add(
      this._lmsService.getAllTrainers(this.companyId).subscribe({
        next: (res) => {
          this.isFetchingTrainers = false;
          this.trainingProviderS = res['trainingProviderObjs'];
          // console.log(res, this.trainingProviderS);
        },
        error: (error) => {
          this.isFetchingTrainers = false;
          console.log(error);
        },
      })
    );
  }

  checkUncheckAll() {
    for (var i = 0; i < this.trainingProviderS.length; i++) {
      this.trainingProviderS[i].isSelected = this.isCheck;
    }
    this.getCheckedItemList();
  }

  isAllSelected() {
    this.isCheck = this.trainingProviderS.every(function(item:any) {
        return item.isSelected == true;
      })
    this.getCheckedItemList();
  }
  
  getCheckedItemList(){
    this.SelectedTrainingProvider = [];
    for (let i = 0; i < this.trainingProviderS.length; i++) {
      if(this.trainingProviderS[i].isSelected)
      this.SelectedTrainingProvider.push(this.trainingProviderS[i]);
    }
    console.log(this.SelectedTrainingProvider);
    // this.SelectedTrainingProvider = JSON.stringify(this.checkedCategoryList);
  }

  selectDeselectTrainee(id) {
    this.SelectedTrainingProvider.includes(id)
      ? (this.SelectedTrainingProvider = this.SelectedTrainingProvider.filter(
          code => code != id
        ))
      : this.SelectedTrainingProvider.push(id);
    console.log(this.SelectedTrainingProvider);
  }
  
}
