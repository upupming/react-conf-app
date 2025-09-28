/// <reference types="@lynx-js/rspeedy/client" />

declare module "@lynx-js/types" {
  interface GlobalProps {
    /**
     * Define your global properties in this interface.
     * These types will be accessible through `lynx.__globalProps`.
     */
    theme: "light" | "dark";
  }
}
// This export makes the file a module
export {};
