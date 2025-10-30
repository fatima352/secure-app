import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, of, tap } from 'rxjs'
import { UserDto } from '../../interfaces/user-dto';
import { environment } from '../../../environments/environment';
// import { environment } from '@env/environment'
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient)

  // signaux privé modifiables
  private readonly _currentUser= signal<UserDto | null>(null)
  private readonly _isLoading = signal(false)
  private readonly _error = signal<string | null>(null)

  //singaux publique lecture seule
  readonly currentUser = this._currentUser.asReadonly()
  readonly error = this._error.asReadonly()
  readonly isLoading = this._isLoading.asReadonly()

  //signaux calculer automatiquement quand currentUser change
  readonly isLoggedIn = computed(()=> this._currentUser() != null) //true si user connecter
  readonly isAdmin = computed(()=> this._currentUser()?.role === 'admin')//true si c'est un admin

  // connexion

  login(login: string, passeword : string){
    this._isLoading.set(true)
    this._error.set(null)
    this.http.post<{user : UserDto }>(
      `${environment.apiUrl}/auth/login`,
      {login, passeword},
      {withCredentials : true}
    ).pipe(
      tap(res=> {
        if(res?.user){
          this._currentUser.set(res.user)
          console.log(`👍🏾 Utilisateur connecté : ${JSON.stringify(res.user)}`)
        }else{
          this._error.set('Identifiants invalides')
          this._currentUser.set(null)
        }
      }),
      catchError((err) => {
        console.error('👎 Erreur HTTP', err)
        if (err?.status === 401) {
          this._error.set('Identifiants invalides')
        } else {
          this._error.set('Erreur serveur')
        }
        this._currentUser.set(null)
        return of(null)
      }),
      finalize(() => this._isLoading.set(false))
    ).subscribe()
  }

  logout(){
    this._isLoading.set(true) ; 
    this._error.set(null)
    this.http.post(`
      ${environment.apiUrl}/auth/logout`, 
      {}, 
      {withCredentials :true}
    ).pipe(
      tap(()=> {this._currentUser.set(null) }),
      catchError(err=> {this._error.set('Erreur de deconnecion') ; return of(null)}),
      finalize(()=> this._isLoading.set(false))
    )
    .subscribe()
  }

  whoami(){
    this._isLoading.set(true)
    this._error.set(null)
    this.http.get<{user : UserDto}>(`${environment.apiUrl}/auth/whoami`, {withCredentials:true})
    .pipe(
      tap(res => {this._currentUser.set(res?.user ?? null)}),
      catchError(err =>{
        this._error.set('Session expirée') ; this._currentUser.set(null); return of (null)
      }),
      finalize(()=> this._isLoading.set(false)),
      catchError(()=> of(null))
    )
    .subscribe(res => this._currentUser.set(res?.user ?? null))
  }

  refresh$() { // observable qui émet null en cas d'erreur
    return this.http.post(`${environment.apiUrl}/auth/refresh`,{}, { withCredentials: true } )
    .pipe( catchError(() => of(null)) )
  }

}
