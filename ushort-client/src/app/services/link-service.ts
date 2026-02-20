import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LinkResponse } from '../models/link/link-response';
import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LinkService {
  private postURL:string = environment.POST;
  private getURL:string = environment.GET;

  private http = inject(HttpClient);

  getLinkList(): Observable<LinkResponse[]> {
    return this.http.get<LinkResponse[]>(this.getURL)
  }

  generateLink(link: string): Observable<LinkResponse>{
    return this.http.post<LinkResponse>(`${this.postURL}`, {url: link});
  }

  getQr(code: string) {
    return this.http.get(
      `${this.getURL}/qr/${code}`,
      { responseType: 'blob' }
    )
  }
}
