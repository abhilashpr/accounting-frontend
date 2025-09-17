import { StateSchema } from '@/types/superAdmin';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-state',
  imports: [FormsModule, TableModule],
  templateUrl: './state.html',
  styleUrl: './state.scss'
})
export class State {
  states: StateSchema[] = [
    {
      id: 1,
      name: "Tamil Nadu",
      country_id: 1,
      is_active: true,
      country: {
        id: 1,
        name: "India",
        code: "IN",
        phone_code: "+91",
        currency: "INR",
        is_active: true,
      },
    },
    {
      id: 2,
      name: "California",
      country_id: 2,
      is_active: true,
      country: {
        id: 2,
        name: "United States",
        code: "US",
        phone_code: "+1",
        currency: "USD",
        is_active: true,
      },
    },
    {
      id: 3,
      name: "Tokyo",
      country_id: 3,
      is_active: false,
      country: {
        id: 3,
        name: "Japan",
        code: "JP",
        phone_code: "+81",
        currency: "JPY",
        is_active: true,
      },
    },
  ];

}
