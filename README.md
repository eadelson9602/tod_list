# Todo List - Aplicación Full Stack

Aplicación de gestión de tareas (Todo List) construida con tecnologías modernas y pruebas automatizadas completas.

## 📋 Descripción

Esta aplicación permite gestionar tareas de manera eficiente con una interfaz web moderna y una API RESTful robusta. Incluye un sistema completo de pruebas automatizadas que cubre API, frontend y pruebas end-to-end.

## 🛠️ Stack Tecnológico

### Backend

- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **TypeScript** - Lenguaje de programación
- **SQLite3** - Base de datos local

### Frontend

- **Vue 3** - Framework JavaScript progresivo
- **Vite** - Herramienta de construcción
- **TypeScript** - Lenguaje de programación

### Pruebas

- **Jest** - Framework de pruebas (API y Frontend)
- **Supertest** - Pruebas HTTP para API
- **Vue Test Utils** - Utilidades para pruebas de Vue
- **Selenium WebDriver** - Pruebas end-to-end con Firefox

## 🚀 Características

- ✅ CRUD completo de tareas
- 📝 Crear, leer, actualizar y eliminar todos
- 🎨 Interfaz moderna y responsive
- 💾 Base de datos SQLite local
- 🔄 Actualización en tiempo real
- 🧪 Suite completa de pruebas automatizadas
- 📊 Reportes de cobertura de código

## 📋 Requisitos Previos

- **Node.js** (v16 o superior)
- **npm** (viene con Node.js)
- **Firefox** (para pruebas E2E)

## 🛠️ Instalación

### 1. Clonar o descargar el proyecto

```bash
git clone https://github.com/eadelson9602/tod_list
cd tod_list
```

### 2. Instalar dependencias

```bash
npm install
```

Este comando instalará todas las dependencias necesarias, incluyendo:

- Dependencias de producción (Express, Vue, SQLite3)
- Dependencias de desarrollo (Jest, Selenium, TypeScript, etc.)

### 3. Verificar instalación

```bash
npm run build
```

Si la compilación es exitosa, la instalación está completa.

## 🏃 Ejecución

### Modo Desarrollo

Para ejecutar tanto el backend como el frontend en modo desarrollo:

```bash
npm run dev:all
```

Esto iniciará:

- **Backend**: `http://localhost:3000`
- **Frontend**: `http://localhost:5173`

**Nota:** En modo desarrollo, los cambios se reflejan automáticamente gracias a `ts-node-dev` y `vite`.

### Ejecutar por Separado

**Solo Backend:**

```bash
npm run dev
```

El backend estará disponible en `http://localhost:3000`

**Solo Frontend:**

```bash
npm run dev:client
```

El frontend estará disponible en `http://localhost:5173`

### Modo Producción

1. **Compilar el proyecto:**

```bash
npm run build
```

Esto compilará:

- Backend TypeScript a JavaScript en `dist/`
- Frontend Vue con Vite en `dist/public/`

2. **Ejecutar el servidor:**

```bash
npm start
```

El servidor estará disponible en `http://localhost:3000` y servirá tanto la API como el frontend compilado.

## 📡 API REST

### Endpoints Disponibles

| Método   | Endpoint         | Descripción                    |
| -------- | ---------------- | ------------------------------ |
| `GET`    | `/api/todos`     | Obtener todas las tareas       |
| `GET`    | `/api/todos/:id` | Obtener una tarea por ID       |
| `POST`   | `/api/todos`     | Crear una nueva tarea          |
| `PUT`    | `/api/todos/:id` | Actualizar una tarea existente |
| `DELETE` | `/api/todos/:id` | Eliminar una tarea             |

### Ejemplo de Uso con cURL

**Crear una tarea:**

```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Mi tarea","description":"Descripción","completed":false}'
```

**Obtener todas las tareas:**

```bash
curl http://localhost:3000/api/todos
```

**Actualizar una tarea:**

```bash
curl -X PUT http://localhost:3000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Tarea actualizada","completed":true}'
```

**Eliminar una tarea:**

```bash
curl -X DELETE http://localhost:3000/api/todos/1
```

## 🎯 Uso de la Aplicación

1. **Iniciar la aplicación:**

   ```bash
   npm run dev:all
   ```

2. **Abrir en el navegador:**

   - Navega a `http://localhost:5173`

3. **Crear una tarea:**

   - Completa el formulario con título (requerido) y descripción (opcional)
   - Haz clic en "Crear"

4. **Editar una tarea:**

   - Haz clic en el botón "✏️ Editar" de la tarea
   - Modifica los campos en el formulario
   - Haz clic en "Actualizar"

5. **Completar una tarea:**

   - Haz clic en el botón "✅ Completar"
   - La tarea se marcará como completada visualmente

6. **Eliminar una tarea:**
   - Haz clic en el botón "🗑️ Eliminar"
   - Confirma la eliminación en el diálogo

## 🗄️ Base de Datos

### Configuración

La base de datos SQLite se crea automáticamente en `src/database.sqlite` cuando inicias el servidor por primera vez.

### Estructura de la Tabla `todos`

| Campo         | Tipo                | Descripción                                              |
| ------------- | ------------------- | -------------------------------------------------------- |
| `id`          | INTEGER PRIMARY KEY | Identificador único (auto-incremental)                   |
| `title`       | TEXT NOT NULL       | Título de la tarea (requerido)                           |
| `description` | TEXT                | Descripción de la tarea (opcional)                       |
| `completed`   | INTEGER DEFAULT 0   | Estado de completado (0 = no completado, 1 = completado) |
| `createdAt`   | DATETIME            | Fecha de creación                                        |
| `updatedAt`   | DATETIME            | Fecha de última actualización                            |

### Backup y Restauración

**Backup:**

```bash
cp src/database.sqlite src/database.sqlite.backup
```

**Restaurar:**

```bash
cp src/database.sqlite.backup src/database.sqlite
```

## 🧪 Pruebas Automatizadas

El proyecto incluye un sistema completo de pruebas automatizadas separado en tres categorías:

### 1. Pruebas de API (Jest + Supertest)

Verifican todos los endpoints del backend y su funcionalidad:

- ✅ Crear tareas
- ✅ Obtener todas las tareas
- ✅ Obtener una tarea por ID
- ✅ Actualizar tareas
- ✅ Eliminar tareas
- ✅ Validaciones y manejo de errores

**Ubicación:** `tests/api/todo.api.test.ts`

**Ejecutar:**

```bash
npm run test:api
```

### 2. Pruebas de Frontend (Jest + Vue Test Utils)

Verifican los componentes Vue y su funcionalidad:

- ✅ Renderizado de componentes
- ✅ Interacciones del usuario
- ✅ Manejo de eventos
- ✅ Validaciones de formularios

**Ubicación:** `tests/frontend/`

**Ejecutar:**

```bash
npm run test:frontend
```

### 3. Pruebas End-to-End (Selenium WebDriver + Firefox)

Verifican la funcionalidad completa de la interfaz web desde el navegador:

- ✅ Crear tareas desde el formulario
- ✅ Listar tareas
- ✅ Editar tareas
- ✅ Completar tareas
- ✅ Eliminar tareas
- ✅ Validaciones de formularios
- ✅ Interfaz de usuario

**Ubicación:** `tests/e2e/todo.e2e.ts`

**Requisitos:**

- Firefox instalado
- Backend y frontend ejecutándose:
  ```bash
  npm run dev:all
  ```

**Ejecutar:**

```bash
npm run test:e2e
# o directamente:
npm run test:selenium
```

**Nota:** Las pruebas E2E son independientes de Jest y se ejecutan con `ts-node`. Selenium Manager descargará automáticamente el FirefoxDriver la primera vez (puede tardar hasta 2 minutos).

### Ejecutar Todas las Pruebas

**Todas las pruebas de Jest (API + Frontend):**

```bash
npm test
```

**Todas las pruebas incluyendo E2E:**

```bash
npm test && npm run test:e2e
```

### Modo Watch (Desarrollo)

Para ejecutar pruebas en modo watch (se re-ejecutan al cambiar archivos):

```bash
npm run test:watch
```

### Cobertura de Código

Para generar un reporte de cobertura:

```bash
npm run test:coverage
```

El reporte se generará en la carpeta `coverage/` con:

- Reporte en texto en la consola
- Reporte HTML en `coverage/index.html`
- Reporte LCOV en `coverage/lcov.info`

## 📁 Estructura del Proyecto

```
tod_list/
├── src/
│   ├── public/              # Frontend Vue
│   │   ├── components/      # Componentes Vue (TodoForm, TodoItem)
│   │   │   ├── TodoForm.vue
│   │   │   └── TodoItem.vue
│   │   ├── services/        # Servicios API
│   │   │   └── api.ts       # Cliente API
│   │   ├── App.vue          # Componente principal
│   │   ├── main.ts          # Punto de entrada del frontend
│   │   ├── index.html       # HTML principal
│   │   └── style.css        # Estilos globales
│   ├── controllers/        # Controladores del backend
│   │   └── todoController.ts
│   ├── database/            # Configuración de base de datos
│   │   └── database.ts      # Inicialización de SQLite
│   ├── routes/              # Rutas de la API
│   │   └── todoRoutes.ts
│   ├── services/            # Servicios del backend
│   │   └── todoService.ts
│   ├── types/               # Tipos TypeScript compartidos
│   │   └── todo.ts          # Interfaces y tipos
│   ├── index.ts             # Servidor Express (punto de entrada)
│   └── database.sqlite      # Base de datos SQLite (generada automáticamente)
├── tests/                   # Pruebas automatizadas
│   ├── api/                 # Pruebas de API (Jest)
│   │   └── todo.api.test.ts
│   ├── frontend/            # Pruebas de frontend (Jest)
│   │   ├── App.test.ts
│   │   ├── components/      # Pruebas de componentes
│   │   │   ├── TodoForm.test.ts
│   │   │   └── TodoItem.test.ts
│   │   ├── services/        # Pruebas de servicios
│   │   │   └── api.test.ts
│   │   ├── setup.ts         # Configuración de pruebas
│   │   └── tsconfig.json    # Configuración TypeScript para pruebas
│   └── e2e/                 # Pruebas E2E (Selenium - independiente de Jest)
│       ├── todo.e2e.ts      # Pruebas E2E con Firefox
│       └── todo.e2e.test.ts # Pruebas E2E con Jest (legacy)
├── dist/                    # Archivos compilados (generados)
├── coverage/                # Reportes de cobertura (generados)
├── node_modules/            # Dependencias (generadas)
├── package.json             # Configuración del proyecto y scripts
├── package-lock.json        # Lock de dependencias
├── tsconfig.json            # Configuración TypeScript
├── jest.config.js            # Configuración de Jest
├── vite.config.ts           # Configuración de Vite
└── README.md                # Este archivo
```

## 📝 Scripts Disponibles

### Desarrollo

| Script               | Descripción                                     |
| -------------------- | ----------------------------------------------- |
| `npm run dev`        | Ejecutar solo el backend en modo desarrollo     |
| `npm run dev:client` | Ejecutar solo el frontend en modo desarrollo    |
| `npm run dev:all`    | Ejecutar ambos (backend + frontend) en paralelo |

### Compilación

| Script                 | Descripción                                    |
| ---------------------- | ---------------------------------------------- |
| `npm run build`        | Compilar todo el proyecto (backend + frontend) |
| `npm run build:server` | Compilar solo el backend                       |
| `npm run build:client` | Compilar solo el frontend                      |

### Producción

| Script      | Descripción                          |
| ----------- | ------------------------------------ |
| `npm start` | Ejecutar servidor en modo producción |

### Pruebas

| Script                  | Descripción                                         |
| ----------------------- | --------------------------------------------------- |
| `npm test`              | Ejecutar todas las pruebas de Jest (API + Frontend) |
| `npm run test:api`      | Ejecutar solo pruebas de API                        |
| `npm run test:frontend` | Ejecutar solo pruebas de frontend                   |
| `npm run test:e2e`      | Ejecutar pruebas E2E con Selenium (Firefox)         |
| `npm run test:selenium` | Alias de `test:e2e`                                 |
| `npm run test:watch`    | Ejecutar pruebas en modo watch                      |
| `npm run test:coverage` | Generar reporte de cobertura                        |

## 🔧 Configuración

### TypeScript

La configuración de TypeScript se encuentra en `tsconfig.json`:

- Target: ES2020
- Module: CommonJS
- Strict mode habilitado
- Source maps habilitados

### Jest

La configuración de Jest se encuentra en `jest.config.js`:

- Usa `ts-jest` para compilar TypeScript
- Proyectos separados para backend y frontend
- Configuración específica para Vue con `@vue/vue3-jest`
- Genera reportes de cobertura

### Vite

La configuración de Vite se encuentra en `vite.config.ts`:

- Plugin Vue habilitado
- Hot Module Replacement (HMR) en desarrollo
- Optimizaciones de producción

### Selenium

Las pruebas E2E usan Selenium WebDriver con Firefox:

- **Navegador:** Firefox (configurado en `tests/e2e/todo.e2e.ts`)
- **Driver:** FirefoxDriver (descargado automáticamente por Selenium Manager)
- **Timeouts:**
  - Implicit: 10 segundos
  - Page Load: 30 segundos
  - Script: 30 segundos
- **Esperas explícitas:** Se usan `explicit waits` en lugar de `sleep()` para mejor rendimiento

## 📝 Escribir Nuevas Pruebas

### Prueba de API

```typescript
import request from "supertest";
import { app } from "../../src/index";

describe("Mi Nueva Prueba de API", () => {
  it("debería hacer algo", async () => {
    const response = await request(app).get("/api/endpoint").expect(200);

    expect(response.body).toHaveProperty("data");
  });
});
```

### Prueba de Frontend

```typescript
import { describe, it, expect } from "@jest/globals";
import { mount } from "@vue/test-utils";
import MiComponente from "@/components/MiComponente.vue";

describe("MiComponente.vue", () => {
  it("debería renderizar correctamente", () => {
    const wrapper = mount(MiComponente, {
      props: { prop1: "valor" },
    });
    expect(wrapper.find(".clase").exists()).toBe(true);
  });
});
```

### Prueba E2E

```typescript
import { Builder, By, Browser } from "selenium-webdriver";

async function miPruebaE2E() {
  const driver = await new Builder().forBrowser(Browser.FIREFOX).build();

  try {
    await driver.get("http://localhost:5173");
    const element = await driver.findElement(By.css("#mi-elemento"));
    const text = await element.getText();
    if (text !== "Texto esperado") {
      throw new Error(`Texto esperado "Texto esperado", obtenido: "${text}"`);
    }
  } finally {
    await driver.quit();
  }
}
```

## 🐛 Solución de Problemas

### Problemas de Instalación

**Error: `npm install` falla**

- Verifica que tengas Node.js v16 o superior
- Limpia la caché: `npm cache clean --force`
- Elimina `node_modules` y `package-lock.json`, luego ejecuta `npm install` nuevamente

**Error: Dependencias no encontradas**

- Ejecuta `npm install` nuevamente
- Verifica tu conexión a internet
- Si persiste, elimina `node_modules` y reinstala

### Problemas de Ejecución

**Puertos en uso (3000 o 5173)**

```bash
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :5173

# Luego termina el proceso con:
taskkill /PID <PID> /F
```

**Backend no inicia**

- Verifica que no haya errores de sintaxis en `src/index.ts`
- Asegúrate de que SQLite esté instalado correctamente
- Revisa los logs en la consola

**Frontend no carga**

- Verifica que Vite esté instalado: `npm list vite`
- Limpia la caché de Vite: elimina `node_modules/.vite`
- Reinstala dependencias si es necesario

### Problemas con Pruebas

**Las pruebas de API fallan**

- Verifica que la base de datos de prueba se elimine correctamente
- Asegúrate de que no haya conflictos con datos existentes
- Revisa que los endpoints estén correctamente configurados

**Las pruebas de frontend fallan**

- Verifica que `@vue/test-utils` esté instalado
- Asegúrate de que `jest.config.js` tenga la configuración correcta para Vue
- Revisa que los componentes Vue estén correctamente importados

**Las pruebas E2E fallan**

- **Firefox no está instalado:**
  - Instala Firefox desde [mozilla.org/firefox](https://www.mozilla.org/firefox)
- **Backend/Frontend no están ejecutándose:**

  ```bash
  # En una terminal separada:
  npm run dev:all
  ```

- **FirefoxDriver timeout:**

  - La primera vez, Selenium Manager descarga FirefoxDriver (puede tardar hasta 2 minutos)
  - Verifica tu conexión a internet
  - Ejecuta nuevamente después de que termine la descarga
  - Selenium Manager cachea el driver, las siguientes ejecuciones serán más rápidas

- **Diálogos de confirmación:**

  - Las pruebas E2E sobrescriben `window.confirm` automáticamente
  - Si tienes problemas, verifica que el código de sobrescritura esté presente

- **Elementos no encontrados:**
  - Aumenta los timeouts en las funciones `waitForElement` y `waitForClickable`
  - Verifica que los selectores CSS sean correctos
  - Asegúrate de que la aplicación esté completamente cargada

**Error: "Cannot find module" en pruebas**

- Ejecuta `npm install` para asegurar que todas las dependencias estén instaladas
- Verifica que `tsconfig.json` y `jest.config.js` estén correctamente configurados

## 💡 Recomendaciones

### Desarrollo

1. **Usa modo watch para desarrollo:**

   ```bash
   npm run dev:all
   ```

   Los cambios se reflejarán automáticamente.

2. **Ejecuta pruebas frecuentemente:**

   ```bash
   npm run test:watch
   ```

   Esto te ayudará a detectar errores temprano.

3. **Mantén la base de datos limpia:**
   - Considera eliminar `src/database.sqlite` periódicamente durante desarrollo
   - Usa backups antes de hacer cambios importantes

### Pruebas

1. **Ejecuta pruebas antes de hacer commit:**

   ```bash
   npm test && npm run test:e2e
   ```

2. **Revisa la cobertura de código regularmente:**

   ```bash
   npm run test:coverage
   ```

   Apunta a mantener al menos 80% de cobertura.

3. **Para pruebas E2E:**
   - Ejecuta `npm run dev:all` en una terminal separada antes de las pruebas E2E
   - La primera ejecución puede tardar más (descarga de FirefoxDriver)
   - Las siguientes ejecuciones serán más rápidas

### Producción

1. **Compila antes de desplegar:**

   ```bash
   npm run build
   ```

2. **Verifica que la compilación sea exitosa:**

   - Revisa que no haya errores en `dist/`
   - Prueba la aplicación compilada localmente antes de desplegar

3. **Considera usar variables de entorno:**
   - Para puertos configurables
   - Para configuración de base de datos
   - Para URLs de API en producción

### Seguridad

1. **No commitees `src/database.sqlite`** si contiene datos sensibles
2. **Usa `.env` para configuración sensible** (agrega `.env` a `.gitignore`)
3. **Valida todas las entradas** en el backend antes de procesarlas

## 📚 Recursos y Documentación

### Tecnologías Utilizadas

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Guide](https://vitejs.dev/guide/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Pruebas

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Selenium WebDriver Documentation](https://www.selenium.dev/documentation/)

### SQLite

- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [SQLite Browser](https://sqlitebrowser.org/) - Herramienta GUI para visualizar la base de datos

## 👥 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

ISC

## 👤 Autor

**Elver Rodriguez**

---

## 📊 Estado del Proyecto

- ✅ Backend funcional
- ✅ Frontend funcional
- ✅ Pruebas de API implementadas
- ✅ Pruebas de Frontend implementadas
- ✅ Pruebas E2E implementadas con Firefox
- ✅ Documentación completa

---

**Última actualización:** Diciembre 2024
