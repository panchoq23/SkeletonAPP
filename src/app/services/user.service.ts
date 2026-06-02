import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface UserData {
  usuario: string;
  nombre?: string;
  apellido?: string;
  nivelEducacion?: string;
  fechaNacimiento?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userDataSubject = new BehaviorSubject<UserData | null>(null);
  public userData$ = this.userDataSubject.asObservable();

  constructor() { }

  setUserData(data: UserData) {
    this.userDataSubject.next(data);
  }

  getUserData(): UserData | null {
    return this.userDataSubject.value;
  }

  clearUserData() {
    this.userDataSubject.next(null);
  }
}
