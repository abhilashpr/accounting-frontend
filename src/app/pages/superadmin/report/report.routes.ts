import { Routes } from "@angular/router";
import { EmailDeliveryLog } from "./email-delivery-log/email-delivery-log";
import { SubscriptionRevenue } from "./subscription-revenue/subscription-revenue";
import { TopUsedPackage } from "./top-used-package/top-used-package";

export default [
    { path: '', pathMatch: 'full', redirectTo: 'email-delivery-log' },
    { path: 'email-delivery-log', component: EmailDeliveryLog },
    { path: 'subscription-revenue', component: SubscriptionRevenue },
    { path: 'top-used-package', component: TopUsedPackage }

] as Routes;