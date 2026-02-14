import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LinkResponse } from '../models/link/link-response';
import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LinkService {
  private linkURL:string = environment.POST;

  private http = inject(HttpClient);

  getLinkList(): Observable<LinkResponse[]> {
    return this.http.get<LinkResponse[]>(this.linkURL)
  }

  generateLink(link: string): Observable<LinkResponse>{
    return this.http.post<LinkResponse>(`${this.linkURL}`, {url: link});
  }
}
