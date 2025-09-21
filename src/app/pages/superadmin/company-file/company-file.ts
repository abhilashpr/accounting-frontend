import { CompanyFileSchema } from '@/types/superAdmin';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DrawerModule } from 'primeng/drawer';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Superadmin } from '@/service/superadmin';
import { StatusFormOption } from '@/types/common';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-company-file',
  imports: [
    FormsModule, 
    TableModule, 
    InputIconModule, 
    IconFieldModule, 
    InputTextModule, 
    ButtonModule, 
    TagModule,
    DrawerModule, 
    SelectModule, 
    ReactiveFormsModule, 
    CommonModule,
    ConfirmDialogModule,
    TooltipModule
  ],
  templateUrl: './company-file.html',
  styleUrl: './company-file.scss'
})
export class CompanyFile {
  companyFiles: CompanyFileSchema[] = [];
  isEditMode: boolean = false;
  loading: boolean = false;
  sidebarVisible: boolean = false;
  countryForm!: FormGroup;
  formLoading: boolean = false;
  selectedCountry: CompanyFileSchema | null = null;
  statusOptionsForm: StatusFormOption[] = [
    { label: 'Active', value: true },
    { label: 'Inactive', value: false }
  ];
  
  @ViewChild('dt') dt!: Table;

  constructor(
    private readonly fb: FormBuilder,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly superAdminService: Superadmin
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.loadCompanyFiles();
  }

  loadCompanyFiles() {
    this.loading = true;
    this.superAdminService.getCompanyFiles().subscribe({
      next: (res) => {
        this.loading = false;
        this.companyFiles = res.data;
      },
      error: (error: any) => {
        this.loading = false;
        this.messageService.add({
          styleClass: 'danger-light-popover',
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message || 'Failed to load company files',
          life: 6000
        });
      }
    });
  }

  private initForm(): void {
    this.countryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      is_active: [true, Validators.required]
    });
  }

  onGlobalFilter(event: Event) {
    const target = event.target as HTMLInputElement;
    this.dt.filterGlobal(target.value, 'contains');
  }

  addCompanyFile() {
    this.isEditMode = false;
    this.selectedCountry = null;
    this.countryForm.reset();
    this.countryForm.patchValue({ 
      name: '',
      is_active: true 
    });
    this.sidebarVisible = true;
  }

  editCompanyFile(data: CompanyFileSchema) {
    this.isEditMode = true;
    this.selectedCountry = data;
    this.countryForm.patchValue({
      name: data.file_name,
      is_active: data.is_active
    });
    this.sidebarVisible = true;
  }

  deleteCompanyFile(data: CompanyFileSchema) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${data.file_name}"?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      accept: () => {
        this.performDelete(data);
      }
    });
  }

  private performDelete(data: CompanyFileSchema) {
    this.superAdminService.deleteCompanyFile(data.id).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Company file deleted successfully',
          life: 3000
        });
        this.loadCompanyFiles(); // Reload the data
      },
      error: (error: any) => {
        this.messageService.add({
          styleClass: 'danger-light-popover',
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message || 'Failed to delete company file',
          life: 6000
        });
      }
    });
  }

  onSubmit() {
    if (this.countryForm.valid) {
      this.formLoading = true;
      const formData = this.countryForm.value;
      
      if (this.isEditMode && this.selectedCountry) {
        this.updateCompanyFile(formData);
      } else {
        this.createCompanyFile(formData);
      }
    } else {
      // Mark all fields as touched to show validation errors
      this.countryForm.markAllAsTouched();
    }
  }

  private createCompanyFile(formData: any) {
    const payload = {
      file_name: formData.name,
      is_active: formData.is_active
    };

    this.superAdminService.createCompanyFile(payload).subscribe({
      next: (res) => {
        this.formLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Company file created successfully',
          life: 3000
        });
        this.closeSidebar();
        this.loadCompanyFiles(); // Reload the data
      },
      error: (error: any) => {
        this.formLoading = false;
        this.messageService.add({
          styleClass: 'danger-light-popover',
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message || 'Failed to create company file',
          life: 6000
        });
      }
    });
  }

  private updateCompanyFile(formData: any) {
    if (!this.selectedCountry) return;

    const payload = {
      file_name: formData.name,
      is_active: formData.is_active
    };

    this.superAdminService.updateCompanyFile(this.selectedCountry.id, payload).subscribe({
      next: (res) => {
        this.formLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Company file updated successfully',
          life: 3000
        });
        this.closeSidebar();
        this.loadCompanyFiles(); // Reload the data
      },
      error: (error: any) => {
        this.formLoading = false;
        this.messageService.add({
          styleClass: 'danger-light-popover',
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message || 'Failed to update company file',
          life: 6000
        });
      }
    });
  }

  closeSidebar(): void {
    this.sidebarVisible = false;
    this.countryForm.reset();
    this.selectedCountry = null;
    this.isEditMode = false;
    this.formLoading = false;
  }

  onSidebarHide(): void {
    this.closeSidebar();
  }

  // Getter for easy access to form controls in template
  get formControls() {
    return this.countryForm.controls;
  }

  // Helper method to check if field has error
  hasFieldError(fieldName: string): boolean {
    const field = this.countryForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  // Helper method to get field error message
  getFieldError(fieldName: string): string {
    const field = this.countryForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (field.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'name': 'Company file name',
      'is_active': 'Status'
    };
    return labels[fieldName] || fieldName;
  }
}