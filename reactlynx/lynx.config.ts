import { defineConfig } from "@lynx-js/rspeedy";

import { pluginQRCode } from "@lynx-js/qrcode-rsbuild-plugin";
import { pluginReactLynx } from "@lynx-js/react-rsbuild-plugin";
import { pluginTypeCheck } from "@rsbuild/plugin-type-check";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const require = createRequire(import.meta.url);

const experimental_enableReactCompiler = process.env.REACT_COMPILER === "true";

export default defineConfig({
  // use production mode to get best performance
  mode: "production",
  output: {
    minify: {
      jsOptions: {
        minimizerOptions: {
          // disable mangle to keep the component name
          mangle: false,
        },
      },
    },
  },
  performance: {
    profile: true,
  },
  source: {
    entry: "./src/index.tsx",
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  tools: {
    rspack: {
      resolve: {
        alias: {
          react$: require.resolve("@lynx-js/react/compat"),
          "react-dom$": require.resolve("@lynx-js/react/compat"),
        },
      },
    },
  },
  plugins: [
    pluginQRCode({
      schema(url) {
        // We use `?fullscreen=true` to open the page in LynxExplorer in full screen mode
        return `${url}?fullscreen=true`;
      },
    }),
    pluginReactLynx({
      experimental_enableReactCompiler,
    }),
    pluginTypeCheck(),
  ],
});
