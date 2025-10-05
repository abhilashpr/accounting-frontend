import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { ApiResponse } from '@/types/apiResponse';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { DrawerModule } from 'primeng/drawer';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { StatusFormOption } from '@/types/common';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { Superadmin } from '@/service/superadmin';
import { CommonModule, CurrencyPipe } from '@angular/common';

// Company interfaces
interface CompanySchema {
  id: number;
  name: string;
  address_line1: string;
  address_line2?: string;
  email: string;
  phone: string;
  is_active: boolean;
  admin?: {
    id: number;
    name?: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  current_package: {
    package: {
      id: number;
      name: string;
      price: number;
    };
  };
  created_at?: string;
  updated_at?: string;
}

interface PackageSchema {
  id: number;
  name: string;
  price: number;
  description?: string;
  is_active: boolean;
}

@Component({
  selector: 'app-company',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    TagModule,
    ButtonModule,
    IconFieldModule,
    InputTextModule,
    InputIconModule,
    TooltipModule,
    DrawerModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    SelectModule,
    CurrencyPipe,
    CommonModule
  ],
  templateUrl: './company.html',
  styleUrl: './company.scss'
})
export class Company implements OnInit {
  companies: CompanySchema[] = [];
  packages: PackageSchema[] = [];

  statusOptionsForm: StatusFormOption[] = [
    { label: 'Active', value: true },
    { label: 'Inactive', value: false }
  ];

  @ViewChild('dt') dt!: Table;

  companyForm!: FormGroup;
  
  sidebarVisible: boolean = false;
  viewDialogVisible: boolean = false;
  isEditMode: boolean = false;
  loading: boolean = false;
  formLoading: boolean = false;
  selectedCompany: CompanySchema | null = null;

  private readonly superAdminService: Superadmin = inject(Superadmin);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly fb = inject(FormBuilder);

  constructor() {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadCompanies();
    this.loadPackages();
  }

  private initForm(): void {
    this.companyForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      address_line1: ['', [Validators.required, Validators.minLength(5)]],
      address_line2: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      admin_first_name: ['', [Validators.required, Validators.minLength(2)]],
      admin_last_name: ['', [Validators.required, Validators.minLength(2)]],
      admin_email: ['', [Validators.required, Validators.email]],
      admin_password: ['', [Validators.minLength(6)]],
      package_id: [''],
      package_start_date: [''],
      is_active: [true, Validators.required]
    });
  }

  loadCompanies(): void {
    this.loading = true;

    this.superAdminService.getCompanies().subscribe({
      next: (res: ApiResponse<CompanySchema[]>) => {
        this.loading = false;
        this.companies = res.data;
      },
      error: (error: any) => {
        this.loading = false;
        this.messageService.add({
          styleClass: 'danger-light-popover',
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message || 'Failed to load companies',
          life: 6000
        });
      }
    });
  }

  loadPackages(): void {
    this.superAdminService.getPackages().subscribe({
      next: (res: ApiResponse<any[]>) => {
        this.packages = res.data.map(pkg => ({
          ...pkg,
          is_active: pkg.is_active === true || pkg.is_active === 'true'
        }));
      },
      error: (error: any) => {
        this.messageService.add({
          styleClass: 'danger-light-popover',
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message || 'Failed to load packages',
          life: 6000
        });
      }
    });
  }

  addCompany(): void {
    this.isEditMode = false;
    this.selectedCompany = null;
    this.companyForm.reset();
    this.companyForm.patchValue({ is_active: true });
    
    // Set required validators for create mode
    this.companyForm.get('admin_password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.companyForm.get('package_id')?.setValidators([Validators.required]);
    this.companyForm.get('package_start_date')?.setValidators([Validators.required]);
    
    // Update form validation
    this.companyForm.get('admin_password')?.updateValueAndValidity();
    this.companyForm.get('package_id')?.updateValueAndValidity();
    this.companyForm.get('package_start_date')?.updateValueAndValidity();
    
    this.sidebarVisible = true;
  }

  editCompany(company: CompanySchema): void {
    this.isEditMode = true;
    this.selectedCompany = company;
    
    // Clear validators for edit mode (password and package not needed)
    this.companyForm.get('admin_password')?.clearValidators();
    this.companyForm.get('package_id')?.clearValidators();
    this.companyForm.get('package_start_date')?.clearValidators();
    
    // Update form validation
    this.companyForm.get('admin_password')?.updateValueAndValidity();
    this.companyForm.get('package_id')?.updateValueAndValidity();
    this.companyForm.get('package_start_date')?.updateValueAndValidity();
    
    this.companyForm.patchValue({
      name: company.name,
      address_line1: company.address_line1,
      address_line2: company.address_line2 || '',
      email: company.email,
      phone: company.phone,
      admin_first_name: company.admin?.first_name || '',
      admin_last_name: company.admin?.last_name || '',
      admin_email: company.admin?.email || '',
      is_active: company.is_active
    });
    
    this.sidebarVisible = true;
  }

  viewCompany(company: CompanySchema): void {
    this.selectedCompany = company;
    this.viewDialogVisible = true;
  }

  deleteCompany(company: CompanySchema): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${company.name}? This action cannot be undone.`,
      header: 'Delete Company',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.deleteSelectedCompany(company.id);
      }
    });
  }

  private deleteSelectedCompany(companyId: number): void {
    this.superAdminService.deleteCompany(companyId).subscribe({
      next: (res: ApiResponse<any>) => {
        this.loadCompanies();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Company has been deleted successfully'
        });
      },
      error: (error: any) => {
        this.messageService.add({
          styleClass: 'danger-light-popover',
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message || 'Failed to delete company',
          life: 6000
        });
      }
    });
  }

  onSubmit(): void {
    if (this.companyForm.valid) {
      this.formLoading = true;
      const formData = this.companyForm.value;

      if (this.isEditMode && this.selectedCompany) {
        this.updateCompany(formData);
      } else {
        this.createCompany(formData);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private createCompany(companyData: any): void {
    this.superAdminService.createCompany(companyData).subscribe({
      next: (response) => {
        this.loadCompanies();
        this.formLoading = false;
        this.closeSidebar();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `${companyData.name} has been created successfully`
        });
      },
      error: (error) => {
        this.formLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to create company'
        });
      }
    });
  }

  private updateCompany(companyData: any): void {
    if (!this.selectedCompany) return;
    
    // Remove password and package fields from update data
    const updateData = { ...companyData };
    delete updateData.admin_password;
    delete updateData.package_id;
    delete updateData.package_start_date;
    
    this.superAdminService.updateCompany(this.selectedCompany.id, updateData).subscribe({
      next: (response) => {
        this.loadCompanies();
        this.formLoading = false;
        this.closeSidebar();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `${companyData.name} has been updated successfully`
        });
      },
      error: (error: Error) => {
        this.formLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update company'
        });
      }
    });
  }

  closeSidebar(): void {
    this.sidebarVisible = false;
    this.companyForm.reset();
    this.selectedCompany = null;
    this.isEditMode = false;
    this.formLoading = false;
  }

  onSidebarHide(): void {
    this.closeSidebar();
  }

  onGlobalFilter(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.dt.filterGlobal(target.value, 'contains');
  }

  private markFormGroupTouched(): void {
    Object.keys(this.companyForm.controls).forEach(key => {
      this.companyForm.get(key)?.markAsTouched();
    });
  }

  // Helper methods for validation display
  isFieldInvalid(fieldName: string): boolean {
    const field = this.companyForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.companyForm.get(fieldName);
    return !!(field && field.valid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.companyForm.get(fieldName);
    if (field && field.errors && field.touched) {
      const errors = field.errors;
      
      if (errors['required']) return `${this.getFieldDisplayName(fieldName)} is required`;
      if (errors['email']) return 'Please enter a valid email address';
      if (errors['minlength']) return `${this.getFieldDisplayName(fieldName)} is too short`;
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const fieldNames: { [key: string]: string } = {
      'name': 'Company name',
      'address_line1': 'Address',
      'email': 'Email',
      'phone': 'Phone number',
      'admin_first_name': 'First name',
      'admin_last_name': 'Last name',
      'admin_email': 'Admin email',
      'admin_password': 'Password',
      'package_id': 'Package',
      'package_start_date': 'Start date'
    };
    return fieldNames[fieldName] || fieldName;
  }
}