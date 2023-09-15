import { Directive, TemplateRef, ViewContainerRef, Input } from "@angular/core";
import { CurrentUserService } from "@core/services/current-user.service";

@Directive({
  selector: "[rbacAllow]",
})
export class RbacAllowDirective {
  allowedRoles: string[] = [];
  user: any;
  activities: any;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private _current: CurrentUserService
  ) {
    this.user = this._current.getUser();
    // console.log(this.user);
    this.activities = this.user.activities.map((a: any) => {
      return a.name
    })
  }

  @Input()
  set rbacAllow(allowedRoles: string[]) {
    this.allowedRoles = allowedRoles;
    this.showIfUserAllowed();
  }

  showIfUserAllowed() {
    if (
      !this.user ||
      !this.activities ||
      !this.allowedRoles ||
      this.allowedRoles.length == 0
    ) {
      // console.log('here')
      this.viewContainer.clear();
      return;
    }
    const userRoles = this.activities;
    if (typeof userRoles === "string") {
      if (this.allowedRoles.includes(userRoles)) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        return;
      }
    } else if (typeof userRoles == "object") {
      const isUserAllowed =
        userRoles.filter((value: any) => this.allowedRoles.includes(value)).length >
        0;
      if (isUserAllowed) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        return;
      }
    }
    this.viewContainer.clear();
    return;
  }
}
