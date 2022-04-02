export interface Profile {
    companyId: number,
    full_Name: string,
    email_Address: string,
    phone_Number: string,
    physical_Address: string,
    photoUrl: string,
    aboutInfo: string,
    industryTypes: string,
    specializationTypes: string,
    active: boolean,
    deleted: boolean,
    trainingProviderId: 0
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