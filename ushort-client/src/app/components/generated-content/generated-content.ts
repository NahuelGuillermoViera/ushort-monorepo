import { Component, inject, Input, signal, WritableSignal } from '@angular/core';
import { LinkResponse } from '@/app/models/link/link-response';
import { LinkService } from '@/app/services/link-service';

@Component({
  selector: 'app-generated-content',
  templateUrl: './generated-content.html',
  styleUrls: ['./generated-content.css'],
})
export class GeneratedContent {

  private _linkResponse: LinkResponse | null = null;

  @Input()
  set linkResponse(value: LinkResponse | null) {
    this._linkResponse = value;
    if (value) {
      this.getQr();
    }
  }

  get linkResponse(): LinkResponse | null {
    return this._linkResponse;
  }

  @Input() url: string = "";

  qrPath: WritableSignal<string> = signal("");
  qrBlob: WritableSignal<Blob | null> = signal(null);

  private linkService = inject(LinkService);

  private getQr(): void {
    if (!this._linkResponse) return;

    this.linkService.getQr(this._linkResponse.shortPath).subscribe({
      next: (res: Blob) => {
        const objectUrl = URL.createObjectURL(res);
        this.qrPath.set(objectUrl);
        this.qrBlob.set(res);
      },
      error: (err) => {
        console.error('Error obteniendo QR', err);
      }
    });
  }

  async copyLink(): Promise<void> {
    if (!this._linkResponse) return;
    try {
      await navigator.clipboard.writeText(`${this.url}${this._linkResponse.shortPath}`);
    } catch (err) {
      console.error('Error al copiar link', err);
    }
  }

  async copyImage(): Promise<void> {
    if (!this.qrBlob()) return;
    try {
      const clipboardItem = new ClipboardItem({
        [this.qrBlob()!.type]: this.qrBlob()!
      });
      await navigator.clipboard.write([clipboardItem]);
    } catch (err) {
      console.error('Error al copiar imagen', err);
    }
  }

  downloadQr(): void {
    if (!this.qrBlob()) return;
    const url = this.qrPath();
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qr-code.png';
    a.click();
    URL.revokeObjectURL(url);
  }
}
