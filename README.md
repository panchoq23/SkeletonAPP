# SkeletonAPP - Navegación, Persistencia y Plugins Nativos

Este proyecto es una aplicación móvil desarrollada con **Ionic Angular** que implementa un sistema robusto de gestión de usuarios, persistencia de datos relacional y par clave-valor, consumo de APIs REST y funcionalidades nativas avanzadas.

## 🚀 Mejoras e Implementaciones de Hoy

### 1. Arquitectura y Seguridad
- **Route Guards**: Se implementaron `AuthGuard` y `NoAuthGuard` para proteger las rutas. Ahora solo los usuarios con sesión activa en SQLite pueden acceder al Home.
- **Lazy Loading**: Todas las páginas (`Home`, `Login`, `API`, `Mapa`, `Cámara`) cargan de forma perezosa para optimizar el rendimiento.
- **Tipado Estricto**: Se crearon interfaces (`User`, `Experiencia`, `Certificacion`) en el servicio de base de datos para garantizar la integridad de la información.

### 2. Persistencia Avanzada
- **SQLite (DBTaskService)**: Implementación de una base de datos relacional nativa.
  - Tabla `users`: Almacena perfiles de usuario y contraseñas.
  - Tabla `sesion_data`: Gestiona el estado de sesión activa (`user_name`, `password`, `active`).
  - Lógica de protección contra inicializaciones concurrentes (Promesas).
- **Ionic Storage**: Utilizado para persistencia de sesión rápida (recordar usuario en el Login).

### 3. Funcionalidades Nativas (Capacitor)
- **Geolocalización y Google Maps**: 
  - Visualización de ubicación en tiempo real con marcador dinámico que se actualiza automáticamente.
  - **Optimización de Performance**: El rastreo GPS se detiene automáticamente al salir de la página del mapa para ahorrar batería.
- **Cámara**: Captura de fotos y previsualización inmediata con diseño responsivo.
- **API REST**: CRUD completo (Crear, Leer, Editar por ID y Eliminar) conectado a un servidor local mediante `HttpClient`.

### 4. Configuración de Entornos
- Archivos `environment.ts` y `environment.prod.ts` configurados para gestionar automáticamente las URLs de la API según el entorno (Emulador vs Web).

---

## 🛠️ Requisitos de Instalación

Para ejecutar este proyecto localmente, debes instalar las dependencias necesarias:

```bash
# 1. Instalar dependencias del proyecto
npm install @capacitor-community/sqlite jeep-sqlite @capacitor/geolocation @capacitor/google-maps @capacitor/camera @ionic/storage-angular

# 2. Instalar servidor de API (json-server) de forma global
npm install -g json-server

# 3. Sincronizar con el proyecto de Android
npx cap sync android
```

---

## 📺 Cómo Probar la Aplicación

### 1. Activar la API REST
En una terminal aparte, ejecuta el servidor falso:
```bash
json-server --watch db.json --host 0.0.0.0 --port 3000
```

### 2. Ejecutar en el Navegador
```bash
ionic serve
```
*Nota: Para que SQLite funcione en web, se utiliza `jeep-sqlite`. Asegúrate de aceptar los permisos en el navegador.*

### 3. Ejecutar en Emulador Android
```bash
npx cap run android
```

---

## 📦 Entrega Final
El proyecto consolidado con todas las mejoras se encuentra en: 
📂 **`SkeletonAPP_Entrega_Definitiva.zip`** (Excluye `node_modules` y `e2e`).

**Desarrollado con ❤️ para el encargo de SkeletonAPP.**
