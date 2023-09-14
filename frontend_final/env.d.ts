/// <reference types="vite/client" />
declare namespace NodeJS {
    interface ProcessEnv {
        VUE_APP_SERVER_URL: string;
      // Add more environment variables here as needed
    }
  }