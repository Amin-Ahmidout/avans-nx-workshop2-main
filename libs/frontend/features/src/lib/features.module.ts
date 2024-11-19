import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDetailsComponent } from './users/user-details/user-details.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { RouterModule } from '@angular/router';
import { ColumnsComponent } from './columns/columns.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [CommonModule, RouterModule,ReactiveFormsModule ],
    declarations: [
        UserDetailsComponent,
        UserListComponent,
        UserEditComponent,
        ColumnsComponent
    ]
})
export class FeaturesModule {}
