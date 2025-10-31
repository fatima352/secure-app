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

  private readonly _users = signal<UserDto[]>([])
  private readonly _isLoading = signal<boolean>(false)
  private readonly _error = signal<string | null>(null)

  readonly users = this._users.asReadonly()
  readonly isLoading = this._isLoading.asReadonly()
  readonly error = this._error.asReadonly()

  readonly userscount = computed(()=> this._users().length)

  loadAll(){
    this._isLoading.set(true)
    this._error.set(null)
    this.http.get<UserDto[]>(
      `${environment.apiUrl}/users`,
      {withCredentials:true}
    ).pipe(
      tap(users => {
        this._users.set(users)
        if(users){
          this._users.set(users)
          console.log(`Utilisateurs bien récupérer`)
        }else{
          this._error.set('rien n\'est récuperer')
          this._users.set([])
        }
      }),
      catchError((err)=>{
        console.error('Erreur HTTP', err)
        this._error.set('Erreur serveur')
        this._users.set([])
        return of(null)
      }), 
      finalize(()=> this._isLoading.set(false))
    ).subscribe()
  }

  addUser(name: string, login : string, password :string){
    this._isLoading.set(true)
    this._error.set(null)
    this.http.post<{user: UserDto}>(
      `${environment.apiUrl}/users`,
      {name, login, password},
      {withCredentials : true}
    ).pipe(
      tap(res=> {
        if(res?.user){
          this._users.set([...this._users(), res.user])
          console.log('utlisateur bien ajouter à la liste')
        }else{
          this._error.set('Problème lors de l\'ajout de l\'utilisateur')
        }
      }),
      catchError((err)=>{
        console.error('Erreur HTTP', err)
        this._error.set('Erreur serveur')
        return of(null)
      }),
      finalize(()=> this._isLoading.set(false))
    ).subscribe()
  }

  deleteUser(id: number){
    this._isLoading.set(true)
    this._error.set(null)
    this.http.delete<{user: UserDto}>(
      `${environment.apiUrl}/users`,
      { body: { id }, withCredentials: true }
    ).pipe(
      tap(res => {
        if(res?.user){
          this._users.set(this._users().filter(u => (u as any).id !== res.user.id))
          console.log('Utilisateur supprimé')
        } else {
          this._error.set('Problème lors de la suppression de l\'utilisateur')
        }
      }),
      catchError((err)=>{
        console.error('Erreur HTTP', err)
        this._error.set('Erreur serveur')
        return of(null)
      }),
      finalize(()=> this._isLoading.set(false))
    ).subscribe()
  }

}
