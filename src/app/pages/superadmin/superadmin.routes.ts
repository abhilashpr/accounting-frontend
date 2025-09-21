import { Routes } from "@angular/router";
import { Package } from "./package/package";
import { Company } from "./company/company";
import { CompanyFile } from "./company-file/company-file";
import { Country } from "./country/country";
import { State } from "./state/state";
import { City } from "./city/city";
import { EmailSetting } from "./email-setting/email-setting";

export default [
    { path: 'package', component: Package },
    { path: 'company', component: Company },
    { path: 'company-file', component: CompanyFile },
    { path: 'country', component: Country },
    { path: "state", component: State },
    { path: 'city', component: City },
    { path: 'email-setting', component: EmailSetting },
    { path: 'report', loadChildren: () => import('./report/report.routes') }
] as Routes;