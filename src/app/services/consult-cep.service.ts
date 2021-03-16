import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultCepService {

  constructor(private http: HttpClient) { }

  consultZipcode (zipcode: string) {
    //Remove any character other than a digit.
    zipcode = zipcode.replace(/\D/g, '');

    //Checks if zipcode field has a value.
    if (zipcode != "") 
    {
      //Regular expression for validate zipcode (Brazil zipcode).
      var validzipcode = /^[0-9]{8}$/;

      //Validate format zipcode.
      if(validzipcode.test(zipcode))
      {
        return this.http.get(`//viacep.com.br/ws/${zipcode}/json`);
      }
    }

    return of({});
  }
}
