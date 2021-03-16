import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StateBr } from '../state-br';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {

  constructor( private http: HttpClient ) { }

  getStateBr(): Observable<StateBr[]> {
    return this.http.get<StateBr[]>('assets/statesbr.json');
  }
  
}
