import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LinkService } from './../../services/link-service';
import { Component, computed, inject, signal, Signal, WritableSignal} from '@angular/core';
import { LinkResponse } from '../../models/link/link-response';
import { environment } from '@/environments/environment';
import { GeneratedContent } from '@/app/components/generated-content/generated-content';

@Component({
  selector: 'app-generate-page',
  imports: [ReactiveFormsModule, GeneratedContent],
  templateUrl: './generate-page.html',
  styleUrl: './generate-page.css',
})
export class GeneratePage {
  private linkService = inject(LinkService);
  private fb = inject(FormBuilder)
  url = signal(environment.CLIENT_URL+"/r/");


  linkResponse: WritableSignal<LinkResponse | null> = signal(null)

  form = this.fb.nonNullable.group({
    longUrl: ['', [Validators.required, Validators.pattern('https?://.+')]]
  });




  submit(): void {
    if(this.form.invalid || !this.form.value.longUrl) {
      return;
    }
    const longUrl = this.form.controls.longUrl.value;

    this.linkService.generateLink(longUrl).subscribe({
      next:(res) => {
        this.linkResponse.set(res)
      },
      error: (err) => {
        console.error('Error creando link',err);
      }
    })

  }

}
