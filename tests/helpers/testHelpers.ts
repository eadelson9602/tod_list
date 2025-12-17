import { WebDriver, By, until } from "selenium-webdriver";

export class TestHelpers {
  constructor(private driver: WebDriver) {}

  /**
   * Espera a que un elemento sea visible
   */
  async waitForElement(
    selector: string,
    timeout: number = 5000
  ): Promise<void> {
    await this.driver.wait(until.elementLocated(By.css(selector)), timeout);
  }

  /**
   * Espera a que el texto aparezca en la página
   */
  async waitForText(text: string, timeout: number = 5000): Promise<void> {
    await this.driver.wait(
      until.elementLocated(By.xpath(`//*[contains(text(), '${text}')]`)),
      timeout
    );
  }

  /**
   * Limpia y escribe texto en un input
   */
  async clearAndType(selector: string, text: string): Promise<void> {
    const element = await this.driver.findElement(By.css(selector));
    await element.clear();
    await element.sendKeys(text);
  }

  /**
   * Hace clic en un botón por su texto
   */
  async clickButtonByText(text: string): Promise<void> {
    const button = await this.driver.findElement(
      By.xpath(`//button[contains(text(), '${text}')]`)
    );
    await button.click();
  }

  /**
   * Obtiene el texto de un elemento
   */
  async getText(selector: string): Promise<string> {
    const element = await this.driver.findElement(By.css(selector));
    return await element.getText();
  }

  /**
   * Verifica si un elemento existe
   */
  async elementExists(selector: string): Promise<boolean> {
    try {
      await this.driver.findElement(By.css(selector));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Espera un tiempo específico
   */
  async sleep(ms: number): Promise<void> {
    await this.driver.sleep(ms);
  }

  /**
   * Crea una tarea desde la interfaz
   */
  async createTodo(title: string, description?: string): Promise<void> {
    await this.clearAndType("#title", title);

    if (description) {
      await this.clearAndType("#description", description);
    }

    await this.clickButtonByText("Crear");
    await this.sleep(2000); // Esperar a que se guarde
  }
}
