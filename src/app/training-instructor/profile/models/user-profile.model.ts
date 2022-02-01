export interface Profile {
    instructorId: number,
    instructor_Image: number,
    instructor_Name: string,
    physical_Address: string,
    trainingInstructorEmail: string,
    trainingInstructorPhoneNumber: string,
    bios: string,
    courses_Facilitator: number,
    linkedin_Link: string,
    twitter_Link: string,
    trainingProviderId: number,
    active: boolean,
    deleted: boolean,
    companyId: number
}

export interface SocialMedia {
    companyId: number,
    socialMediaId: number,
    linkedInType: string,
    facebookType: string,
    twitterType: string,
    youtubeType: string,
    active: boolean,
    deleted: boolean,
    trainingProviderId: number
}

export interface Website {
    companyId: number,
    websiteId: number,
    website_Name_First: string,
    website_Link_First: string,
    website_Name_Second: string,
    website_Link_Second: string,
    website_Name_Third: string,
    website_Link_Third: string,
    active: boolean,
    deleted: boolean,
    trainingProviderId: number
}