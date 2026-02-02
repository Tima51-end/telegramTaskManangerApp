import { WebApp } from 'telegram-web-app';

declare global {
  interface Window {
    Telegram: {
      WebApp: WebApp;
    };
  }
}