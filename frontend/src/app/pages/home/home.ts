import { Component, inject } from '@angular/core';
import { AuthService } from '../../shared/auth/auth-service';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  readonly authsvc = inject(AuthService)
  
}
