import { ApiResponse } from '@/types/apiResponse';
import { AddUpdatePackageSchema, PackageSchema } from '@/types/superAdmin';
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
  
  
}
