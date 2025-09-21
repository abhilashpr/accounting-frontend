import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-coming-soon',
  imports: [CommonModule, ButtonModule, RippleModule, RouterModule],
  templateUrl: './coming-soon.html',
  styleUrl: './coming-soon.scss'
})
export class ComingSoon {
  @Input() title: string = 'Coming Soon';
  @Input() description: string = 'We\'re working hard to bring you something amazing. Stay tuned!';
  @Input() iconClass: string = 'pi pi-cog';
  @Input() features: string[] = [];
  @Input() progress: number = 75;
  @Input() expectedDate: string = '';
  @Input() showNotifyButton: boolean = true;
  @Input() showBackButton: boolean = true;

  onNotifyClick(): void {
    // Implement notification logic
    console.log('User wants to be notified');
    // You can integrate with your notification service here
  }

  onBackClick(): void {
    // Implement back navigation
    window.history.back();
  }

}
