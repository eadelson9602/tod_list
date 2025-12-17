# Todo List - Aplicación Full Stack

Aplicación de gestión de tareas (Todo List) construida con:

- **Backend**: Node.js + Express + TypeScript + SQLite
- **Frontend**: Vue 3 + Vite + TypeScript

## 🚀 Características

- ✅ CRUD completo de tareas
- 📝 Crear, leer, actualizar y eliminar todos
- 🎨 Interfaz moderna y responsive
- 💾 Base de datos SQLite local
- 🔄 Actualización en tiempo real

## 📋 Requisitos Previos

- Node.js (v16 o superior)
- npm

## 🛠️ Instalación

1. Clonar o descargar el proyecto
2. Instalar dependencias:

```bash
npm install
```

## 🏃 Ejecución

### Desarrollo

Para ejecutar tanto el backend como el frontend en modo desarrollo:

```bash
npm run dev:all
```

Esto iniciará:

- **Backend**: `http://localhost:3000`
- **Frontend**: `http://localhost:5173`

### Ejecutar por separado

**Solo Backend:**

```bash
npm run dev
```

**Solo Frontend:**

```bash
npm run dev:client
```

### Producción

1. Compilar el proyecto:

```bash
npm run build
```

2. Ejecutar el servidor:

```bash
npm start
```

El servidor estará disponible en `http://localhost:3000` y servirá tanto la API como el frontend.

## 📡 Endpoints de la API

- `GET /api/todos` - Obtener todos los todos
- `GET /api/todos/:id` - Obtener un todo por ID
- `POST /api/todos` - Crear un nuevo todo
- `PUT /api/todos/:id` - Actualizar un todo
- `DELETE /api/todos/:id` - Eliminar un todo

## 📁 Estructura del Proyecto

```
tod_list/
├── src/
│   ├── public/              # Frontend Vue
│   │   ├── components/      # Componentes Vue
│   │   ├── services/        # Servicios API
│   │   ├── App.vue         # Componente principal
│   │   ├── main.ts         # Punto de entrada
│   │   └── index.html      # HTML principal
│   ├── controllers/        # Controladores del backend
│   ├── database/           # Configuración de base de datos
│   ├── routes/             # Rutas de la API
│   ├── services/           # Servicios del backend
│   ├── types/              # Tipos TypeScript compartidos
│   └── index.ts            # Servidor Express
├── tests/                  # Pruebas automatizadas
│   ├── api/                # Pruebas de API
│   ├── e2e/                # Pruebas end-to-end
│   ├── helpers/            # Utilidades para pruebas
│   └── setup/              # Configuración de pruebas
├── dist/                   # Archivos compilados
├── coverage/               # Reportes de cobertura
├── package.json
├── tsconfig.json
├── jest.config.js          # Configuración de Jest
└── vite.config.ts
```

## 🎯 Uso

1. Abre `http://localhost:5173` en tu navegador
2. Usa el formulario para crear nuevas tareas
3. Haz clic en "Editar" para modificar una tarea
4. Haz clic en "Completar" para marcar una tarea como completada
5. Haz clic en "Eliminar" para eliminar una tarea

## 🗄️ Base de Datos

La base de datos SQLite se crea automáticamente en `src/database.sqlite` cuando inicias el servidor por primera vez.

La tabla `todos` tiene la siguiente estructura:

- `id` (INTEGER PRIMARY KEY)
- `title` (TEXT NOT NULL)
- `description` (TEXT)
- `completed` (INTEGER DEFAULT 0)
- `createdAt` (DATETIME)
- `updatedAt` (DATETIME)

## 🧪 Pruebas Automatizadas

El proyecto incluye pruebas automatizadas usando Jest, Supertest y Selenium WebDriver.

### Pruebas de API

Las pruebas de API verifican todos los endpoints del backend:

```bash
npm run test:api
```

### Pruebas End-to-End (E2E)

Las pruebas E2E con Selenium verifican la funcionalidad completa de la interfaz:

**Importante:** Antes de ejecutar las pruebas E2E, asegúrate de tener:

1. Chrome/Chromium instalado
2. El backend y frontend ejecutándose:
   ```bash
   npm run dev:all
   ```

Luego ejecuta las pruebas E2E:

```bash
npm run test:e2e
```

### Ejecutar todas las pruebas

```bash
npm test
```

### Modo watch (desarrollo)

```bash
npm run test:watch
```

### Cobertura de código

```bash
npm run test:coverage
```

## 📝 Scripts Disponibles

- `npm run dev` - Ejecutar backend en modo desarrollo
- `npm run dev:client` - Ejecutar frontend en modo desarrollo
- `npm run dev:all` - Ejecutar ambos en paralelo
- `npm run build` - Compilar todo el proyecto
- `npm run build:server` - Compilar solo el backend
- `npm run build:client` - Compilar solo el frontend
- `npm start` - Ejecutar en producción
- `npm test` - Ejecutar todas las pruebas
- `npm run test:api` - Ejecutar solo pruebas de API
- `npm run test:e2e` - Ejecutar solo pruebas E2E
- `npm run test:watch` - Ejecutar pruebas en modo watch
- `npm run test:coverage` - Generar reporte de cobertura

## 🐛 Solución de Problemas

Si encuentras problemas:

1. Asegúrate de que el puerto 3000 y 5173 no estén en uso
2. Elimina `node_modules` y ejecuta `npm install` nuevamente
3. Verifica que todas las dependencias estén instaladas correctamente

## 📄 Licencia

ISC
