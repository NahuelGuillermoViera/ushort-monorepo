import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratedContent } from './generated-content';

describe('GeneratedContent', () => {
  let component: GeneratedContent;
  let fixture: ComponentFixture<GeneratedContent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneratedContent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneratedContent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
