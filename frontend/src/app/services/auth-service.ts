import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { UserOdt } from '../interfaces/user-odt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient)
  private readonly _currentuser= signal<UserOdt | null>(null)
  private currentuser = this._currentuser.asReadonly
  isConnected = computed(() => this.currentuser() !== null)
  
}
