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

    triggerSucessAlert(message: string, title?: string, callback?: (res: any) => any) {
        SwalConfig2.fire({
            title: title,
            // icon: 'success',
            html: `<p class="alert alert-success"> 
                        <span class="pe-3">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 11.0799V11.9999C21.9988 14.1563 21.3005 16.2545 20.0093 17.9817C18.7182 19.7088 16.9033 20.9723 14.8354 21.5838C12.7674 22.1952 10.5573 22.1218 8.53447 21.3744C6.51168 20.6271 4.78465 19.246 3.61096 17.4369C2.43727 15.6279 1.87979 13.4879 2.02168 11.3362C2.16356 9.18443 2.99721 7.13619 4.39828 5.49694C5.79935 3.85768 7.69279 2.71525 9.79619 2.24001C11.8996 1.76477 14.1003 1.9822 16.07 2.85986" stroke="#219653" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M22 4L12 14.01L9 11.01" stroke="#219653" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>                        
                        </span> 
                        <span>${message}</span> 
                    </p>`,
        }).then((res: any) => {
            if(callback){
            callback(res)
            }
        })
    }

    triggerErrorAlert(message: any, title?: any) {
        SwalConfirmation.fire({
            title: title,
            // icon: 'error',
            html: `<p class="alert alert-danger"> 
                        <span class="pe-3">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.2908 3.8602L1.82075 18.0002C1.64612 18.3026 1.55372 18.6455 1.55274 18.9947C1.55176 19.3439 1.64224 19.6873 1.81518 19.9907C1.98812 20.2941 2.23748 20.547 2.53846 20.7241C2.83944 20.9012 3.18155 20.9964 3.53075 21.0002H20.4708C20.82 20.9964 21.1621 20.9012 21.463 20.7241C21.764 20.547 22.0134 20.2941 22.1863 19.9907C22.3593 19.6873 22.4497 19.3439 22.4488 18.9947C22.4478 18.6455 22.3554 18.3026 22.1808 18.0002L13.7108 3.8602C13.5325 3.56631 13.2815 3.32332 12.9819 3.15469C12.6824 2.98605 12.3445 2.89746 12.0008 2.89746C11.657 2.89746 11.3191 2.98605 11.0196 3.15469C10.72 3.32332 10.469 3.56631 10.2908 3.8602V3.8602Z" stroke="#F03D3E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M12 9V13" stroke="#F03D3E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M12 16V16.5" stroke="#F03D3E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>                                              
                        </span> 
                        <span>${message}</span> 
                    </p>`,
            }).then(() => {
        });
    }

    triggerWarningAlert(message: any, title?: any) {
        SwalConfig.fire({
                title: title,
                // icon: 'warning',
                html: `<p class="alert alert-danger"> 
                    <span class="pe-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.2908 3.8602L1.82075 18.0002C1.64612 18.3026 1.55372 18.6455 1.55274 18.9947C1.55176 19.3439 1.64224 19.6873 1.81518 19.9907C1.98812 20.2941 2.23748 20.547 2.53846 20.7241C2.83944 20.9012 3.18155 20.9964 3.53075 21.0002H20.4708C20.82 20.9964 21.1621 20.9012 21.463 20.7241C21.764 20.547 22.0134 20.2941 22.1863 19.9907C22.3593 19.6873 22.4497 19.3439 22.4488 18.9947C22.4478 18.6455 22.3554 18.3026 22.1808 18.0002L13.7108 3.8602C13.5325 3.56631 13.2815 3.32332 12.9819 3.15469C12.6824 2.98605 12.3445 2.89746 12.0008 2.89746C11.657 2.89746 11.3191 2.98605 11.0196 3.15469C10.72 3.32332 10.469 3.56631 10.2908 3.8602V3.8602Z" stroke="#F03D3E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M12 9V13" stroke="#F03D3E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M12 16V16.5" stroke="#F03D3E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>                                              
                    </span> 
                    <span>${message}</span> 
                </p>`,
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