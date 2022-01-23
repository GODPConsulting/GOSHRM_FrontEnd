import { Component, OnInit } from "@angular/core";
declare const $: any;

@Component({
  selector: "app-training-provider",
  templateUrl: "./training-provider.component.html",
  styleUrls: ["./training-provider.component.css"],
})

export class TrainingProviderComponent implements OnInit {
   public spinner: boolean = false;
   public showCurrentPassword: boolean = false;
   public dtOptions: DataTables.Settings = {};
   public isCheck: boolean = false;
   public trainingProviderS: any[] = [];
   public SelectedTrainingProvider: any[] = [];

  constructor() {
  }

  ngOnInit(): void {}

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
