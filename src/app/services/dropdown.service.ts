import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StateBr } from '../state-br';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {

  constructor(private http: HttpClient) { }

  getStateBr(): Observable<StateBr[]> {
    return this.http.get<StateBr[]>('assets/statesbr.json');
  }

  getRole() {
    return [
      {
        name: 'Dev',
        level: 'intern',
        description: 'Fullstack developer'
      },
      {
        name: 'Tester',
        level: 'Senior',
        description: 'Security and integration tester'
      },
      {
        name: 'Management',
        level: 'Executive',
        description: 'CEO'
      }
    ];
  }

  getTech() {
    return[
      {
        name: 'C#',
        description: 'Enterprise programming language'
      },
      {
        name: 'Java',
        description: 'Enterprise programming language'
      },
      {
        name: 'Javascript',
        description: 'Script language'
      },
      {
        name: 'PHP',
        description: 'Script languagae'
      }
    ]
  }
}
