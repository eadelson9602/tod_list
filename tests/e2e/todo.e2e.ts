import {
  Builder,
  By,
  until,
  WebDriver,
  WebElement,
  Key,
  Browser,
} from "selenium-webdriver";

/**
 * Verifica si un servidor está corriendo en un puerto específico
 */
async function checkServer(
  port: number,
  timeout: number = 2000
): Promise<boolean> {
  return new Promise((resolve) => {
    const http = require("http");
    const req = http.get(`http://localhost:${port}`, { timeout }, () =>
      resolve(true)
    );
    req.on("error", () => resolve(false));
    req.on("timeout", () => {
      req.destroy();
      resolve(false);
    });
  });
}

/**
 * Helper para esperar elementos usando WebDriverWait (mejor práctica)
 * Reemplaza el uso de sleep() con explicit waits
 */
async function waitForElement(
  driver: WebDriver,
  locator: By,
  timeout: number = 10000
): Promise<WebElement> {
  return driver.wait(until.elementLocated(locator), timeout);
}

/**
 * Helper para esperar que un elemento sea visible y clickeable
 * Según documentación oficial: https://www.selenium.dev/documentation/webdriver/waits/
 */
async function waitForClickable(
  driver: WebDriver,
  locator: By,
  timeout: number = 10000
): Promise<WebElement> {
  const element = await waitForElement(driver, locator, timeout);
  await driver.wait(until.elementIsVisible(element), timeout);
  await driver.wait(until.elementIsEnabled(element), timeout);
  return element;
}

/**
 * Ejecuta una prueba y maneja errores
 */
async function runTest(
  name: string,
  testFn: (driver: WebDriver) => Promise<void>
): Promise<boolean> {
  try {
    await testFn(driver!);
    console.log(`✓ ${name}`);
    return true;
  } catch (error: any) {
    console.error(`✗ ${name}: ${error.message}`);
    return false;
  }
}

// Variables globales
let driver: WebDriver | undefined;
const BASE_URL = "http://localhost:5173";
const API_URL = "http://localhost:3000";

/**
 * Configuración inicial - Verificar servidores y crear driver
 */
async function setup(): Promise<boolean> {
  try {
    // Verificar que los servidores estén corriendo
    console.log("Verificando servidores...");
    const frontendRunning = await checkServer(5173);
    const backendRunning = await checkServer(3000);

    if (!frontendRunning || !backendRunning) {
      console.warn("Servidores no están ejecutándose");
      return false;
    }

    console.log("✓ Servidores verificados correctamente");

    // Crear driver - Patrón simple según documentación oficial
    console.log("Iniciando FirefoxDriver...");
    console.log(
      "  Nota: Selenium Manager puede tardar en descargar FirefoxDriver la primera vez"
    );
    console.log("  Esto puede tomar hasta 2 minutos...");
    const startTime = Date.now();

    // Mostrar progreso cada 10 segundos
    const progressInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      console.log(`  Esperando... (${elapsed}s)`);
    }, 10000);

    try {
      // Agregar timeout para evitar que se cuelgue indefinidamente
      const driverPromise = new Builder().forBrowser(Browser.FIREFOX).build();
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          clearInterval(progressInterval);
          reject(
            new Error(
              "Timeout: FirefoxDriver no pudo iniciarse después de 120 segundos"
            )
          );
        }, 120000); // 2 minutos
      });

      driver = await Promise.race([driverPromise, timeoutPromise]);
      clearInterval(progressInterval);
      const initTime = Date.now() - startTime;
      console.log(`✓ FirefoxDriver iniciado exitosamente en ${initTime}ms`);

      // Configurar timeouts
      await driver.manage().setTimeouts({
        implicit: 10000,
        pageLoad: 30000,
        script: 30000,
      });

      // Navegar a la aplicación
      console.log(`Navegando a ${BASE_URL}...`);
      await driver.get(BASE_URL);
      await waitForElement(driver, By.css("#app"), 15000);

      console.log(
        "✓ Selenium WebDriver (Firefox) inicializado correctamente\n"
      );
      return true;
    } catch (error: any) {
      clearInterval(progressInterval);
      const elapsed = Date.now() - startTime;
      if (error.message && error.message.includes("Timeout")) {
        console.error(`Se tardo demasiado en crear el driver.`);
      } else {
        console.error(`✗ Error al crear FirefoxDriver: ${error.message}`);
      }
      return false;
    }
  } catch (error: any) {
    console.error(`✗ Error en setup: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
    return false;
  }
}

/**
 * Limpieza - Cerrar driver
 */
async function teardown(): Promise<void> {
  if (driver) {
    try {
      await driver.quit();
      console.log("✓ FirefoxDriver cerrado correctamente");
    } catch (error) {
      console.warn("⚠️  Error al cerrar FirefoxDriver:", error);
    }
  }
}

/**
 * Recargar página antes de cada prueba
 */
async function reloadPage(): Promise<void> {
  if (driver) {
    await driver.get(BASE_URL);
    await waitForElement(driver, By.css("#app"), 10000);
  }
}

// ========== PRUEBAS ==========

/**
 * Prueba: Debería mostrar el título de la aplicación
 */
async function testTituloAplicacion(driver: WebDriver): Promise<void> {
  const title = await waitForElement(driver, By.css("h1"));
  const titleText = await title.getText();
  if (!titleText.includes("Todo List")) {
    throw new Error(`Título esperado "Todo List", obtenido: "${titleText}"`);
  }
}

/**
 * Prueba: Debería mostrar el formulario de nueva tarea
 */
async function testFormularioNuevaTarea(driver: WebDriver): Promise<void> {
  const form = await waitForElement(driver, By.css("form"));
  if (!form) {
    throw new Error("Formulario no encontrado");
  }
  const titleInput = await waitForElement(driver, By.css("#title"));
  if (!titleInput) {
    throw new Error("Input de título no encontrado");
  }
}

/**
 * Prueba: Debería crear una nueva tarea desde el formulario
 */
async function testCrearTarea(driver: WebDriver): Promise<void> {
  const titleInput = await waitForClickable(driver, By.css("#title"));
  await titleInput.clear();
  await titleInput.sendKeys("Tarea E2E de prueba");

  const descriptionInput = await waitForClickable(
    driver,
    By.css("#description")
  );
  await descriptionInput.clear();
  await descriptionInput.sendKeys("Descripción de prueba E2E");

  const submitButton = await waitForClickable(
    driver,
    By.css('button[type="submit"]')
  );
  await submitButton.click();

  await waitForElement(driver, By.css(".todo-item"), 5000);

  const todoItems = await driver.findElements(By.css(".todo-item"));
  if (todoItems.length === 0) {
    throw new Error("No se creó la tarea");
  }

  const todoTitle = await waitForElement(driver, By.css(".todo-title"));
  const todoTitleText = await todoTitle.getText();
  if (!todoTitleText.includes("Tarea E2E de prueba")) {
    throw new Error(
      `Título esperado "Tarea E2E de prueba", obtenido: "${todoTitleText}"`
    );
  }
}

/**
 * Prueba: Debería mostrar error si se intenta crear sin título
 */
async function testValidacionTituloRequerido(driver: WebDriver): Promise<void> {
  const submitButton = await waitForClickable(
    driver,
    By.css('button[type="submit"]')
  );
  await submitButton.click();

  const titleInput = await waitForElement(driver, By.css("#title"));
  const isRequired = await titleInput.getAttribute("required");
  if (!isRequired) {
    throw new Error("El campo título debería ser requerido");
  }
}

/**
 * Prueba: Debería mostrar mensaje cuando no hay tareas
 */
async function testMensajeSinTareas(driver: WebDriver): Promise<void> {
  const todoItems = await driver.findElements(By.css(".todo-item"));
  if (todoItems.length === 0) {
    const emptyState = await driver.findElements(By.css(".empty-state"));
    if (emptyState.length === 0) {
      throw new Error("Debería mostrar mensaje cuando no hay tareas");
    }
  }
}

/**
 * Prueba: Debería editar una tarea existente
 */
async function testEditarTarea(driver: WebDriver): Promise<void> {
  // Crear una tarea
  const titleInput = await waitForClickable(driver, By.css("#title"));
  await titleInput.clear();
  await titleInput.sendKeys("Tarea para editar");

  const submitButton = await waitForClickable(
    driver,
    By.css('button[type="submit"]')
  );
  await submitButton.click();

  await waitForElement(driver, By.css(".todo-item"), 5000);

  // Editar
  const editButton = await waitForClickable(
    driver,
    By.xpath("//button[contains(text(), 'Editar')]")
  );
  await editButton.click();

  // Esperar a que el formulario se llene con los datos de la tarea
  await driver.wait(
    async () => {
      try {
        const titleInput = await driver.findElement(By.css("#title"));
        const value = await titleInput.getAttribute("value");
        return value && value.includes("Tarea para editar");
      } catch {
        return false;
      }
    },
    5000,
    "El formulario debería haberse llenado con los datos de la tarea"
  );

  const editTitleInput = await waitForClickable(driver, By.css("#title"));
  const editTitleValue = await editTitleInput.getAttribute("value");
  if (!editTitleValue || !editTitleValue.includes("Tarea para editar")) {
    throw new Error(
      `El formulario no se llenó correctamente. Valor obtenido: "${editTitleValue}"`
    );
  }

  await editTitleInput.clear();
  await editTitleInput.sendKeys("Tarea editada");

  const updateButton = await waitForClickable(
    driver,
    By.xpath("//button[contains(text(), 'Actualizar')]")
  );
  await updateButton.click();

  await waitForElement(driver, By.css(".todo-title"), 5000);

  const updatedTitle = await waitForElement(driver, By.css(".todo-title"));
  const updatedTitleText = await updatedTitle.getText();
  if (!updatedTitleText.includes("Tarea editada")) {
    throw new Error(
      `Título esperado "Tarea editada", obtenido: "${updatedTitleText}"`
    );
  }
}

/**
 * Prueba: Debería marcar una tarea como completada
 */
async function testCompletarTarea(driver: WebDriver): Promise<void> {
  // Crear una tarea
  const titleInput = await waitForClickable(driver, By.css("#title"));
  await titleInput.clear();
  await titleInput.sendKeys("Tarea para completar");

  const submitButton = await waitForClickable(
    driver,
    By.css('button[type="submit"]')
  );
  await submitButton.click();

  await waitForElement(driver, By.css(".todo-item"), 5000);

  const completeButton = await waitForClickable(
    driver,
    By.xpath("//button[contains(text(), 'Completar')]")
  );
  await completeButton.click();

  await waitForElement(driver, By.css(".todo-item.completed"), 5000);

  const completedItems = await driver.findElements(
    By.css(".todo-item.completed")
  );
  if (completedItems.length === 0) {
    throw new Error("La tarea debería estar marcada como completada");
  }
}

/**
 * Prueba: Debería eliminar una tarea
 */
async function testEliminarTarea(driver: WebDriver): Promise<void> {
  // Crear una tarea
  const titleInput = await waitForClickable(driver, By.css("#title"));
  await titleInput.clear();
  await titleInput.sendKeys("Tarea para eliminar");

  const submitButton = await waitForClickable(
    driver,
    By.css('button[type="submit"]')
  );
  await submitButton.click();

  await waitForElement(driver, By.css(".todo-item"), 5000);

  const todoItemsBefore = await driver.findElements(By.css(".todo-item"));
  const countBefore = todoItemsBefore.length;

  // Sobrescribir window.confirm para aceptar automáticamente antes de hacer clic
  await driver.executeScript(`
    window.confirm = function() { return true; };
  `);

  const deleteButton = await waitForClickable(
    driver,
    By.xpath("//button[contains(text(), 'Eliminar')]")
  );
  await deleteButton.click();

  await driver.wait(
    async () => {
      const items = await driver.findElements(By.css(".todo-item"));
      return items.length < countBefore;
    },
    5000,
    "La tarea debería haberse eliminado"
  );

  const todoItemsAfter = await driver.findElements(By.css(".todo-item"));
  const countAfter = todoItemsAfter.length;

  if (countAfter >= countBefore) {
    throw new Error(
      `La tarea no se eliminó. Antes: ${countBefore}, Después: ${countAfter}`
    );
  }
}

/**
 * Prueba: Debería validar campos requeridos
 */
async function testValidarCamposRequeridos(driver: WebDriver): Promise<void> {
  const titleInput = await waitForElement(driver, By.css("#title"));
  const isRequired = await titleInput.getAttribute("required");
  if (!isRequired) {
    throw new Error("El campo título debería ser requerido");
  }
}

// ========== EJECUCIÓN PRINCIPAL ==========

async function main() {
  console.log("=".repeat(60));
  console.log("PRUEBAS E2E CON SELENIUM");
  console.log("=".repeat(60));
  console.log();

  // Setup
  const setupSuccess = await setup();
  if (!setupSuccess) {
    console.error(
      "\n❌ No se pudo inicializar el entorno. Abortando pruebas.\n"
    );
    process.exit(1);
  }

  const results: { name: string; passed: boolean }[] = [];

  try {
    // Interfaz de usuario
    console.log("📋 Interfaz de usuario");
    await reloadPage();
    results.push({
      name: "Debería mostrar el título de la aplicación",
      passed: await runTest(
        "Debería mostrar el título de la aplicación",
        testTituloAplicacion
      ),
    });

    await reloadPage();
    results.push({
      name: "Debería mostrar el formulario de nueva tarea",
      passed: await runTest(
        "Debería mostrar el formulario de nueva tarea",
        testFormularioNuevaTarea
      ),
    });

    // Crear tarea
    console.log("\n📝 Crear tarea");
    await reloadPage();
    results.push({
      name: "Debería crear una nueva tarea desde el formulario",
      passed: await runTest(
        "Debería crear una nueva tarea desde el formulario",
        testCrearTarea
      ),
    });

    await reloadPage();
    results.push({
      name: "Debería mostrar error si se intenta crear sin título",
      passed: await runTest(
        "Debería mostrar error si se intenta crear sin título",
        testValidacionTituloRequerido
      ),
    });

    // Listar tareas
    console.log("\n📋 Listar tareas");
    await reloadPage();
    results.push({
      name: "Debería mostrar mensaje cuando no hay tareas",
      passed: await runTest(
        "Debería mostrar mensaje cuando no hay tareas",
        testMensajeSinTareas
      ),
    });

    // Editar tarea
    console.log("\n✏️  Editar tarea");
    await reloadPage();
    results.push({
      name: "Debería editar una tarea existente",
      passed: await runTest(
        "Debería editar una tarea existente",
        testEditarTarea
      ),
    });

    // Completar tarea
    console.log("\n✅ Completar tarea");
    await reloadPage();
    results.push({
      name: "Debería marcar una tarea como completada",
      passed: await runTest(
        "Debería marcar una tarea como completada",
        testCompletarTarea
      ),
    });

    // Eliminar tarea
    console.log("\n🗑️  Eliminar tarea");
    await reloadPage();
    results.push({
      name: "Debería eliminar una tarea",
      passed: await runTest("Debería eliminar una tarea", testEliminarTarea),
    });

    // Validaciones
    console.log("\n✔️  Validaciones");
    await reloadPage();
    results.push({
      name: "Debería validar campos requeridos",
      passed: await runTest(
        "Debería validar campos requeridos",
        testValidarCamposRequeridos
      ),
    });
  } finally {
    // Teardown
    await teardown();
  }

  // Resumen
  console.log("\n" + "=".repeat(60));
  console.log("RESUMEN DE PRUEBAS");
  console.log("=".repeat(60));
  const passed = results.filter((r) => r.passed).length;
  const total = results.length;
  console.log(`Total: ${total}`);
  console.log(`Pasadas: ${passed}`);
  console.log(`Fallidas: ${total - passed}`);
  console.log();

  results.forEach((result) => {
    const icon = result.passed ? "✓" : "✗";
    console.log(`${icon} ${result.name}`);
  });

  console.log();
  if (passed === total) {
    console.log("✅ Todas las pruebas pasaron correctamente");
    process.exit(0);
  } else {
    console.log(`❌ ${total - passed} prueba(s) fallaron`);
    process.exit(1);
  }
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  main().catch((error) => {
    console.error("Error fatal:", error);
    process.exit(1);
  });
}

export { main };
