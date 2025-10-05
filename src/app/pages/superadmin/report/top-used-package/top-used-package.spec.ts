import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopUsedPackage } from './top-used-package';

describe('TopUsedPackage', () => {
  let component: TopUsedPackage;
  let fixture: ComponentFixture<TopUsedPackage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopUsedPackage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopUsedPackage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
