import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';

@Component({ templateUrl: 'list.component.html' })


export class ListComponent implements OnInit {
    users?: any[];
    lista:string[]=[];
    

    constructor(private accountService: AccountService) {}

    ngOnInit() {

        console.log("get all");

        this.accountService.getAll()
            .pipe(first())
            .subscribe(users => this.users = users);

            
           
    }
    mySelectHandler($id: Event){

    }

    deleteUser(id: string) {
        const user = this.users!.find(x => x.id === id);
        user.isDeleting = true;
        this.accountService.delete(id)
            .pipe(first())
            .subscribe(() => this.users = this.users!.filter(x => x.id !== id));
    }

    cargarSelectDeptos(){
        this.accountService.getAllDeptos();
        console.log(this.accountService.getAllDeptos());

    }

}