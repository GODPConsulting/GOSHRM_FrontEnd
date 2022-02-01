import { NgxSpinnerService } from 'ngx-spinner';
import { Injectable } from '@angular/core';
import { SwalConfig2, SwalConfig, SwalConfirmation } from '../../_config/sweetalert';


@Injectable({
    providedIn: 'root'
})
export class HelperService {

    constructor(private spinner: NgxSpinnerService) {

    }

    startSpinner() {
        this.spinner.show();
    }
    
    stopSpinner() {
    this.spinner.hide();
    }

    triggerSucessAlert(title: any, message: any, callback?: (res: any) => any) {
    SwalConfig2.fire({
        title: title,
        icon: 'success',
        html: `<p> ${message} </p>`,
    }).then((res: any) => {
        if(callback){
        callback(res)
        }
    })
    }

    triggerErrorAlert(title: any, message: any) {
        SwalConfirmation.fire({
                title: title,
                icon: 'error',
                html: `<p> ${message} </p>`,
            }).then(() => {
        });
    }

    triggerWarningAlert(title: any, message: any) {
        SwalConfirmation.fire({
                title: title,
                icon: 'warning',
                html: `<p> ${message} </p>`,
            }).then(() => {
        });
    }
    
    triggerUnExpectedErrorAlert(title?: any, message?: any) {
    SwalConfirmation.fire({
        title: title ? title : 'Error',
        icon: 'error',
        html: message ? `<p> ${message} </p>` : `<p> Sorry an unexpected error occurred. </p>`,
    }).then(() => {
    })
    }

    triggerQuestionConfirmationAlert(questionTitle: any, question: any, callback?: () => any) {
    SwalConfig.fire({
        title: `${questionTitle}?`,
        icon: 'question',
        html: `<p>${question}</p>`,
    }).then((result: any) => {
        if (result.value) {
        if(callback){
            callback()
        }
        }
    })
    }
}