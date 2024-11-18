import { Component, OnInit } from '@angular/core';
import { IUserInfo, UserService } from "@avans-nx-workshop/shared/api";

@Component({
  selector: 'avans-nx-workshop-user-list',
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  users: IUserInfo[] = []; 

  constructor(private userService: UserService) {}

  ngOnInit(): void {

    this.userService.getUsers().subscribe((data: IUserInfo[]) => {
      this.users = data;
    });
  }
}
