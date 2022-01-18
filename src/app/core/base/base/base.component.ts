import { Location } from '@angular/common';
import { Injectable, Injector } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, TeardownLogic } from 'rxjs';
import { DocstreamSnackbarComponent } from '../docstream-snackbar/docstream-snackbar.component';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseComponent {
  private subscription = new Subscription();
  private location: Location;
  private snackBar: MatSnackBar;
  constructor(private injector: Injector) {
    this.snackBar = this.injector.get<MatSnackBar>(MatSnackBar);
    this.location = this.injector.get<Location>(Location);
  }

  public addSubscription(logic: TeardownLogic): void {
    this.subscription.add(logic);
  }

  public clearSubscription(): void {
    this.subscription.unsubscribe();
  }

  public goBack(): void {
    this.location.back();
  }

  public openSnackBar(message: string, type?: string, timeDuration = 3000) {
    const _type: string = type !== undefined ? type : 'success';
    if (message) {
      this.snackBar.openFromComponent(DocstreamSnackbarComponent, {
        duration: timeDuration,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['docstream_snackbar_success'],
        data: { message: message, type: _type },
      });
    }
  }
}
