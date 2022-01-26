export interface Security {
    companyId: number,
    securitySetupTypeId: number,
    old_Password: string,
    new_Password: string,
    confirm_Password: string,
    active: boolean,
    deleted: boolean,
    trainingProviderId: number
}