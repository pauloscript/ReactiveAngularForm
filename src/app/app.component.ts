import { ConsultCepService } from './services/consult-cep.service';
import { DropdownService } from './services/dropdown.service';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StateBr } from './state-br';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  reactive_form: FormGroup;
  states: Observable<StateBr[]>;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private DropdownService: DropdownService,
    private zipcodeService: ConsultCepService) { }

  ngOnInit() {

    this.states = this.DropdownService.getStateBr();

    this.reactive_form = this.formBuilder.group({
      name: [null, [Validators.required, Validators.maxLength(45)]],
      email: [null, [Validators.required, Validators.email]],
      address: this.formBuilder.group({
        zipcode: [null, [Validators.required]],
        district: [null, [Validators.required]],
        street: [null, [Validators.required]],
        number: [null, [Validators.required]],
        complement: [null],
        state: [null]

      })
    });
  }

  onSubmit() {
    console.log(this.reactive_form.value);

    this.http.post('https://httpbin.org/post',
      JSON.stringify(this.reactive_form.value))
      .pipe(map(res => res))
      .subscribe(data => {
        console.log(data);
        this.reactive_form.reset();
      },
        (error: any) => alert('Error: Something happened')
      );
  }

  consultZipcode() {
    const zipcode = this.reactive_form.get('address.zipcode').value;

    if (zipcode != null && zipcode !== '') {
      this.zipcodeService.consultZipcode(zipcode).subscribe(data => {
        this.populateDataForm(data)
      });
    }
  }

  populateDataForm(data) {
    this.reactive_form.patchValue({
      address: {
        district: data.bairro,
        street: data.logradouro,
        complement: data.complemento,
        state: data.uf
      }
    });

    console.log(data)
  }

  resetFormData() {
    this.reactive_form.patchValue({
      address: {
        district: null,
        street: null,
        number: null,
        complement: null,
        state: null
      }
    });
  }

}
