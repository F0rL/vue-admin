interface ViteEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_BASE_URL: string
  readonly VITE_API_BASE_URL: string
}

interface ImportMetaEnv extends ViteEnv {}
