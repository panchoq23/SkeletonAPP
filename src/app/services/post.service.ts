import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of, from } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { DBTaskService } from "./dbtask.service";

export interface Post {
  userId?: number;
  id?: number;
  title: string;
  body: string;
}

@Injectable({
  providedIn: "root"
})
export class PostService {
  private http = inject(HttpClient);
  private dbTask = inject(DBTaskService);
  private apiUrl = "https://jsonplaceholder.typicode.com/posts";

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl).pipe(
      tap(posts => this.cachePosts(posts.slice(0, 10))), // Guardamos los primeros 10 en cache
      catchError(() => {
        console.warn("API falló, cargando desde cache local...");
        // Fallback: Retornamos posts desde SQLite si no hay internet
        // Nota: Implementaremos el getCachedPosts en DBTaskService
        return from(this.dbTask.getCachedPosts());
      })
    );
  }

  private async cachePosts(posts: Post[]) {
    // Lógica para guardar en SQLite
    for (const post of posts) {
      await this.dbTask.savePostToCache(post);
    }
  }

  createPost(post: Post): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, post).pipe(
      tap(async (newPost) => await this.dbTask.savePostToCache(newPost)),
      catchError(() => {
        console.warn("Offline: Guardando post solo localmente");
        return of(post);
      })
    );
  }
}
