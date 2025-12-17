// Setup file para pruebas de frontend
// Declarar módulos .vue para TypeScript
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
