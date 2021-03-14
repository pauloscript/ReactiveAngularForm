import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  reactive_form: FormGroup;

  constructor (private formBuilder: FormBuilder, private http: HttpClient) { }

  ngOnInit () {
    
    this.reactive_form = this.formBuilder.group({

      name: [null, [Validators.required, Validators.maxLength(45)]],
      email: [null, [Validators.required, Validators.email]],
      address: this.formBuilder.group({
        zipcode:[null, [Validators.required]],
        district:[null, [Validators.required]],
        street:[null, [Validators.required]],
        number:[null, [Validators.required]],
        complement:[null]
      })

    });
  }

  onSubmit () {
    console.log(this.reactive_form.value);

    this.http.post('https://httpbin.org/post', 
                    JSON.stringify(this.reactive_form.value))
   .pipe(map(res => res))
   .subscribe(data => 
    {
     console.log(data);
     this.reactive_form.reset(); 
    },
    (error: any) => alert('Error: Something happened')
    );
  }

  consultZipcode () {
    let zipcode = this.reactive_form.get('address.zipcode').value;

    console.log(zipcode)

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
        this.resetFormData();

        this.http.get(`//viacep.com.br/ws/${zipcode}/json`)
          .pipe(map(data => data))
          .subscribe(data => this.populateDataForm(data));
      }
    }
  }

  populateDataForm (data) {
    console.log(data);
    this.reactive_form.patchValue({
      address: {
        district: data.bairro,
        street: data.logradouro,
        complement: data.complemento
      }
    });
  }

  resetFormData () {
    this.reactive_form.patchValue({
      address: {
        district: null,
        street: null,
        number: null,
        complement: null
      }
    });
  }

}
