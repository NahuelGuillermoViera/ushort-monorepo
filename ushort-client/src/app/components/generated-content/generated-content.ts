import { LinkResponse } from '@/app/models/link/link-response';
import { Component, Input, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-generated-content',
  imports: [],
  templateUrl: './generated-content.html',
  styleUrl: './generated-content.css',
})
export class GeneratedContent {

  @Input() linkResponse: LinkResponse | null = null;
  @Input() url: string = "";

  async copy(link: string) {
    console.log(link);
    try {
      await navigator.clipboard.writeText(this.url+link);
    } catch (err){
      console.error('Error al copiar', err);
    }
  }

}
