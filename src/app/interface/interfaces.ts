export interface KpiCategory {
  id: number;
  name: string;
  description: string;
  employeePermitted: number;
  weightModel: number;
  hrSelectReviewer: number;
  employeePermittedName: string;
  weightModelName: string;
  hrSelectReviewerName: string;
  excelLineNumber: number;
}

export interface EmployeeKPI {
  employeeObjectiveIdicatorId: number;
  kpiCategoryId: number;
  kpi: number;
  objective: string;
  successMeasure: string;
  keyActions: string;
  targetDate: Date;
  weightmodel: number;
  jobGrade: number;
  employee: number;
  department: number;
  appraisalCycleId: number;
}

export interface IHighSchool {
  id: number;
  subject: string;
}

export interface ISearchColumn {
  field: string;
  header: string;
}

export interface IKpiCategory {
  id: number;
  name: string;
  description: string;
  employeePermitted: number;
  weightModel: number;
  hrSelectReviewer: number;
  employeePermittedName: string;
  weightModelName: string;
  hrSelectReviewerName: string;
  excelLineNumber: number;
}

export interface IKpis {
  id: number;
  kpiCategoryId: number;
  kpi: string;
  description: string;
  resultFromExternal: number;
  kpiCategoryName: string;
  resultFromExternalName: string;
  excelLineNumber: number;
}

export interface IGradeSettings {
  id: number;
  minimum: number;
  maximum: number;
  grade: string;
  description: string;
}

export interface IPointSetting {
  id: number;
  pointName: string;
  point: number;
  description: string;
}

export interface IAppraisalCycle {
  allowMultipleCycle: boolean;
  calenderRange: string;
  revieweeWeight: number;
  appraisalCycleId: number;
  reviewYear: number;
  startPeriod: string;
  endPeriod: string;
  dueDate: string;
  reviewerOneWeight: number;
  reviewerTwoWeight: number;
  reviewerThreeWeight: number;
  status: number;
  department: number;
}

export interface AppraisalObjective {
  id: number;
  reviewYear: number;
  reviewPeriod: string;
  employee: number;
  lineManger: number;
  jobGradeId: number;
  firstReviewer: number;
  secondReviewer: number;
  thirdReviewer: number;
  comment: string;
  appraisalCycleId: number;
  department: number;
}
export interface ThreesixtyFeedback {
  score: number;
  pointAwarded: number;
  companyName: string;
  jobTitleName: string;
  revieweeName: string;
  reviewCycle: any;
  employeePerformanceFeedback360Id: number;
  maximumPossiblepoint: number;
  reviewerOneName: string;
  office: string;
  requestDate: Date;
  status: boolean;
  statusName: string;
}
export interface KudosComment {
  commentId: number;
  comment: string;
  createdOn: Date;
  kpiId: number;
  staffId: number;

}

export interface KudosScore {
  id: number;
  reviewScore: number;
  kpiId: number;
  staffId: number;
  appraisalCycleId: number;
  revieweeId: number;

}
export interface KudosFeedback {
  appraisalNuggetId: number;
  revieweeId: number;
  reviewerOneId: number;
  appraisalCycleId: number;
  companyId: number;
}
export interface ThreeSixtyFeedback {
  employeePerformanceFeedback360Id: number;
  revieweeId: number;
  reviewerOneId: number;
  appraisalCycleId: number;
  companyId: number;
}
