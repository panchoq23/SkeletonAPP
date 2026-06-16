import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class DBTaskService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private isInitialized: boolean = false;

  constructor() {}

  async setSQLiteObject(db: SQLiteDBConnection) {
    this.db = db;
  }

  async initializePlugin() {
    if (this.isInitialized) return;

    try {
      this.db = await this.sqlite.createConnection('skeleton_db', false, 'no-encryption', 1, false);
      await this.db.open();
      await this.createTables();
      this.isInitialized = true;
    } catch (err) {
      console.error('Error initializing database', err);
    }
  }

  async createTables() {
    const schema = `
      CREATE TABLE IF NOT EXISTS users (
        usuario TEXT PRIMARY KEY,
        password TEXT,
        nombre TEXT,
        apellido TEXT,
        nivelEducacion TEXT,
        fechaNacimiento TEXT
      );

      -- Tabla sesion_data según requerimiento exacto
      CREATE TABLE IF NOT EXISTS sesion_data (
        user_name TEXT PRIMARY KEY NOT NULL,
        password INTEGER NOT NULL,
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

  async isSessionActive(): Promise<any> {
    const res = await this.db.query('SELECT * FROM sesion_data WHERE active = 1 LIMIT 1');
    return res.values && res.values.length > 0 ? res.values[0] : null;
  }

  async validateUser(usuario: string, password: string): Promise<any> {
    const res = await this.db.query('SELECT * FROM users WHERE usuario = ? AND password = ?', [usuario, password]);
    return res.values && res.values.length > 0 ? res.values[0] : null;
  }

  async registerSession(usuario: string, password: any) {
    // Desactivar sesiones previas
    await this.db.run('UPDATE sesion_data SET active = 0');
    // Insertar o reemplazar sesión según el modelo de la Tabla 1
    const sql = 'INSERT OR REPLACE INTO sesion_data (user_name, password, active) VALUES (?, ?, 1)';
    await this.db.run(sql, [usuario, password]);
  }

  async updateSessionStatus(usuario: string, active: boolean) {
    const status = active ? 1 : 0;
    await this.db.run('UPDATE sesion_data SET active = ? WHERE user_name = ?', [status, usuario]);
  }

  async registerUser(user: any) {
    const sql = `INSERT OR REPLACE INTO users (usuario, password, nombre, apellido, nivelEducacion, fechaNacimiento)
                 VALUES (?, ?, ?, ?, ?, ?)`;
    await this.db.run(sql, [user.usuario, user.password, user.nombre || null, user.apellido || null, user.nivelEducacion || null, user.fechaNacimiento || null]);
  }

  async getUser(usuario: string) {
    const res = await this.db.query('SELECT * FROM users WHERE usuario = ?', [usuario]);
    return res.values && res.values.length > 0 ? res.values[0] : null;
  }

  async saveUserDetails(user: any) {
    const sql = `UPDATE users SET nombre = ?, apellido = ?, nivelEducacion = ?, fechaNacimiento = ?
                 WHERE usuario = ?`;
    await this.db.run(sql, [user.nombre, user.apellido, user.nivelEducacion, user.fechaNacimiento, user.usuario]);
  }

  async getExperience(usuario: string) {
    const res = await this.db.query('SELECT * FROM experiencia_laboral WHERE usuario = ?', [usuario]);
    return res.values || [];
  }

  async saveExperience(exp: any) {
    const sql = `INSERT INTO experiencia_laboral (usuario, empresa, anioInicio, trabajaActualmente, anioTermino, cargo)
                 VALUES (?, ?, ?, ?, ?, ?)`;
    await this.db.run(sql, [exp.usuario, exp.empresa, exp.anioInicio, exp.trabajaActualmente ? 1 : 0, exp.anioTermino, exp.cargo]);
  }

  async getCertifications(usuario: string) {
    const res = await this.db.query('SELECT * FROM certificaciones WHERE usuario = ?', [usuario]);
    return res.values || [];
  }

  async saveCertification(cert: any) {
    const sql = `INSERT INTO certificaciones (usuario, nombreCertificado, fechaObtencion, vence, fechaVencimiento)
                 VALUES (?, ?, ?, ?, ?)`;
    await this.db.run(sql, [cert.usuario, cert.nombreCertificado, cert.fechaObtencion, cert.vence ? 1 : 0, cert.fechaVencimiento]);
  }
}
