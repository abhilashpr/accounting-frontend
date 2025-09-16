import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TagModule } from 'primeng/tag';
import { PackageSchema } from '@/types/superAdmin';


@Component({
  selector: 'app-package',
  imports: [
    TableModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    TagModule,

  ],
  templateUrl: './package.html',
  styleUrl: './package.scss'
})
export class Package {
  loading: boolean = true;
  packages: PackageSchema[] = [
    {
      id: 1,
      name: 'Basic',
      price: 19.99,
      duration: 30,
      maxBranch: 1,
      is_active: 'Y'
    },
    {
      id: 2,
      name: 'Standard',
      price: 49.99,
      duration: 90,
      maxBranch: 5,
      is_active: 'Y'
    },
    {
      id: 3,
      name: 'Premium',
      price: 99.99,
      duration: 365,
      maxBranch: 20,
      is_active: 'Y'
    },
    {
      id: 4,
      name: 'Enterprise',
      price: 499.99,
      duration: 365,
      maxBranch: 100,
      is_active: 'Y'
    },
    {
      id: 5,
      name: 'Free Trial',
      price: 0.00,
      duration: 7,
      maxBranch: 1,
      is_active: 'N'
    }
  ];
}
