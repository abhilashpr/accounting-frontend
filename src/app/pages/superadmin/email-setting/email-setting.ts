import { Component } from '@angular/core';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EmailSettingSchema, EmailTemplateSchema } from '@/types/common';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-email-setting',
  imports: [FormsModule, ReactiveFormsModule, CardModule, InputTextModule, InputNumberModule, SelectModule, ButtonModule, PasswordModule, TextareaModule, TooltipModule, ProgressSpinnerModule, TagModule, DividerModule, ConfirmDialogModule,
    ToggleSwitchModule, TabsModule
   ],
  templateUrl: './email-setting.html',
  styleUrl: './email-setting.scss'
})
export class EmailSetting {
  smtpForm!: FormGroup;
  testEmailForm!: FormGroup;
  
  isEmailEnabled = false;
  savingSettings = false;
  testingConnection = false;
  sendingTest = false;
  
  emailTemplates: EmailTemplateSchema[] = [];

  encryptionOptions = [
    { label: 'None', value: 'none' },
    { label: 'TLS', value: 'tls' },
    { label: 'SSL', value: 'ssl' }
  ];
  activeTab = 0;

  constructor(
    private readonly fb: FormBuilder,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService
  ) {
    this.initForms();
  }

  ngOnInit() {
    this.loadEmailSettings();
    this.loadEmailTemplates();
  }

  private initForms() {
    this.smtpForm = this.fb.group({
      smtp_host: ['', Validators.required],
      smtp_port: [587, [Validators.required, Validators.min(1), Validators.max(65535)]],
      smtp_username: ['', Validators.required],
      smtp_password: ['', Validators.required],
      smtp_encryption: ['tls'],
      from_email: ['', [Validators.required, Validators.email]],
      from_name: ['', Validators.required],
      is_enabled: [false],
      max_send_rate: [null],
      timeout: [30]
    });

    this.testEmailForm = this.fb.group({
      test_email: ['', [Validators.required, Validators.email]],
      test_subject: ['Test Email from Super Admin Panel'],
      test_message: ['This is a test email to verify that your SMTP configuration is working correctly. If you received this email, your settings are properly configured!']
    });

    // Watch for enabled status changes
    this.smtpForm.get('is_enabled')?.valueChanges.subscribe(value => {
      this.isEmailEnabled = value;
    });
  }

  loadEmailSettings() {
    // TODO: Load from service
    // This would typically call your API service
    console.log('Loading email settings...');
  }

  loadEmailTemplates() {
    // Mock data - replace with actual service call
    this.emailTemplates = [
      {
        id: '1',
        name: 'Welcome Email',
        subject: 'Welcome to Our Platform!',
        body: 'Dear {{name}}, Welcome to our platform! We are excited to have you on board...',
        type: 'welcome',
        is_active: true
      },
      {
        id: '2',
        name: 'Password Reset',
        subject: 'Reset Your Password',
        body: 'Hi {{name}}, You requested to reset your password. Click the link below...',
        type: 'reset_password',
        is_active: true
      }
    ];
  }

  saveSmtpSettings() {
    if (this.smtpForm.valid) {
      this.savingSettings = true;
      const settings: EmailSettingSchema = this.smtpForm.value;
      
      // TODO: Call your API service here
      setTimeout(() => {
        this.savingSettings = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'SMTP settings saved successfully',
          life: 3000
        });
      }, 2000);
    }
  }

  testSmtpConnection() {
    if (!this.smtpForm.valid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill in all required SMTP settings first',
        life: 3000
      });
      return;
    }

    this.testingConnection = true;
    
    // TODO: Call your API service to test connection
    setTimeout(() => {
      this.testingConnection = false;
      const success = Math.random() > 0.3; // Mock success/failure
      
      this.messageService.add({
        severity: success ? 'success' : 'error',
        summary: success ? 'Connection Successful' : 'Connection Failed',
        detail: success 
          ? 'SMTP connection test was successful!' 
          : 'Failed to connect to SMTP server. Please check your settings.',
        life: 4000
      });
    }, 3000);
  }

  sendTestEmail() {
    if (!this.testEmailForm.valid || !this.isEmailEnabled) {
      return;
    }

    this.sendingTest = true;
    const testData = this.testEmailForm.value;
    
    // TODO: Call your API service to send test email
    setTimeout(() => {
      this.sendingTest = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Test Email Sent',
        detail: `Test email sent successfully to ${testData.test_email}`,
        life: 3000
      });
    }, 2000);
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.smtpForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }
}
