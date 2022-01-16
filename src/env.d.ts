declare module "*.vue" {
  import { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface ImportMeta {
  env: {
    VITE_BASE_URL: string;
    VITE_PUZZLE_IMG_NAME: string;
    VITE_BG_IMG_NAME: string;
  };
}
