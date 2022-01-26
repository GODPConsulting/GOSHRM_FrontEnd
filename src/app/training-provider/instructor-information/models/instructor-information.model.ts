export interface PageBanner {
    pageBannerId: number,
    pageBannerNamepageBannerName: string,
    pageBannerTitle: string,
    active: boolean,
    deleted: boolean,
    companyId: number,
    trainingProviderId: number
}

export interface PageContent {
    pageContentId: number,
    page_Name: string,
    page_Title: string,
    section_Content: string,
    active: boolean,
    deleted: boolean,
    companyId: number,
    trainingProviderId: number
}