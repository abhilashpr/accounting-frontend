import { Routes } from "@angular/router";
import { CompanySetting } from "./company-setting/company-setting";
import { Role } from "./role/role";

export default [
    { path: 'company-setting', component: CompanySetting },
    { path: 'role', component:Role}
] as Routes;