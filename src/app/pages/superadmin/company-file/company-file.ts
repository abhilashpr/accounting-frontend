import { CompanyFileSchema } from '@/types/superAdmin';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-company-file',
  imports: [FormsModule, TableModule, InputIconModule, IconFieldModule, InputTextModule, ButtonModule, TagModule],
  templateUrl: './company-file.html',
  styleUrl: './company-file.scss'
})
export class CompanyFile {
  companyFiles: CompanyFileSchema[] = [
    {
      id: 1,
      file_name: "test",
      is_active: true
    },
    {
      id: 2,
      file_name: "Demo",
      is_active: true
    }
  ]

  onGlobalFilter(event: Event) {
    const target = event.target as HTMLInputElement;
    // this.table.filterGlobal(target.value, 'contains');
  }
  addCompanyFile(){

  }

  editCompanyFile(data: CompanyFileSchema){

  }

  deleteCompanyFile(data: CompanyFileSchema){

  }

}
