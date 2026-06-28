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

export interface Experiencia {
  usuario: string;
  empresa: string;
  anioInicio: number;
  trabajaActualmente: boolean;
  anioTermino?: number | null;
  cargo: string;
}

export interface Certificacion {
  usuario: string;
  nombreCertificado: string;
  fechaObtencion: string;
  vence: boolean;
  fechaVencimiento?: string | null;
}

export interface SesionData {
  user_name: string;
  password: string;
  active: number;
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

      CREATE TABLE IF NOT EXISTS experiencia_laboral (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario TEXT,
        empresa TEXT,
        anioInicio INTEGER,
        trabajaActualmente INTEGER,
        anioTermino INTEGER,
        cargo TEXT,
        FOREIGN KEY(usuario) REFERENCES users(usuario)
      );

      CREATE TABLE IF NOT EXISTS certificaciones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario TEXT,
        nombreCertificado TEXT,
        fechaObtencion TEXT,
        vence INTEGER,
        fechaVencimiento TEXT,
        FOREIGN KEY(usuario) REFERENCES users(usuario)
      );
    `;
    await this.db.execute(schema);
  }

  async isSessionActive(): Promise<SesionData | null> {
    const res = await this.db.query("SELECT * FROM sesion_data WHERE active = 1 LIMIT 1");
    return res.values && res.values.length > 0 ? res.values[0] as SesionData : null;
  }

  async validateUser(usuario: string, password: string): Promise<User | null> {
    const res = await this.db.query(
      "SELECT * FROM users WHERE usuario = ? AND password = ?",
      [usuario, password]
    );
    return res.values && res.values.length > 0 ? res.values[0] as User : null;
  }

  async userExists(usuario: string): Promise<boolean> {
    const res = await this.db.query("SELECT usuario FROM users WHERE usuario = ?", [usuario]);
    return !!(res.values && res.values.length > 0);
  }

  async registerSession(usuario: string, password: string): Promise<void> {
    await this.db.run("UPDATE sesion_data SET active = 0");
    const sql = "INSERT OR REPLACE INTO sesion_data (user_name, password, active) VALUES (?, ?, 1)";
    await this.db.run(sql, [usuario, password]);
  }

  async updateSessionStatus(usuario: string, active: boolean) {
    const status = active ? 1 : 0;
    await this.db.run("UPDATE sesion_data SET active = ? WHERE user_name = ?", [status, usuario]);
  }

  async registerUser(user: User) {
    const sql = "INSERT OR REPLACE INTO users (usuario, password, nombre, apellido, nivelEducacion, fechaNacimiento) VALUES (?, ?, ?, ?, ?, ?)";
    await this.db.run(sql, [
      user.usuario,
      user.password,
      user.nombre ?? null,
      user.apellido ?? null,
      user.nivelEducacion ?? null,
      user.fechaNacimiento ?? null
    ]);
  }

  async getUser(usuario: string): Promise<User | null> {
    const res = await this.db.query("SELECT * FROM users WHERE usuario = ?", [usuario]);
    return res.values && res.values.length > 0 ? res.values[0] as User : null;
  }

  async saveUserDetails(user: User): Promise<void> {
    const sql = "UPDATE users SET nombre = ?, apellido = ?, nivelEducacion = ?, fechaNacimiento = ? WHERE usuario = ?";
    await this.db.run(sql, [user.nombre, user.apellido, user.nivelEducacion, user.fechaNacimiento, user.usuario]);
  }

  async getExperience(usuario: string): Promise<Experiencia[]> {
    const res = await this.db.query("SELECT * FROM experiencia_laboral WHERE usuario = ?", [usuario]);
    return (res.values ?? []) as Experiencia[];
  }

  async saveExperience(exp: Experiencia): Promise<void> {
    const sql = "INSERT INTO experiencia_laboral (usuario, empresa, anioInicio, trabajaActualmente, anioTermino, cargo) VALUES (?, ?, ?, ?, ?, ?)";
    await this.db.run(sql, [
      exp.usuario,
      exp.empresa,
      exp.anioInicio,
      exp.trabajaActualmente ? 1 : 0,
      exp.anioTermino ?? null,
      exp.cargo
    ]);
  }

  async getCertifications(usuario: string): Promise<Certificacion[]> {
    const res = await this.db.query("SELECT * FROM certificaciones WHERE usuario = ?", [usuario]);
    return (res.values ?? []) as Certificacion[];
  }

  async saveCertification(cert: Certificacion): Promise<void> {
    const sql = "INSERT INTO certificaciones (usuario, nombreCertificado, fechaObtencion, vence, fechaVencimiento) VALUES (?, ?, ?, ?, ?)";
    await this.db.run(sql, [
      cert.usuario,
      cert.nombreCertificado,
      cert.fechaObtencion,
      cert.vence ? 1 : 0,
      cert.fechaVencimiento ?? null
    ]);
  }
}
