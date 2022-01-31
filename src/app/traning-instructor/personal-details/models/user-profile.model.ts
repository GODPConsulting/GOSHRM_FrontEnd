export interface Profile {
    companyId: number,
    full_Name: string,
    email_Address: string,
    phone_Number: string,
    physical_Address: string,
    aboutInfo: string,
    industryTypes: string,
    specializationTypes: string,
    active: boolean,
    deleted: boolean,
    trainingProviderId: number,
    trainingInstructorId: number
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
    trainingProviderId: number,
    trainingInstructorId: number
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
    trainingProviderId: number,
    trainingInstructorId: number
}