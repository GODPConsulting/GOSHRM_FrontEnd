import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocstreamSnackbarComponent } from './base/docstream-snackbar/docstream-snackbar.component';

@NgModule({
  declarations: [DocstreamSnackbarComponent],
  imports: [CommonModule],
  entryComponents: [DocstreamSnackbarComponent],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        `${parentModule} has already been loaded. Import Core module in the AppModule only.`
      );
    }
  }
}
