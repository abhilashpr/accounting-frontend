import { CountrySchema } from '@/types/superAdmin';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { ApiResponse } from '@/types/apiResponse';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { DrawerModule } from 'primeng/drawer';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { StatusFormOption, StatusOption } from '@/types/common';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { Superadmin } from '@/service/superadmin';

@Component({
  selector: 'app-country',
  imports: [FormsModule, TableModule,
    ButtonModule,
    SelectModule,
    TooltipModule,
    DrawerModule,
    ConfirmDialogModule,
    ToastModule,
    ReactiveFormsModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    InputTextModule,

  ],
  templateUrl: './country.html',
  styleUrl: './country.scss'
})
export class Country {
  countries: CountrySchema[] = []

  statusOptions: StatusOption[] = [
    { label: 'All Status', value: null },
    { label: 'Active', value: 'Y' },
    { label: 'Inactive', value: 'N' }
  ];

  statusOptionsForm: StatusFormOption[] = [
    { label: 'Active', value: true },
    { label: 'Inactive', value: false }
  ];
  @ViewChild('dt') dt!: Table;


  countryForm!: FormGroup;
  
  sidebarVisible: boolean = false;
  isEditMode: boolean = false;
  loading: boolean = false;
  formLoading: boolean = false;
  selectedCountry: CountrySchema | null = null;

 

  constructor(
    private readonly fb: FormBuilder,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly superAdminService:Superadmin
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadCountries();
  }

  private initForm(): void {
    this.countryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      code: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(3),
        Validators.pattern(/^[A-Za-z]+$/)
      ]],
      phone_code: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]+$/),
        Validators.min(1),
        Validators.max(9999)
      ]],
      currency: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(3),
        Validators.pattern(/^[A-Za-z]+$/)
      ]],
      is_active: ['', Validators.required]
    });
  }

  loadCountries(): void {
    this.loading = true;

    this.superAdminService.getCountries().subscribe({
      next: (res: ApiResponse<CountrySchema[]>) => {
        this.loading = false;
        this.countries = res.data;
      },
      error: (error: any) => {
        this.loading = false;
        this.messageService.add({
          styleClass: 'danger-light-popover',
          severity: 'Error',
          summary: 'Error',
          detail: error?.error?.message,
          life: 6000
        });
      }
    });
    

    
  }

  addCountry(): void {
    this.isEditMode = false;
    this.selectedCountry = null;
    this.countryForm.reset();
    this.countryForm.patchValue({ is_active: true });
    this.sidebarVisible = true;
  }

  editCountry(country: CountrySchema): void {
    this.isEditMode = true;
    this.selectedCountry = country;
    this.countryForm.patchValue({
      name: country.name,
      code: country.code,
      phone_code: country.phone_code,
      currency: country.currency,
      is_active: country.is_active
    });
    this.sidebarVisible = true;
  }

  deleteSelectedCountry(country_id:number): void {
    this.superAdminService.deleteCountry(country_id).subscribe({
      next: (res: ApiResponse<CountrySchema>) => {
        this.loadCountries();
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

  deleteCountry(country: CountrySchema): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${country.name}?`,
      header: 'Delete Country',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.deleteSelectedCountry(country.id);
      }
    });
  }

  private performDelete(country: CountrySchema): void {
    // Mock delete - replace with actual API call
    const index = this.countries.findIndex(c => c.id === country.id);
    if (index > -1) {
      this.countries.splice(index, 1);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `${country.name} has been deleted`
      });
    }

  }

  onSubmit(): void {
    if (this.countryForm.valid) {
      this.formLoading = true;
      const formData = this.countryForm.value;
      
      // Ensure uppercase for codes
      formData.code = formData.code.toUpperCase();
      formData.currency = formData.currency.toUpperCase();

      if (this.isEditMode && this.selectedCountry) {
        this.updateCountry(formData);
      } else {
        this.createCountry(formData);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private createCountry(countryData: any): void {
   
    

 
    this.superAdminService.createCountry(countryData).subscribe({
      next: (response) => {
        this.loadCountries();
        this.formLoading = false;
        this.closeSidebar();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `${countryData.name} has been created`
        });
      },
      error: (error) => {
        this.formLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message
        });
      }
    });
  }

  private updateCountry(countryData: any): void {
    if (!this.selectedCountry) return;
    this.superAdminService.updateCountry(this.selectedCountry.id, countryData).subscribe({
      next: (response) => {
        this.loadCountries();
        this.formLoading = false;
        this.closeSidebar();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `${countryData.name} has been updated`
        });
      },
      error: (error:Error) => {
        this.formLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update country'
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

  onGlobalFilter(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.dt.filterGlobal(target.value, 'contains');
  }

  // Input formatting methods
  onCodeInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    target.value = target.value.toUpperCase().replace(/[^A-Za-z]/g, '');
    this.countryForm.get('code')?.setValue(target.value);
  }

  onPhoneCodeInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    target.value = target.value.replace(/[^0-9]/g, '');
    this.countryForm.get('phone_code')?.setValue(target.value);
  }

  onCurrencyInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    target.value = target.value.toUpperCase().replace(/[^A-Za-z]/g, '');
    this.countryForm.get('currency')?.setValue(target.value);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.countryForm.controls).forEach(key => {
      this.countryForm.get(key)?.markAsTouched();
    });
  }

  // Helper methods for validation display
  isFieldInvalid(fieldName: string): boolean {
    const field = this.countryForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.countryForm.get(fieldName);
    return !!(field && field.valid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.countryForm.get(fieldName);
    if (field && field.errors && field.touched) {
      const errors = field.errors;
      
      if (errors['required']) return `${fieldName} is required`;
      if (errors['minlength']) return `${fieldName} is too short`;
      if (errors['maxlength']) return `${fieldName} is too long`;
      if (errors['pattern']) return `${fieldName} format is invalid`;
      if (errors['min']) return `${fieldName} value is too small`;
      if (errors['max']) return `${fieldName} value is too large`;
    }
    return '';
  }

}
