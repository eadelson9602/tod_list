# Guía de Pruebas Automatizadas

Este proyecto incluye pruebas automatizadas para la API y la interfaz de usuario.

## 📋 Tipos de Pruebas

### 1. Pruebas de API (Jest + Supertest)

Las pruebas de API verifican todos los endpoints del backend:

- ✅ Crear todos
- ✅ Obtener todos
- ✅ Obtener un todo por ID
- ✅ Actualizar todos
- ✅ Eliminar todos
- ✅ Validaciones y manejo de errores

**Ubicación:** `tests/api/todo.api.test.ts`

**Ejecutar:**

```bash
npm run test:api
```

### 2. Pruebas End-to-End (Selenium WebDriver)

Las pruebas E2E verifican la funcionalidad completa de la interfaz web:

- ✅ Crear tareas desde el formulario
- ✅ Listar tareas
- ✅ Editar tareas
- ✅ Completar tareas
- ✅ Eliminar tareas
- ✅ Validaciones de formularios

**Ubicación:** `tests/e2e/todo.e2e.test.ts`

**Requisitos:**

- Chrome/Chromium instalado
- Backend y frontend ejecutándose (`npm run dev:all`)

**Ejecutar:**

```bash
npm run test:e2e
```

## 🚀 Ejecutar Todas las Pruebas

```bash
npm test
```

## 📊 Cobertura de Código

Para generar un reporte de cobertura:

```bash
npm run test:coverage
```

El reporte se generará en la carpeta `coverage/`.

## 🔧 Configuración

### Jest

La configuración de Jest se encuentra en `jest.config.js`:

- Usa `ts-jest` para TypeScript
- Busca pruebas en la carpeta `tests/`
- Genera reportes de cobertura

### Selenium

Las pruebas E2E usan Selenium WebDriver con Chrome:

- Configurado para ejecutar en modo visible (puedes descomentar `--headless` para modo sin ventana)
- Timeout de 30 segundos por defecto
- Espera automática de elementos

## 📝 Escribir Nuevas Pruebas

### Prueba de API

```typescript
import request from "supertest";
import { createTestApp } from "../helpers/testApp";

describe("Mi Nueva Prueba", () => {
  it("debería hacer algo", async () => {
    const response = await request(app).get("/api/endpoint").expect(200);

    expect(response.body).toHaveProperty("data");
  });
});
```

### Prueba E2E

```typescript
import { Builder, By } from "selenium-webdriver";

describe("Mi Prueba E2E", () => {
  let driver: WebDriver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build();
  });

  it("debería hacer algo en la UI", async () => {
    await driver.get("http://localhost:5173");
    const element = await driver.findElement(By.css("#mi-elemento"));
    expect(await element.getText()).toBe("Texto esperado");
  });

  afterAll(async () => {
    await driver.quit();
  });
});
```

## 🐛 Solución de Problemas

### Las pruebas de API fallan

1. Verifica que no haya conflictos con la base de datos
2. Asegúrate de que la base de datos de prueba se elimine correctamente

### Las pruebas E2E fallan

1. Verifica que Chrome esté instalado
2. Asegúrate de que el backend y frontend estén ejecutándose
3. Verifica que los puertos 3000 y 5173 estén disponibles
4. Aumenta los timeouts si es necesario

### ChromeDriver no se encuentra

Instala chromedriver globalmente o asegúrate de que esté en el PATH:

```bash
npm install -g chromedriver
```

## 📚 Recursos

- [Jest Documentation](https://jestjs.io/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Selenium WebDriver Documentation](https://www.selenium.dev/documentation/)
