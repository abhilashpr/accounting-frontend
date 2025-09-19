import { StateSchema, CountrySchema } from '@/types/superAdmin';
import { Component, ViewChild, OnInit } from '@angular/core';
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
import { StatusFormOption } from '@/types/common';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { Superadmin } from '@/service/superadmin';

@Component({
  selector: 'app-state',
  imports: [
    FormsModule,
    TableModule,
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
  templateUrl: './state.html',
  styleUrl: './state.scss'
})
export class State implements OnInit {
  states: StateSchema[] = [];
  countries: CountrySchema[] = [];

  statusOptionsForm: StatusFormOption[] = [
    { label: 'Active', value: true },
    { label: 'Inactive', value: false }
  ];

  @ViewChild('dt') dt!: Table;

  stateForm!: FormGroup;
  
  sidebarVisible: boolean = false;
  isEditMode: boolean = false;
  loading: boolean = false;
  formLoading: boolean = false;
  selectedState: StateSchema | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly superAdminService: Superadmin
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadStates();
    this.loadCountries();
  }

  private initForm(): void {
    this.stateForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      country_id: ['', Validators.required],
      is_active: [true, Validators.required]
    });
  }

  loadStates(): void {
    this.loading = true;

    this.superAdminService.getStates().subscribe({
      next: (res: ApiResponse<StateSchema[]>) => {
        this.loading = false;
        this.states = res.data;
      },
      error: (error: any) => {
        this.loading = false;
        this.messageService.add({
          styleClass: 'danger-light-popover',
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message || 'Failed to load states',
          life: 6000
        });
      }
    });
  }

  loadCountries(): void {
    this.superAdminService.getCountries().subscribe({
      next: (res: ApiResponse<CountrySchema[]>) => {
        // Filter only active countries
        this.countries = res.data.filter(country => country.is_active);
      },
      error: (error: any) => {
        this.messageService.add({
          styleClass: 'danger-light-popover',
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message || 'Failed to load countries',
          life: 6000
        });
      }
    });
  }

  addState(): void {
    this.isEditMode = false;
    this.selectedState = null;
    this.stateForm.reset();
    this.stateForm.patchValue({ is_active: true });
    this.sidebarVisible = true;
  }

  editState(state: StateSchema): void {
    this.isEditMode = true;
    this.selectedState = state;
    this.stateForm.patchValue({
      name: state.name,
      country_id: state.country_id,
      is_active: state.is_active
    });
    this.sidebarVisible = true;
  }

  deleteSelectedState(state_id: number): void {
    this.superAdminService.deleteState(state_id).subscribe({
      next: (res: ApiResponse<StateSchema>) => {
        this.loadStates();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'State has been deleted successfully'
        });
      },
      error: (error: any) => {
        this.messageService.add({
          styleClass: 'danger-light-popover',
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message || 'Failed to delete state',
          life: 6000
        });
      }
    });
  }

  deleteState(state: StateSchema): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${state.name}?`,
      header: 'Delete State',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.deleteSelectedState(state.id);
      }
    });
  }

  onSubmit(): void {
    if (this.stateForm.valid) {
      this.formLoading = true;
      const formData = this.stateForm.value;

      if (this.isEditMode && this.selectedState) {
        this.updateState(formData);
      } else {
        this.createState(formData);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private createState(stateData: any): void {
    this.superAdminService.createState(stateData).subscribe({
      next: (response) => {
        this.loadStates();
        this.formLoading = false;
        this.closeSidebar();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `${stateData.name} has been created successfully`
        });
      },
      error: (error) => {
        this.formLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to create state'
        });
      }
    });
  }

  private updateState(stateData: any): void {
    if (!this.selectedState) return;
    
    this.superAdminService.updateState(this.selectedState.id, stateData).subscribe({
      next: (response) => {
        this.loadStates();
        this.formLoading = false;
        this.closeSidebar();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `${stateData.name} has been updated successfully`
        });
      },
      error: (error: Error) => {
        this.formLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update state'
        });
      }
    });
  }

  closeSidebar(): void {
    this.sidebarVisible = false;
    this.stateForm.reset();
    this.selectedState = null;
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

  // Helper method to get country code for selected country in dropdown
  getCountryCode(selectedCountry: any): string {
    if (typeof selectedCountry === 'object' && selectedCountry.code) {
      return selectedCountry.code;
    }
    // If it's just the ID, find the country in our countries array
    const country = this.countries.find(c => c.id === selectedCountry);
    return country?.code || '';
  }

  private markFormGroupTouched(): void {
    Object.keys(this.stateForm.controls).forEach(key => {
      this.stateForm.get(key)?.markAsTouched();
    });
  }

  // Helper methods for validation display
  isFieldInvalid(fieldName: string): boolean {
    const field = this.stateForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.stateForm.get(fieldName);
    return !!(field && field.valid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.stateForm.get(fieldName);
    if (field && field.errors && field.touched) {
      const errors = field.errors;
      
      if (errors['required']) return `${fieldName} is required`;
      if (errors['minlength']) return `${fieldName} is too short`;
    }
    return '';
  }
}