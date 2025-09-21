import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailDeliveryLog } from './email-delivery-log';

describe('EmailDeliveryLog', () => {
  let component: EmailDeliveryLog;
  let fixture: ComponentFixture<EmailDeliveryLog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailDeliveryLog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailDeliveryLog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
