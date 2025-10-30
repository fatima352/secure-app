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
  private readonly usersvc = inject(User);
  readonly users = this.usersvc.users;
  // Charge la liste à l’arrivée sur la page
  constructor() {
  effect(() => this.usersvc.loadAll())
  }
}
