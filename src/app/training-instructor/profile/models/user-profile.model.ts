export interface Profile {
    companyId: number,
    instructorId: number,
    full_Name: string,
    email_Address: string,
    phone_Number: string,
    physical_Address: string,
    linkedin_Link: string,
    twitter_Link: string,
    aboutInfo: string,
    industryTypes: string,
    specializationTypes: string,
    active: boolean,
    deleted: boolean,
    trainingProviderId: number
}

export interface SocialMedia {
    companyId: number,
    socialMediaId: number,
    socialMediaType: number; 
	socialMediaUrl: string;
    active: boolean,
    deleted: boolean,
    trainingProviderId: number
}

export interface Website {
    companyId: number,
    websiteId: number,
    website_Name: string,
    website_Link: string,
    active: boolean,
    deleted: boolean,
    trainingProviderId: number
}