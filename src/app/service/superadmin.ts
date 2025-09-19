import { ApiResponse } from '@/types/apiResponse';
import { AddUpdatePackageSchema, CitySchema, CompanyFileSchema, CountrySchema, PackageSchema, StateSchema } from '@/types/superAdmin';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Superadmin {
  private readonly baseUrl = environment.baseApiUrl;
  constructor(private readonly http: HttpClient) { }

  getPackages() {
    return this.http.get<ApiResponse<PackageSchema[]>>(`${this.baseUrl}super_admin_settings/package`);
  }

  createPackage(data: AddUpdatePackageSchema) {
    return this.http.post<ApiResponse<PackageSchema>>(`${this.baseUrl}super_admin_settings/package`, data);
  }

  updatePackage(package_id:number, data: AddUpdatePackageSchema) {
    return this.http.put<ApiResponse<PackageSchema>>(`${this.baseUrl}super_admin_settings/package/${package_id}`, data);
  }

  deletePackage(package_id:number) {
    return this.http.delete<ApiResponse<PackageSchema>>(`${this.baseUrl}super_admin_settings/package/${package_id}`);
  }

  getCountries() {
    return this.http.get<ApiResponse<CountrySchema[]>>(`${this.baseUrl}super_admin_settings/country`);
  }

  createCountry(data: CountrySchema) {
    return this.http.post<ApiResponse<CountrySchema>>(`${this.baseUrl}super_admin_settings/country`, data);
  }

  updateCountry(country_id:number, data: CountrySchema) {
    return this.http.put<ApiResponse<CountrySchema>>(`${this.baseUrl}super_admin_settings/country/${country_id}`, data);
  }

  deleteCountry(country_id:number) {
    return this.http.delete<ApiResponse<CountrySchema>>(`${this.baseUrl}super_admin_settings/country/${country_id}`);
  }

  getStates() {
    return this.http.get<ApiResponse<StateSchema[]>>(`${this.baseUrl}super_admin_settings/state`);
  }

  createState(data: StateSchema) {
    return this.http.post<ApiResponse<StateSchema>>(`${this.baseUrl}super_admin_settings/state`, data);
  }

  updateState(state_id:number, data: StateSchema) {
    return this.http.put<ApiResponse<StateSchema>>(`${this.baseUrl}super_admin_settings/state/${state_id}`, data);
  }

  deleteState(state_id:number) {
    return this.http.delete<ApiResponse<StateSchema>>(`${this.baseUrl}super_admin_settings/state/${state_id}`);
  }
  
  // CITY

  getCities() {
    return this.http.get<ApiResponse<CitySchema[]>>(`${this.baseUrl}super_admin_settings/city`);
  }

  createCity(data: any) {
    return this.http.post<ApiResponse<CitySchema>>(`${this.baseUrl}super_admin_settings/city`, data);
  }

  updateCity(city_id:number, data: any) {
    return this.http.put<ApiResponse<CitySchema>>(`${this.baseUrl}super_admin_settings/city/${city_id}`, data);
  }

  deleteCity(city_id:number) {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}super_admin_settings/city/${city_id}`);
  }

  // COmpany File

  getCompanyFiles() {
    return this.http.get<ApiResponse<CompanyFileSchema[]>>(`${this.baseUrl}super_admin_settings/company-file`);
  }

  createCompanyFile(data: any) {
    return this.http.post<ApiResponse<CompanyFileSchema>>(`${this.baseUrl}super_admin_settings/company-file`, data);
  }

  updateCompanyFile(file_id:number, data: any) {
    return this.http.put<ApiResponse<CompanyFileSchema>>(`${this.baseUrl}super_admin_settings/company-file/${file_id}`, data);
  }

  deleteCompanyFile(file_id:number) {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}super_admin_settings/company-file/${file_id}`);
  }

  
}
