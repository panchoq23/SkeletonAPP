import { Injectable, signal } from "@angular/core";
import { Observable, of } from "rxjs";

export interface Comment {
  id: number;
  author: string;
  body: string;
  timestamp: string;
  isCorrect: boolean;
}

export interface Post {
  id?: number;
  title: string;
  body: string;
  author?: string;
  category?: string;
  votes?: number;
  repliesCount?: number;
  timestamp?: string;
  sede?: string;
  comments?: Comment[];
}

const SEDES = ["San Joaquín", "Maipú", "Antonio Varas", "Plaza Vespucio", "Puente Alto", "Viña del Mar", "Valparaíso", "Concepción"];

const MOCK_POSTS: Post[] = [
  {
    id: 1, title: "¿Cómo funciona RxJS en Angular?",
    body: "Estoy estudiando RxJS y no entiendo la diferencia entre Subject y BehaviorSubject. ¿Alguien puede explicarlo con ejemplos?",
    author: "juan_rz", category: "Programación", votes: 14, repliesCount: 3,
    timestamp: "Hace 2 h", sede: "San Joaquín",
    comments: [
      { id: 1, author: "maria_gl", body: "BehaviorSubject guarda el último valor y lo emite a nuevos suscriptores. Subject no.", timestamp: "Hace 1 h", isCorrect: true },
      { id: 2, author: "carlos_st", body: "Revisa la doc oficial de RxJS, está muy bien explicado con ejemplos.", timestamp: "Hace 45 min", isCorrect: false },
    ]
  },
  {
    id: 2, title: "Ayuda con normalización de bases de datos (3FN vs BCNF)",
    body: "¿Cuándo aplico 3FN y cuándo BCNF? Tengo examen mañana y no logro distinguirlos claramente.",
    author: "ana_mn", category: "Diseño", votes: 8, repliesCount: 2,
    timestamp: "Hace 3 h", sede: "Maipú",
    comments: [
      { id: 3, author: "juan_rz", body: "BCNF es más estricta. En 3FN algunas dependencias transitivas se permiten, BCNF no las tolera.", timestamp: "Hace 2 h", isCorrect: true },
    ]
  },
  {
    id: 3, title: "Dudas sobre direccionamiento IPv6",
    body: "¿Cómo se calcula la máscara de subred en IPv6? Vengo de IPv4 y me confunden los prefijos /64.",
    author: "pedro_st", category: "General", votes: 5, repliesCount: 0,
    timestamp: "Hace 5 h", sede: "Antonio Varas", comments: []
  },
  {
    id: 4, title: "Ejercicios de cálculo integral para el certamen",
    body: "¿Alguien tiene ejercicios resueltos de integrales por partes? El certamen es el viernes.",
    author: "vale_cr", category: "Matemáticas", votes: 12, repliesCount: 1,
    timestamp: "Hace 1 día", sede: "Plaza Vespucio",
    comments: [
      { id: 4, author: "ana_mn", body: "Te comparto el canal de YouTube que usó nuestro profe, tiene todo resuelto paso a paso.", timestamp: "Hace 22 h", isCorrect: false },
    ]
  },
  {
    id: 5, title: "Diferencias entre \"since\" y \"for\" en inglés",
    body: "Siempre me confundo cuándo usar \"since\" y cuándo \"for\" con el Present Perfect. ¿Algún truco?",
    author: "diego_vg", category: "Historia", votes: 7, repliesCount: 2,
    timestamp: "Hace 1 día", sede: "Viña del Mar",
    comments: [
      { id: 5, author: "vale_cr", body: "\"Since\" se usa con un punto específico en el tiempo. \"For\" con una duración.", timestamp: "Hace 1 día", isCorrect: true },
      { id: 6, author: "pedro_st", body: "Truco: si puedes decir \"a partir de\", usas since. Si puedes decir \"durante\", usas for.", timestamp: "Hace 23 h", isCorrect: false },
    ]
  },
  {
    id: 6, title: "Error en SQLite al hacer INSERT OR REPLACE",
    body: "Me aparece \"no such table\" al intentar insertar en la tabla usuarios. Ya inicialicé el plugin pero sigue fallando.",
    author: "carlos_st", category: "Programación", votes: 9, repliesCount: 1,
    timestamp: "Hace 2 días", sede: "Puente Alto",
    comments: [
      { id: 7, author: "juan_rz", body: "Asegúrate de llamar initializePlugin() en el app.component.ts y no en el servicio directamente.", timestamp: "Hace 2 días", isCorrect: true },
    ]
  },
];

@Injectable({ providedIn: "root" })
export class PostService {
  private _posts = signal<Post[]>(
    MOCK_POSTS
  );

  getPosts(): Observable<Post[]> {
    return of(this._posts());
  }

  getPostById(id: number): Observable<Post | undefined> {
    return of(this._posts().find(p => p.id === id));
  }

  createPost(post: Post): Observable<Post> {
    const nuevo: Post = {
      ...post,
      id: Date.now(),
      votes: 0,
      repliesCount: 0,
      timestamp: "Recién ahora",
      comments: [],
    };
    this._posts.update(prev => [nuevo, ...prev]);
    return of(nuevo);
  }

  addComment(postId: number, comment: Omit<Comment, "id">): void {
    this._posts.update(posts =>
      posts.map(p => {
        if (p.id !== postId) return p;
        const newComment: Comment = { ...comment, id: Date.now() };
        return {
          ...p,
          comments: [...(p.comments ?? []), newComment],
          repliesCount: (p.repliesCount ?? 0) + 1,
        };
      })
    );
  }

  markCommentCorrect(postId: number, commentId: number): void {
    this._posts.update(posts =>
      posts.map(p => {
        if (p.id !== postId) return p;
        return {
          ...p,
          comments: (p.comments ?? []).map(c => ({
            ...c,
            isCorrect: c.id === commentId,
          })),
        };
      })
    );
  }
}
