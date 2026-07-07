import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of, from } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { DBTaskService, Post } from "./dbtask.service";

export interface Comment {
  id: number;
  author: string;
  body: string;
  timestamp: string;
  isCorrect: boolean;
}

export { Post };

@Injectable({
  providedIn: "root"
})
export class PostService {
  private http = inject(HttpClient);
  private dbTask = inject(DBTaskService);
  private apiUrl = "https://jsonplaceholder.typicode.com/posts";

  private categories = ["Programación", "Diseño", "Matemáticas", "Historia", "Física"];
  private authors = ["Juan Pérez", "María González", "Carlos Soto", "Ana Silva", "Diego Torres"];
  private sedes = ["San Joaquín", "Maipú", "Antonio Varas", "Plaza Vespucio", "Puente Alto", "Viña del Mar", "Valparaíso", "Concepción"];

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl).pipe(
      map(posts => posts.slice(0, 15).map(post => this.enrichPost(post))),
      tap(posts => this.cachePosts(posts)),
      catchError(() => {
        console.warn("API falló, cargando desde cache local...");
        return from(this.dbTask.getCachedPosts());
      })
    );
  }

  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`).pipe(
      map(post => this.enrichPost(post)),
      catchError(() => {
        return from(this.dbTask.getCachedPosts()).pipe(
          map(posts => posts.find(p => p.id === id) || { title: "No encontrado", body: "" })
        );
      })
    );
  }

  private enrichPost(post: Post): Post {
    // Usamos el ID del post para que la aleatoriedad sea determinista (estable)
    const seed = post.id || 0;
    return {
      ...post,
      author: post.author || this.authors[seed % this.authors.length],
      category: post.category || this.categories[seed % this.categories.length],
      votes: post.votes !== undefined ? post.votes : (seed * 7) % 100,
      repliesCount: post.repliesCount !== undefined ? post.repliesCount : (seed * 3) % 20,
      timestamp: post.timestamp || ("Hace " + ((seed % 12) + 1) + " h"),
      sede: post.sede || this.sedes[seed % this.sedes.length]
    };
  }

  private async cachePosts(posts: Post[]) {
    for (const post of posts) {
      await this.dbTask.savePostToCache(post);
    }
  }

  createPost(post: Post): Observable<Post> {
    const enriched = this.enrichPost(post);
    return this.http.post<Post>(this.apiUrl, enriched).pipe(
      tap(async (newPost) => await this.dbTask.savePostToCache(newPost)),
      catchError(() => {
        console.warn("Offline: Guardando post solo localmente");
        return of(enriched);
      })
    );
  }
}
