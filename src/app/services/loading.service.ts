import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _selector: string = 'page-preloader';
  private _element: HTMLElement;
  loading: boolean = false; // spinner

  constructor() {
    this._element = document.getElementById(this._selector);
  }

  public show(): void {
    this._element.style.display = 'block';
  }

  async hide(delay: number = 0):Promise<any> {

    this._element.style.display = 'none';

  }
}
