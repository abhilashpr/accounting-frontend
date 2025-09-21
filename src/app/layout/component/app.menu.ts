import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { Auth } from '@/service/auth';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    constructor(private readonly authService: Auth, private readonly router: Router) { }

    ngOnInit() {
        this.model = this.getRoleBasedMenu();

    }


    getRoleBasedMenu() {
        let role = this.authService.getUserRole()
        if (role === 'superadmin') {
            return this.getSuperAdminMenu();
        } else if (role === 'admin' || role === 'staff') {
            let isAdmin = role === 'admin';
            return this.getAdminOrStaffPermissionMenu(isAdmin);
        }
        else {
            this.router.navigate(['auth/login']);
            return []
        }
    }


    getSuperAdminMenu() {
        return [
            {
                label: 'Configuration',
                icon: 'pi pi-cog',
                items: [
                    { label: 'Package', icon: 'pi pi-box', routerLink: ['/superadmin/package'] },
                    {
                        label: 'General Settings',
                        icon: 'pi pi-sliders-h',
                        items: [
                            {
                                label: 'Country',
                                icon: 'pi pi-globe',
                                routerLink: ['/superadmin/country']
                            },
                            {
                                label: 'State',
                                icon: 'pi pi-map',
                                routerLink: ['/superadmin/state']
                            },
                            {
                                label: 'City',
                                icon: 'pi pi-building',
                                routerLink: ['/superadmin/city']
                            },
                            {
                                label: 'Company-File',
                                icon: 'pi pi-folder',
                                routerLink: ['/superadmin/company-file']
                            }
                        ]
                    },
                    {
                        label: 'Email Setting',
                        icon: 'pi pi-envelope',
                        routerLink: ['/superadmin/email-setting']
                    }
                ]
            }, {
                label: 'Company',
                icon: 'pi pi-sitemap',
                items: [
                    { label: 'Company', icon: 'pi pi-building-columns', routerLink: ['/superadmin/company'] },

                ]

            }, {
                label: 'Report & Analysis',
                icon: 'pi pi-chart-bar',
                items: [
                    {
                        label: 'Report',
                        icon: 'pi pi-chart-bar',
                        items: [
                            { label: 'Email Delivery Log', icon: 'pi pi-chart-line', routerLink: ['/superadmin/report/email-delivery-log'] },
                            { label: 'Subscription Revenue', icon: 'pi pi-chart-line', routerLink: ['/superadmin/report/subscription-revenue'] },
                            { label: 'Top Used Package', icon: 'pi pi-chart-line', routerLink: ['/superadmin/report/top-used-package'] },
                        ]
                    }
                ]
            }
        ]
    }

    getAdminOrStaffPermissionMenu(isAdmin: boolean) {
        return [
            {
                label: 'Configuration',
                roles: ['admin', 'staff'],
                items: [
                    { label: 'Company Setting', icon: 'pi pi-users', routerLink: ['/staff/company-setting'] },
                    // { label: 'System Settings', icon: 'pi pi-cog', routerLink: ['/superadmin/settings'] }
                ]
            }
        ]
    }
}
