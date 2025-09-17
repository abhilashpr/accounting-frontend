import { CompanyFileSchema } from '@/types/superAdmin';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-company-file',
  imports: [FormsModule, TableModule],
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

}
