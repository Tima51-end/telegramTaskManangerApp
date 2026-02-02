'use client'

import { useEffect, useState } from 'react';

export default function Home() {
  useEffect(() => {
    // Сообщаем Телеграму, что приложение готово
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand(); // Разворачивает на весь экран
    }
  }, []);

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold">Мой Таск-Менеджер</h1>
      <p>Если ты видишь это внутри Telegram, значит всё работает!</p>
    </main>
  );
}