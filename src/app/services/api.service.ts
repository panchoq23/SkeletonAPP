import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { retry, catchError } from "rxjs/operators";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
  };

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    console.error("API Error:", error);
    return throwError(() => new Error("Error en la comunicación con la API."));
  }

  createPost(post: any): Observable<any> {
    return this.http.post(this.baseUrl + "/posts", post, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  getPosts(): Observable<any> {
    return this.http.get(this.baseUrl + "/posts")
      .pipe(retry(2), catchError(this.handleError));
  }

  updatePost(id: number, post: any): Observable<any> {
    return this.http.put(this.baseUrl + "/posts/" + id, post, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete(this.baseUrl + "/posts/" + id, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
}
