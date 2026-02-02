'use client'

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      title: "Security & Privacy Protocol",
      greeting: "Welcome",
      about: "This Task Manager is built on the high-end Telegram API, tailored for individual sovereignty. Your data is processed locally and hashed; however, we strictly advise against storing highly sensitive keys or credentials here.",
      community: "Our ecosystem is constantly evolving. To track deployment logs and upcoming features, sync with our main node.",
      new_task: "New Task",
      placeholder: "System awaiting data input...",
      delete_confirm: "Delete task?",
      initialize: "Initialize"
    }
  },
  ru: {
    translation: {
      title: "Протокол Безопасности",
      greeting: "Добро пожаловать",
      about: "Этот Таск-Менеджер на базе Telegram API создан для личного пользования. Все данные хешируются и обрабатываются локально, но мы настоятельно рекомендуем не хранить здесь критически важные пароли.",
      community: "Система постоянно обновляется. Чтобы следить за логами разработки и новыми фичами, подключайтесь к нашему сообществу.",
      new_task: "Новая задача",
      placeholder: "Ожидание входных данных...",
      delete_confirm: "Удалить задачу?",
      initialize: "Создать"
    }
  },
  de: {
    translation: {
      title: "Sicherheits- & Datenschutzprotokoll",
      greeting: "Willkommen",
      about: "Dieser Task-Manager basiert auf der Telegram-API и ist für die individuelle Souveränität konzipiert. Ihre Daten werden lokal verarbeitet und gehasht. Wir raten jedoch dringend davon ab, hochsensible Daten hier zu speichern.",
      community: "Unser Ökosystem entwickelt sich ständig weiter. Um Bereitstellungsprotokolle zu verfolgen, treten Sie unserer Community bei.",
      new_task: "Neue Aufgabe",
      placeholder: "Warten на Systemeingabe...",
      delete_confirm: "Aufgabe löschen?",
      initialize: "Initialisieren"
    }
  },
  ua: {
    translation: {
      title: "Протокол Безпеки",
      greeting: "Вітаємо",
      about: "Цей Таск-Менеджер на базі Telegram API створений для особистого використання. Всі дані хешуються, проте ми наполегливо рекомендуємо не зберігати тут критично важливі паролі.",
      community: "Система постійно оновлюється. Щоб стежити за логами розробки та новими фічами, приєднуйтесь до нашої спільноти.",
      new_task: "Нова задача",
      placeholder: "Очікування вхідних даних...",
      delete_confirm: "Видалити задачу?",
      initialize: "Створити"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;