export interface Courses  {
    courseId: number,
    decisionType: number,
    createdByType: number,
    providerId: number,
    trainerId: number,
    training_Name: string,
    training_Objective: string,
    training_Transcript: string,
    training_Details: string,
    difficulty_Level: string,
    category: string,
    companyId: number,
    scheduleType: number,
    createdAt: string,
    course_Competence: [
      {
        course_CompeteneceId: number,
        courseId: number,
        name: string
      }
    ],
    course_sector: [
      {
        course_SectorId: number,
        courseId: number,
        sectorName: string
      }
    ],
    delivery_Type: number,
    duration: string,
    cost: number,
    facilitator: string,
    facilitators: [
      {
        course_FacilitatorId: number,
        courseId: number,
        instructorId: number
      }
    ],
    apply_Discount: boolean,
    course_Requirement: [
      {
        courseId: number,
        course_RequirementId: number,
        name: string
      }
    ],
    currencyId: number,
    discount_Rate: number,
    rating: number;
    completence_Assessment: string,
    welcome_message: string,
    congratulation_message: string,
    other_Comments: string,
    addCover_Image: number,
    createdBy: string,
    coursePhotoUrl: string,
    isSelected: boolean
}

export interface CourseOutline  {
    outlineId: number,
    sectionId: number,
    type: number,
    courseId: number,
    trainingProviderId: number,
    trainingInstructorId: number,
    sectionNumber: string,
    section_Name: string,
    outlineName: string,
    outline_Name: string,
    number: string,
    outlineDescription: string,
    outline_Description: string,
    material_Name: string,
    material_Type: number,
    upload_Material: string,
    photoId: string,
    photo: string,
    active: boolean,
    deleted: boolean,
    companyId: number,
    isSelected: boolean
}

export interface CourseAssessment {
    course_AssessmentId: number,
    course: string,
    courseId: number,
    trainingInstructorId: number,
    question: string,
    answers: [{
        answerId: number,
        answer: string,
        isAnswer: boolean
    }],
    active: boolean,
    deleted: boolean,
    companyId: number
}

export enum OutlineType{
  Outline =1,
  Section =2
}

export enum MediaType{
  Image = 1,
  Pdf = 2,
  Video = 3,
}

export enum AssessmentType {
  CourseAssessment = 1,
  LearningAssessment = 2
}