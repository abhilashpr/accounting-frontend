import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyFile } from './company-file';

describe('CompanyFile', () => {
  let component: CompanyFile;
  let fixture: ComponentFixture<CompanyFile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyFile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyFile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
