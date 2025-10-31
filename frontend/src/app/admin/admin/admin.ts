import { Component, inject, effect} from '@angular/core';
import { User } from '../../users/user';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class AdminComponent {
  protected readonly usersvc = inject(User);
  readonly users = this.usersvc.users;

  constructor() {
    this.usersvc.loadAll();
  }
}
