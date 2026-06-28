import { Injectable } from "@angular/core";
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from "@capacitor-community/sqlite";

export interface User {
  usuario: string;
  password?: string;
  nombre?: string;
  apellido?: string;
  nivelEducacion?: string;
  fechaNacimiento?: string | null;
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
}

@Injectable({
  providedIn: "root"
})
export class DBTaskService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private isInitialized: boolean = false;
  private _initPromise: Promise<void> | null = null;

  constructor() {}

  async initializePlugin(): Promise<void> {
    if (this.isInitialized) return;
    if (this._initPromise) return this._initPromise;

    this._initPromise = (async () => {
      try {
        this.db = await this.sqlite.createConnection("skeleton_db", false, "no-encryption", 1, false);
        await this.db.open();
        await this.createTables();
        this.isInitialized = true;
      } catch (err) {
        console.error("Error initializing database", err);
        this._initPromise = null;
        throw err;
      }
    })();

    return this._initPromise;
  }

  async createTables(): Promise<void> {
    const schema = `
      CREATE TABLE IF NOT EXISTS users (
        usuario TEXT PRIMARY KEY,
        password TEXT,
        nombre TEXT,
        apellido TEXT,
        nivelEducacion TEXT,
        fechaNacimiento TEXT
      );

      CREATE TABLE IF NOT EXISTS sesion_data (
        user_name TEXT PRIMARY KEY NOT NULL,
        password TEXT NOT NULL,
        active INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS posts_cache (
        id INTEGER PRIMARY KEY,
        title TEXT,
        body TEXT,
        author TEXT,
        category TEXT,
        votes INTEGER,
        repliesCount INTEGER,
        timestamp TEXT
      );
    `;
    await this.db.execute(schema);
  }

  async isSessionActive(): Promise<any> {
    const res = await this.db.query("SELECT * FROM sesion_data WHERE active = 1 LIMIT 1");
    return res.values && res.values.length > 0 ? res.values[0] : null;
  }

  async validateUser(usuario: string, password: string): Promise<User | null> {
    const res = await this.db.query("SELECT * FROM users WHERE usuario = ? AND password = ?", [usuario, password]);
    return res.values && res.values.length > 0 ? res.values[0] as User : null;
  }

  async userExists(usuario: string): Promise<boolean> {
    const res = await this.db.query("SELECT usuario FROM users WHERE usuario = ?", [usuario]);
    return !!(res.values && res.values.length > 0);
  }

  async registerSession(usuario: string, password: string) {
    await this.db.run("UPDATE sesion_data SET active = 0");
    await this.db.run("INSERT OR REPLACE INTO sesion_data (user_name, password, active) VALUES (?, ?, 1)", [usuario, password]);
  }

  async updateSessionStatus(usuario: string, active: boolean) {
    const status = active ? 1 : 0;
    await this.db.run("UPDATE sesion_data SET active = ? WHERE user_name = ?", [status, usuario]);
  }

  async registerUser(user: User) {
    const sql = "INSERT OR REPLACE INTO users (usuario, password) VALUES (?, ?)";
    await this.db.run(sql, [user.usuario, user.password]);
  }

  async getUser(usuario: string): Promise<User | null> {
    const res = await this.db.query("SELECT * FROM users WHERE usuario = ?", [usuario]);
    return res.values && res.values.length > 0 ? res.values[0] as User : null;
  }

  async saveUserDetails(user: User): Promise<void> {
    const sql = "UPDATE users SET nombre = ?, apellido = ?, nivelEducacion = ?, fechaNacimiento = ? WHERE usuario = ?";
    await this.db.run(sql, [user.nombre, user.apellido, user.nivelEducacion, user.fechaNacimiento, user.usuario]);
  }

  async savePostToCache(post: Post) {
    const sql = "INSERT OR REPLACE INTO posts_cache (id, title, body, author, category, votes, repliesCount, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    await this.db.run(sql, [post.id, post.title, post.body, post.author, post.category, post.votes, post.repliesCount, post.timestamp]);
  }

  async getCachedPosts(): Promise<Post[]> {
    const res = await this.db.query("SELECT * FROM posts_cache ORDER BY id DESC");
    return res.values as Post[] || [];
  }
}
