import { HttpClient } from '@angular/common/http';
import { Injectable , computed, inject, signal} from '@angular/core';
import { UserDto } from '../interfaces/user-dto';
import { environment } from '../../environments/environment';
import { catchError, tap, of, finalize } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class User {
  private readonly http = inject(HttpClient)

  private readonly _users = signal<UserDto[] | null>([])
  private readonly _isLoading = signal<boolean>(false)
  private readonly _error = signal<string | null>(null)

  readonly users = this._users.asReadonly()
  readonly isLoading = this._isLoading.asReadonly()
  readonly error = this._error.asReadonly()

  readonly userscount = computed(()=> this._users() != null ? this._users()?.length : 0)

  loadUsers(){
    this._isLoading.set(true)
    this._error.set(null)
    this.http.get<{users : UserDto[]}>(
      `${environment.apiUrl}/users`,
      {withCredentials:true}
    ).pipe(
      tap(res=> {
        if(res?.users){
          this._users.set(res.users)
          console.log(`Utilisateurs bien récupérer`)
        }else{
          this._error.set('rien n\'est récuperer')
          this._users.set(null)
        }
      }),
      catchError((err)=>{
        console.error('Erreur HTTP', err)
        this._error.set('Erreur serveur')
        this._users.set(null)
        return of(null)
      }), 
      finalize(()=> this._isLoading.set(false))
    ).subscribe()
  }

}
