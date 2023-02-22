import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form!: FormGroup;
    id?: string;
    title!: string;
    loading = false;
    submitting = false;
    submitted = false;
    lista:string[]=[];
    filteredCiudades = [];
    selectedDepto = '';
    selectedCiudad = '';
    countries: any[]=[];
    listaCiudades:string[]=[];

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];

        this.accountService.getAllDeptos()
            .pipe(first())
            .subscribe(response=>{    
                this.countries = response.data;
                console.log(response.data[1]["f100_desc"]);
                //this.lista.push(response.data[1]["f100_desc"]);
                for(let key in response.data) {
                    let child = response.data[key]["f100_desc"];
                    let childKey = response.data[key]["f100_id"];
            
                    }

              })
  
            console.log(this.lista);

        // form with validation rules
        this.form = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            username: ['', Validators.required],
            // password only required in add mode
            password: ['', [Validators.minLength(6), ...(!this.id ? [Validators.required] : [])]]
        });

        this.title = 'Add User';
        if (this.id) {
            // edit mode
            this.title = 'Edit User';
            this.loading = true;
            this.accountService.getById(this.id)
                .pipe(first())
                .subscribe(x => {
                    this.form.patchValue(x);
                    this.loading = false;
                });
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

  
    mySelectHandler(selectedDepto:BigInteger){

        this.listaCiudades=[];
        this.accountService.getCiudad(selectedDepto)
            .pipe(first())
            .subscribe(response=>{    
                //console.log(response.data[1]["f100_desc"]);
                //this.lista.push(response.data[1]["f100_desc"]);
                for(let key in response.data) {
                    let child = response.data[key]["f200_desc"];
                    this.listaCiudades.push(child);
                    }

              })
        
            console.log(this.selectedDepto);
            console.log(this.listaCiudades);

    }
    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.submitting = true;
        this.saveUser()
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('User saved', { keepAfterRouteChange: true });
                    this.router.navigateByUrl('/users');
                },
                error: error => {
                    this.alertService.error(error);
                    this.submitting = false;
                }
            })
    }

    private saveUser() {
        // create or update user based on id param
        return this.id
            ? this.accountService.update(this.id!, this.form.value)
            : this.accountService.register(this.form.value);
    }
}