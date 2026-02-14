import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LinkService } from './../../services/link-service';
import { Component, computed, inject, signal, Signal, WritableSignal} from '@angular/core';
import { LinkResponse } from '../../models/link/link-response';
import { environment } from '@/environments/environment';

@Component({
  selector: 'app-generate-page',
  imports: [ReactiveFormsModule],
  templateUrl: './generate-page.html',
  styleUrl: './generate-page.css',
})
export class GeneratePage {
  private linkService = inject(LinkService);
  private fb = inject(FormBuilder)
  url = signal(environment.CLIENT_URL+"/r/");


  linkResponse: WritableSignal<LinkResponse> = signal(
    {
      id:0,
      longLink:"",
      shortPath:"",
      clicks:0
    }
  )

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

  async copy(link: string) {
    console.log(link);
    try {
      await navigator.clipboard.writeText(this.url()+link);
    } catch (err){
      console.error('Error al copiar', err);
    }
  }
}
