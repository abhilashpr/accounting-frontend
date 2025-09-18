import { Component, OnInit, ViewChild } from '@angular/core';
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
import { DrawerModule } from 'primeng/drawer';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { PackageSchema } from '@/types/superAdmin';
import { Superadmin } from '@/service/superadmin';
import { ApiResponse } from '@/types/apiResponse';

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
    DrawerModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './package.html',
  styleUrl: './package.scss'
})
export class Package implements OnInit{
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

  packages: PackageSchema[] = []

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly fb: FormBuilder,
    private readonly superAdminService:Superadmin
  ) {
    this.packageForm = this.createForm();
  }

  ngOnInit(): void {
    this.getPackages()
  }

  getPackages(){
    this.loading = true
    this.superAdminService.getPackages().subscribe({
      next: (res: ApiResponse<PackageSchema[]>) => {
        this.loading = false
        this.packages = res.data;
      },
      error: (error: any) => {
        this.loading = false
        this.messageService.add({
          styleClass: 'danger-light-popover',
          severity: 'Error',
          summary: 'Error',
          detail: error?.error?.error,
          life: 6000
        });
      }
      
    })
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      price: [0, [Validators.required, Validators.min(0)]],
      duration_days: [30, [Validators.required, Validators.min(1)]],
      maximum_branches: [1, [Validators.required, Validators.min(1)]],
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
      duration_days: packageData.duration_days,
      maximum_branches: packageData.maximum_branches,
      is_active: packageData.is_active
    });
    this.sidebarVisible = true;
  }

  onSubmit() {
    if (this.packageForm.valid) {
      this.formLoading = true;
      const formData = this.packageForm.value;
      

        if (this.isEditMode) {
          // Update existing package
          this.superAdminService.updatePackage(this.currentPackageId, formData).subscribe({
            next: () => {
              this.formLoading = false;
              this.getPackages()
            },
            error: (error: any) => {
              this.formLoading = false;
              this.messageService.add({
                styleClass: 'danger-light-popover',
                severity: 'Error',
                summary: 'Error',
                detail: error?.error?.error,
                life: 6000
              });
            }
            
          })
        
        } else {
          // Create new package
          this.superAdminService.createPackage(formData).subscribe({
            next: (res: ApiResponse<PackageSchema>) => {
              this.formLoading = false;
              this.getPackages()
              this.messageService.add({
                severity: 'success',
                summary: 'Created',
                detail: `Package "${res.data.name}" has been created successfully`
              });
            },
            error: (error: any) => {
              this.formLoading = false;
              debugger
              this.messageService.add({
                styleClass: 'danger-light-popover',
                severity: 'Error',
                summary: 'Error',
                detail: error?.error?.message,
                life: 6000
              });
            }
            
          })

          
          
        }
        
        
        this.closeSidebar();
        
        
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
        this.superAdminService.deletePackage(packageData.id).subscribe({
          next: () => {
            this.getPackages()
          },
          error: (error: any) => {
            this.messageService.add({
              styleClass: 'danger-light-popover',
              severity: 'Error',
              summary: 'Error',
              detail: error?.error?.message,
              life: 6000
            });
          }
        })
        
       
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