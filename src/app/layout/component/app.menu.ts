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
                items: [
                    { label: 'Package', icon: 'pi pi-users', routerLink: ['/superadmin/package'] },
                    {
                        label: 'General Settings',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            {
                                label: 'Country',
                                icon: 'pi pi-fw pi-sign-in',
                                routerLink: ['/superadmin/country']
                            },
                            {
                                label: 'State',
                                icon: 'pi pi-fw pi-sign-in',
                                routerLink: ['/superadmin/state']
                            },
                            {
                                label: 'City',
                                icon: 'pi pi-fw pi-sign-in',
                                routerLink: ['/superadmin/city']
                            },
                            {
                                label: 'Company-File',
                                icon: 'pi pi-fw pi-sign-in',
                                routerLink: ['/superadmin/company-file']
                            }
                        ]
                    }
                ]
            }, {
                label: 'Company',
                items: [
                    { label: 'Company', icon: 'pi pi-users', routerLink: ['/superadmin/company'] },

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
