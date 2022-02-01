export interface Facilitator {
    instructorId: number,
    instructor_Image: number,
    instructor_Name: string,
    trainingInstructorEmail: string,
    bios: string,
    courses_Facilitator: number,
    linkedin_Link: string,
    twitter_Link: string,
    trainingProviderId: number,
    active: boolean,
    deleted: boolean,
    companyId: number
}

export interface FacilitatorCourses {
    course_Name: string,
    trainingInstructorId: number,
    facilated_Date: string,
    course_Title: string,
    delivery_Type: string,
    course_Created: string,
    difficulty_Level: string,
    duration: string,
    noOfViews: number,
    ratings: number,
    active: boolean,
    deleted: boolean,
    companyId: number
}