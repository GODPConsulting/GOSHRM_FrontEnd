export interface Courses  {"courseId": 0,
    trainingProviderId: 0,
    trainingInstructorId: number,
    training_Name: string,
    training_Objective: string,
    training_Requirements: string,
    training_Transcript: string,
    training_Details: string,
    difficulty_Level: string,
    category: string,
    expected_Competence: string,
    company: string,
    suggested_Participant: string,
    delivery_Type: string,
    duration: Date,
    cost: number,
    facilitator: string,
    apply_Discount: string,
    currencyId: number,
    discount_Rate: string,
    completence_Assessment: string,
    welcome_message: string,
    congratulation_message: string,
    other_Comments: string,
    addCover_Image: number,
    active: boolean,
    deleted: boolean,
    companyId: number
}

export interface CourseOutline  {
    courseId: number;
    sectionId: number,
    trainingProviderId: number,
    trainingInstructorId: number,
    section_Name: string,
    section_Number: string,
    outline_Name: string,
    outline_Description: string,
    material_Name: string,
    material_Type: string,
    upload_Material: string,
    active: boolean,
    deleted: boolean,
    companyId: number
}

export interface CourseAssessment {
    course_AssessmentId: number,
    course_Title: string,
    course: string,
    courseId: number,
    trainingInstructorId: number,
    active: boolean,
    deleted: boolean,
    companyId: number
}