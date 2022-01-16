import { createApp } from "vue";
import App from "./App.vue";

import * as baseComponents from "@/components/base";

const app = createApp(App);

for (const [componentName, component] of Object.entries(baseComponents)) {
  app.component(componentName, component);
}

app.mount("#app");
