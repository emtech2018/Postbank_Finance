import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RoutePrivilegeGuard } from "../../data/services/_AccessControlAuthGuard.service";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";

const routes: Routes = [
  // { path: "", component: DashboardComponent },
{ path: '', component: DashboardComponent, canActivate: [RoutePrivilegeGuard], data: { requiredPrivilege: ['Dashboard'] } },];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
