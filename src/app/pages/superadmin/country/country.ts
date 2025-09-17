import { CountrySchema } from '@/types/superAdmin';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';

@Component({
  selector: 'app-country',
  imports: [FormsModule, TableModule],
  templateUrl: './country.html',
  styleUrl: './country.scss'
})
export class Country {
  countries: CountrySchema[] = [
    {
      id: 1,
      name: "India",
      code: "IN",
      phone_code: "+91",
      currency: "INR",
      is_active: true,
    },
    {
      id: 2,
      name: "United States",
      code: "US",
      phone_code: "+1",
      currency: "USD",
      is_active: true,
    },
    {
      id: 3,
      name: "United Kingdom",
      code: "GB",
      phone_code: "+44",
      currency: "GBP",
      is_active: true,
    },
    {
      id: 4,
      name: "Japan",
      code: "JP",
      phone_code: "+81",
      currency: "JPY",
      is_active: false,
    },
  ];

}
