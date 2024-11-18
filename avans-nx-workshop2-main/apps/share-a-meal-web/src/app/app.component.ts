import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { Router, RouterModule } from '@angular/router';

@Component({
    standalone: true,
    imports: [RouterModule],
    selector: 'avans-nx-workshop-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    constructor(private readonly router: Router) {}

    ngOnInit(): void {
        initFlowbite();
    }
}
