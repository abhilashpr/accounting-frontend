import { CitySchema, CountrySchema, StateSchema } from '@/types/superAdmin';
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
  selector: 'app-city',
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
  templateUrl: './city.html',
  styleUrl: './city.scss'
})
export class City implements OnInit {
  cities: CitySchema[] = [];
  countries: CountrySchema[] = [];
  states: StateSchema[] = [];
  filteredStates: StateSchema[] = [];

  statusOptionsForm: StatusFormOption[] = [
    { label: 'Active', value: true },
    { label: 'Inactive', value: false }
  ];

  @ViewChild('dt') dt!: Table;

  cityForm!: FormGroup;
  
  sidebarVisible: boolean = false;
  isEditMode: boolean = false;
  loading: boolean = false;
  formLoading: boolean = false;
  selectedCity: CitySchema | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly superAdminService: Superadmin
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadCities();
    this.loadCountries();
    this.loadStates();
  }

  private initForm(): void {
    this.cityForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      country_id: ['', Validators.required],
      state_id: ['', Validators.required],
      is_active: [true, Validators.required]
    });
  }

  loadCities(): void {
    this.loading = true;

    this.superAdminService.getCities().subscribe({
      next: (res: ApiResponse<CitySchema[]>) => {
        this.loading = false;
        this.cities = res.data;
      },
      error: (error: any) => {
        this.loading = false;
        this.messageService.add({
          styleClass: 'danger-light-popover',
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message || 'Failed to load cities',
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

  loadStates(): void {
    this.superAdminService.getStates().subscribe({
      next: (res: ApiResponse<StateSchema[]>) => {
        // Filter only active states
        this.states = res.data.filter(state => state.is_active);
      },
      error: (error: any) => {
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

  onCountryChange(event: any): void {
    const countryId = event.value;
    
    // Filter states based on selected country
    this.filteredStates = this.states.filter(state => state.country_id === countryId);
    
    // Reset state selection if country changes
    this.cityForm.get('state_id')?.setValue('');
  }

  addCity(): void {
    this.isEditMode = false;
    this.selectedCity = null;
    this.cityForm.reset();
    this.cityForm.patchValue({ is_active: true });
    this.filteredStates = [];
    this.sidebarVisible = true;
  }

  editCity(city: CitySchema): void {
    this.isEditMode = true;
    this.selectedCity = city;
    
    // Set filtered states based on city's country
    this.filteredStates = this.states.filter(state => state.country_id === city.country_id);
    
    this.cityForm.patchValue({
      name: city.name,
      country_id: city.country_id,
      state_id: city.state_id,
      is_active: city.is_active
    });
    this.sidebarVisible = true;
  }

  deleteSelectedCity(city_id: number): void {
    this.superAdminService.deleteCity(city_id).subscribe({
      next: (res: ApiResponse<null>) => {
        this.loadCities();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'City has been deleted successfully'
        });
      },
      error: (error: any) => {
        this.messageService.add({
          styleClass: 'danger-light-popover',
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message || 'Failed to delete city',
          life: 6000
        });
      }
    });
  }

  deleteCity(city: CitySchema): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${city.name}?`,
      header: 'Delete City',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.deleteSelectedCity(city.id);
      }
    });
  }

  onSubmit(): void {
    if (this.cityForm.valid) {
      this.formLoading = true;
      const formData = this.cityForm.value;

      if (this.isEditMode && this.selectedCity) {
        this.updateCity(formData);
      } else {
        this.createCity(formData);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private createCity(cityData: any): void {
    this.superAdminService.createCity(cityData).subscribe({
      next: (response) => {
        this.loadCities();
        this.formLoading = false;
        this.closeSidebar();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `${cityData.name} has been created successfully`
        });
      },
      error: (error) => {
        this.formLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to create city'
        });
      }
    });
  }

  private updateCity(cityData: any): void {
    if (!this.selectedCity) return;
    
    this.superAdminService.updateCity(this.selectedCity.id, cityData).subscribe({
      next: (response) => {
        this.loadCities();
        this.formLoading = false;
        this.closeSidebar();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `${cityData.name} has been updated successfully`
        });
      },
      error: (error: Error) => {
        this.formLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update city'
        });
      }
    });
  }

  closeSidebar(): void {
    this.sidebarVisible = false;
    this.cityForm.reset();
    this.selectedCity = null;
    this.isEditMode = false;
    this.formLoading = false;
    this.filteredStates = [];
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
    Object.keys(this.cityForm.controls).forEach(key => {
      this.cityForm.get(key)?.markAsTouched();
    });
  }

  // Helper methods for validation display
  isFieldInvalid(fieldName: string): boolean {
    const field = this.cityForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.cityForm.get(fieldName);
    return !!(field && field.valid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.cityForm.get(fieldName);
    if (field && field.errors && field.touched) {
      const errors = field.errors;
      
      if (errors['required']) return `${fieldName} is required`;
      if (errors['minlength']) return `${fieldName} is too short`;
    }
    return '';
  }
}