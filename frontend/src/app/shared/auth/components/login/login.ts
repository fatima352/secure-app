import { Component, inject, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  readonly fb = inject(FormBuilder);
  readonly authsvc = inject(AuthService);
  readonly router = inject(Router);

  readonly loginForm = this.fb.group({
    login: ['', { nonNullable: true, validators: [Validators.required] }],
    password: ['', { nonNullable: true, validators: [Validators.required] }]
  });

  constructor(){
    effect(()=>{
      if (this.authsvc.isLoggedIn()) {
        this.router.navigate(['/home']);
      }
    })
  }

  submit(): void {
    const { login, password } = this.loginForm.value as { login: string; password: string };
    this.authsvc.login(login, password);
  }

}
