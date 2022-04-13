export enum QAType {
    Question = 1,
    Reply = 2
}

export enum recipientType {
    Question = 1,
    Reply = 2
}

export interface messageDTO {
    courseMessageId: number,
    subject: string,
    message: string,
    courseId: number,
    senderEmail: string,
    recipients: [
      {
        recipientId: string,
        recipientType: number
      }
    ],
    createdBy: string,
    updatedBy: string,
    companyId: number
}