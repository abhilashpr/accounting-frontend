import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
// import { SidebarModule } from 'primeng/sidebar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { PackageSchema } from '@/types/superAdmin';

interface StatusOption {
  label: string;
  value: string | null;
}

interface StatusFormOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-package',
  imports: [
    CommonModule,
    TableModule,
    ReactiveFormsModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    InputNumberModule,
    TagModule,
    ButtonModule,
    SelectModule,
    TooltipModule,
    // SidebarModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './package.html',
  styleUrl: './package.scss'
})
export class Package {
  @ViewChild('dt') table!: Table;

  loading: boolean = false;
  selectedStatus: string | null = null;
  
  // Sidebar properties
  sidebarVisible: boolean = false;
  isEditMode: boolean = false;
  formLoading: boolean = false;
  currentPackageId: number = 0;

  // Form
  packageForm: FormGroup;
  
  statusOptions: StatusOption[] = [
    { label: 'All Status', value: null },
    { label: 'Active', value: 'Y' },
    { label: 'Inactive', value: 'N' }
  ];

  statusOptionsForm: StatusFormOption[] = [
    { label: 'Active', value: 'Y' },
    { label: 'Inactive', value: 'N' }
  ];

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

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.packageForm = this.createForm();
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      price: [0, [Validators.required, Validators.min(0)]],
      duration: [30, [Validators.required, Validators.min(1)]],
      maxBranch: [1, [Validators.required, Validators.min(1)]],
      is_active: ['Y', Validators.required]
    });
  }

  onGlobalFilter(event: Event) {
    const target = event.target as HTMLInputElement;
    this.table.filterGlobal(target.value, 'contains');
  }

  onStatusFilter(event: any) {
    const value = event.value;
    if (value === null) {
      this.table.filter(null, 'is_active', 'equals');
    } else {
      this.table.filter(value, 'is_active', 'equals');
    }
  }

  addPackage() {
    this.isEditMode = false;
    this.currentPackageId = 0;
    this.packageForm.reset({
      name: '',
      price: 0,
      duration: 30,
      maxBranch: 1,
      is_active: 'Y'
    });
    this.sidebarVisible = true;
  }

  editPackage(packageData: PackageSchema) {
    this.isEditMode = true;
    this.currentPackageId = packageData.id;
    this.packageForm.patchValue({
      name: packageData.name,
      price: packageData.price,
      duration: packageData.duration,
      maxBranch: packageData.maxBranch,
      is_active: packageData.is_active
    });
    this.sidebarVisible = true;
  }

  onSubmit() {
    if (this.packageForm.valid) {
      this.formLoading = true;
      const formData = this.packageForm.value;
      
      // Simulate API delay
      setTimeout(() => {
        if (this.isEditMode) {
          // Update existing package
          const index = this.packages.findIndex(pkg => pkg.id === this.currentPackageId);
          if (index !== -1) {
            this.packages[index] = {
              ...this.packages[index],
              ...formData
            };
          }
          
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: `Package "${formData.name}" has been updated successfully`
          });
        } else {
          // Create new package
          const newPackage: PackageSchema = {
            id: Math.max(...this.packages.map(p => p.id)) + 1,
            ...formData
          };
          this.packages.push(newPackage);
          
          this.messageService.add({
            severity: 'success',
            summary: 'Created',
            detail: `Package "${formData.name}" has been created successfully`
          });
        }
        
        this.formLoading = false;
        this.closeSidebar();
        
        // TODO: Replace with actual API calls
        // if (this.isEditMode) {
        //   this.packageService.updatePackage(this.currentPackageId, formData).subscribe(...)
        // } else {
        //   this.packageService.createPackage(formData).subscribe(...)
        // }
      }, 1000);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.packageForm.controls).forEach(key => {
        this.packageForm.get(key)?.markAsTouched();
      });
    }
  }

  closeSidebar() {
    this.sidebarVisible = false;
  }

  onSidebarHide() {
    this.packageForm.reset();
    this.isEditMode = false;
    this.currentPackageId = 0;
    this.formLoading = false;
  }

  deletePackage(packageData: PackageSchema) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the package "${packageData.name}"?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        // Remove package from array (for static data)
        this.packages = this.packages.filter(pkg => pkg.id !== packageData.id);
        
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: `Package "${packageData.name}" has been deleted successfully`
        });
        
        // TODO: When integrating with API, call delete service here
        // this.packageService.deletePackage(packageData.id).subscribe(...)
      }
    });
  }

  // Method to reset all filters
  clearFilters() {
    this.table.clear();
    this.selectedStatus = null;
  }

  // Method to refresh data (useful when integrating with API)
  refreshData() {
    this.loading = true;
    // TODO: Replace with API call
    setTimeout(() => {
      this.loading = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Refreshed',
        detail: 'Package data has been refreshed'
      });
    }, 1000);
  }
}