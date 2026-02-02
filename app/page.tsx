"use client";

import "./i18n";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import {
  Globe,
  LayoutGrid,
  CheckCircle2,
  Plus,
  Trash2,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { WebAppUser } from "telegram-web-app";

interface ITask {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
}

export default function Home() {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState<WebAppUser | null>(null);
  const [tasks, setTasks] = useState<ITask[]>([]);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      const telegramUser = tg.initDataUnsafe?.user;
      if (telegramUser) {
        queueMicrotask(() => {
          setUser((prev) =>
            JSON.stringify(prev) !== JSON.stringify(telegramUser)
              ? (telegramUser as WebAppUser)
              : prev,
          );
        });
      }
    }
  }, []);

  const toggleLang = () => {
    const langs = ["en", "ru", "de", "ua"];
    const currentIndex = langs.indexOf(i18n.language);
    const nextLang = langs[(currentIndex + 1) % langs.length];
    i18n.changeLanguage(nextLang);
  };

  const addTask = () => {
    const text = prompt(t("new_task"));
    if (text?.trim()) {
      const now = new Date();
      const newTask: ITask = {
        id: Date.now(),
        text: text.trim(),
        completed: false,
        createdAt: `${now.getDate().toString().padStart(2, "0")}.${(now.getMonth() + 1).toString().padStart(2, "0")} (${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")})`,
      };
      setTasks((prev) => [...prev, newTask]);
      window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred("success");
    }
  };

  const deleteTask = (id: number) => {
    const tg = window.Telegram?.WebApp;
    const message = t("delete_confirm");
    const canUseNativeConfirm =
      tg?.isVersionAtLeast && tg.isVersionAtLeast("6.2");

    if (canUseNativeConfirm && tg?.showConfirm) {
      tg.showConfirm(message, (isConfirmed: boolean) => {
        if (isConfirmed) {
          setTasks((prev) => prev.filter((task) => task.id !== id));
          tg.HapticFeedback?.notificationOccurred("warning");
        }
      });
    } else {
      if (window.confirm(message)) {
        setTasks((prev) => prev.filter((task) => task.id !== id));
        tg?.HapticFeedback?.notificationOccurred("warning");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-200 selection:bg-blue-500/30 font-sans">
      <nav className="sticky top-0 z-50 bg-[#080c14]/90 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-6 py-4">
          <a
            href="#todo-section"
            className="group flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
          >
            <span className="text-base font-black tracking-tighter uppercase italic group-hover:text-blue-400">
              Task <span className="text-blue-500">/</span> Manager
            </span>
            <LayoutGrid className="w-5 h-5 text-blue-500 group-hover:rotate-90 transition-transform" />
          </a>

          <button
            onClick={toggleLang}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/50 border border-slate-700 rounded-full text-blue-400 font-bold uppercase text-[10px] cursor-pointer hover:bg-slate-800 transition-all shadow-lg"
          >
            <Globe className="w-3.5 h-3.5" />
            {i18n.language}
          </button>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto p-6 space-y-10">
        <section className="flex items-center gap-5 p-6 rounded-3xl bg-slate-900/50 border border-slate-800 shadow-2xl">
          <div className="w-16 h-16 rounded-full border-2 border-blue-500/50 p-1">
            <img
              src={
                user?.photo_url ||
                `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.id || "guest"}`
              }
              className="w-full h-full rounded-full object-cover"
              alt="avatar"
            />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight leading-none">
              {t("greeting")}, {user?.first_name || "Agent"}!
            </h2>
            <p className="text-sm text-blue-500/70 font-mono mt-1">
              @{user?.username || "identity_hidden"}
            </p>
          </div>
        </section>

        <section className="relative p-8 rounded-3xl bg-blue-500/5 border border-blue-500/10 overflow-hidden shadow-inner">
          <ShieldCheck className="absolute -right-6 -bottom-6 w-32 h-32 text-blue-500/5 rotate-12" />
          <h3 className="text-sm font-black text-blue-500 uppercase tracking-[0.2em] mb-4">
            {t("title")}
          </h3>
          <p className="text-base text-slate-300 leading-relaxed font-medium italic">
            {t("about")}
          </p>
        </section>

        <div id="todo-section" className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-2xl font-black uppercase italic tracking-widest text-white">
              Central <span className="text-blue-500">Node</span>
            </h2>
            <button
              onClick={addTask}
              className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-xl transition-all active:scale-90 cursor-pointer shadow-[0_0_20px_rgba(37,99,235,0.3)]"
            >
              <Plus className="w-5 h-5 text-white" />
              <span className="font-bold uppercase text-xs tracking-tighter">
                {t("initialize")}
              </span>
            </button>
          </div>

          <div className="space-y-4">
            {tasks.length === 0 ? (
              <div className="text-center py-20 rounded-3xl border-2 border-dashed border-slate-800/50 bg-slate-900/20">
                <p className="text-slate-500 italic text-lg font-light tracking-wide">
                  {t("placeholder")}
                </p>
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={`group flex items-center justify-between p-5 rounded-2xl border transition-all duration-500 ${task.completed ? "bg-blue-500/5 border-blue-500/20 opacity-50 translate-x-1" : "bg-[#0f172a] border-slate-800 hover:border-blue-500/40 shadow-xl"}`}
                >
                  <div className="flex items-center gap-4 overflow-hidden">
                    <button
                      onClick={() =>
                        setTasks((prev) =>
                          prev.map((t) =>
                            t.id === task.id
                              ? { ...t, completed: !t.completed }
                              : t,
                          ),
                        )
                      }
                      className={`shrink-0 cursor-pointer transition-all ${task.completed ? "text-blue-500 scale-110" : "text-slate-700 hover:text-blue-400"}`}
                    >
                      <CheckCircle2 className="w-7 h-7" />
                    </button>
                    <div className="truncate">
                      <p
                        className={`text-lg font-bold tracking-tight transition-all ${task.completed ? "line-through text-slate-500" : "text-slate-100"}`}
                      >
                        {task.text}
                      </p>
                      <p className="text-xs text-slate-600 font-mono mt-1 uppercase italic">
                        Timestamp: {task.createdAt}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-3 text-slate-700 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <section className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 border-dashed flex flex-col items-center text-center gap-6 shadow-2xl">
          <div className="p-4 bg-blue-600/10 rounded-2xl border border-blue-500/20">
            <Users className="w-8 h-8 text-blue-500" />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-bold text-white uppercase tracking-[0.1em]">
              Network Access
            </p>
            <p className="text-sm text-slate-500 max-w-[320px] leading-relaxed italic">
              {t("community")}
            </p>
          </div>
          <a
            href="https://t.me/taskManagerTG"
            className="w-full py-4 bg-slate-800 hover:bg-blue-600 text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl transition-all cursor-pointer shadow-lg text-center active:scale-95"
          >
            Join t.me/taskManagerTG
          </a>
        </section>
      </main>

      <footer className="p-12 mt-20 border-t border-slate-900 flex flex-col items-center gap-4 opacity-40">
        <a
          href="#todo-section"
          className="text-lg font-black tracking-[0.3em] uppercase italic cursor-pointer hover:text-blue-500 transition-colors"
        >
          Task <span className="text-blue-500">/</span> Manager
        </a>
        <p className="text-[10px] uppercase tracking-[0.5em] font-light italic">
          Leverkusen Dev Unit • 2026
        </p>
      </footer>
    </div>
  );
}
