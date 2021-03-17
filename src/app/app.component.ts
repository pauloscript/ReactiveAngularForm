import { ConsultCepService } from './services/consult-cep.service';
import { DropdownService } from './services/dropdown.service';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  roles: any[];
  techs: any[];
  frameworks = ['Angular', 'React', 'Vue'];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private DropdownService: DropdownService,
    private zipcodeService: ConsultCepService) { }

  ngOnInit() {

    this.states = this.DropdownService.getStateBr();
    this.roles = this.DropdownService.getRole();
    this.techs = this.DropdownService.getTech();

    this.reactive_form = this.formBuilder.group({
      name: [null, [Validators.required, Validators.maxLength(45)]],
      email: [null, [Validators.required, Validators.email]],
      address: this.formBuilder.group({
        zipcode: [null, [Validators.required]],
        district: [null, [Validators.required]],
        street: [null, [Validators.required]],
        number: [null, [Validators.required]],
        complement: [null],
        state: [null],
      }),
      role: [null],
      tech: [null],
      frameworks: this.buildFrameworks(),
    });
  }

  buildFrameworks() {
    const values = this.frameworks.map( v => new FormControl(false));
    return this.formBuilder.array(values);
  }

  onSubmit() {

    let valueSubmit = Object.assign({}, this.reactive_form.value);

    valueSubmit = Object.assign(valueSubmit, {
      frameworks: valueSubmit.frameworks
        .map((v, i) => v ? this.frameworks[i] : null)
        .filter(v => v !== null)
    });

    this.http.post('https://httpbin.org/post',
      JSON.stringify(valueSubmit))
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

  compareRoles(object1, object2) {
    return object1 && object2 ? (object1.name === object2.name) : object1 && object2;
  }

}
