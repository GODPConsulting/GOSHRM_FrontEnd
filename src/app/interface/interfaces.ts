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
  employeePerformId: number;
  reviewStatusName: string;
  endDate: string;
  startDate: string;
  statusName: string;
  companyName: string;
  year_In_Company: string;
  year_In_Position: string;
  position: string;
  employeeName: string;
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
  isSubmitted?: boolean;
  employeeName: string;
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
  revieweeId: number;
  appraisalCycleId: number;
  commentId: number;
  comment: string;
  createdOn: Date;
  kpiId: number;
  staffId: number;
}

export interface KudosScore {
  revieweeId: number;
  appraisalCycleId: number;
  id: number;
  reviewScore: number;
  kpiId: number;
  staffId: number;
}
export interface Kudos {
  kpicategoryName: string;
  comments: string;
  scores: number;
}
export interface KudosFeedback {
  payloads?: Kudos[];
  endPeriod?: string;
  officeName?: string;
  jobGradeName?: string;
  startperiod?: string;
  companyName?: string;
  appraisalNuggetId: number;
  revieweeId: number;
  reviewerOneId: number;
  appraisalCycleId: number;
  companyId: number;
  lengthOfService?: string;
  revieweeJobTitleName?: string;
  revieweeName?: string;
}
export interface ThreeSixtyFeedback {
  employeePerformanceFeedback360Id: number;
  revieweeId: number;
  reviewerOneId: number;
  appraisalCycleId: number;
  companyId: number;
}
export interface CoachingSchedule {
  id: number;
  revieweeId: number;
  reviewerId: number;
  comment: string;
  date: Date;
  time: Date;
  objectiveId: any;
}
export interface AppraisalPreference {
  id: number;
  company: number;
  appraisalCircle: number;
  reviewerOneCommentVisibility: number;
  reviewerTwoCommentVisibility: number;
  reviewerThreeCommentVisibility: number;
  status: number;
  coachPerformanceVisibility: number;
  appraisalCircleName?: any;
  reviewerOneCommentVisibilityName?: any;
  reviewerTwoCommentVisibilityName?: any;
  reviewerThreeCommentVisibilityName?: any;
  statusName?: any;
  coachPerformanceVisibilityName?: any;
}
export interface Appraisal {
  id: number;
  employee: string;
  jobGradeId: number;
  comment?: string;
  appraisalCycleId: number;
  department: number;
  employeePerformId?: number;
}
export interface ThreeSixtyReviewer {
  id: number;
  reviewerId: number[];
  revieweeId: number;
  reviewerSelectedById: number;
  completion?: string;
  submittedOn?: Date;
}
export interface AppraisalCycle {
  appraisalCycleId: number;
  period: string;
  companyId: number;
}
export interface CopyObjectivesPayload {
  comapanyId: number;
}

export interface SearchColumn {
  header: string;
  field: string;
}
