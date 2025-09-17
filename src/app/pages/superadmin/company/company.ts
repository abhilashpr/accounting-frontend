import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-company',
  imports: [FormsModule, TableModule],
  templateUrl: './company.html',
  styleUrl: './company.scss'
})
export class Company {
  companies : any[] = [];

}
