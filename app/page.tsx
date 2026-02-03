"use client";

import "./i18n";
import { useTranslation } from "react-i18next";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  Globe,
  LayoutGrid,
  CheckCircle2,
  Plus,
  Trash2,
  ShieldCheck,
} from "lucide-react";
import type { WebAppUser } from "telegram-web-app";
import { getSupabase } from "@/lib/supabase";
import { taskService, ITask } from "./services/taskService";

export default function Home() {
  const { t, i18n } = useTranslation();

  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<WebAppUser | null>(null);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    const tg = window.Telegram?.WebApp;

    if (tg && tg.initDataUnsafe?.user) {
      tg.ready();
      tg.expand();
      setUser(tg.initDataUnsafe.user as WebAppUser);
    } else if (process.env.NODE_ENV === "development") {
      setUser({
        id: 19012026,
        first_name: "Leverkusen",
        username: "dev_unit",
        language_code: "ru",
      } as WebAppUser);
    }
  }, []);

  const getClient = useCallback(() => {
    if (!user?.id) return null;
    return getSupabase(user.id.toString());
  }, [user]);

  const fetchTasks = useCallback(async () => {
    const sb = getClient();
    if (!sb) return;

    try {
      const data = await taskService.getAll(sb);
      setTasks(data);
    } finally {
      setIsLoading(false);
    }
  }, [getClient]);

  useEffect(() => {
    if (isClient && user?.id) {
      fetchTasks();
    }
  }, [isClient, user, fetchTasks]);

  const addTask = async () => {
    const text = prompt(t("new_task"));
    const sb = getClient();
    if (text?.trim() && user && sb) {
      const now = new Date();
      const formattedTime = `${now.getDate().toString().padStart(2, "0")}.${(now.getMonth() + 1).toString().padStart(2, "0")} (${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")})`;

      try {
        await taskService.create(sb, {
          user_id: user.id.toString(),
          text: text.trim(),
          completed: false,
          created_at: formattedTime,
        });
        fetchTasks();
        window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred(
          "success",
        );
      } catch (e) {
        console.error("Add failed:", e);
      }
    }
  };

  const toggleTask = async (task: ITask) => {
    const sb = getClient();
    if (!sb || !user) return;
    try {
      await taskService.toggle(sb, task.id, !task.completed);
      fetchTasks();
    } catch (e) {
      console.error("Toggle failed:", e);
    }
  };

  const deleteTask = useCallback(
    async (id: number) => {
      const sb = getClient();
      const tg = window.Telegram?.WebApp;
      if (!sb || !user) return;

      const runDelete = async () => {
        try {
          await taskService.delete(sb, id);
          fetchTasks();
          tg?.HapticFeedback?.notificationOccurred("warning");
        } catch (e) {
          console.error("Delete failed:", e);
        }
      };

      if (tg?.isVersionAtLeast?.("6.2") && tg.showConfirm) {
        tg.showConfirm(t("delete_confirm"), (ok) => ok && runDelete());
      } else if (window.confirm(t("delete_confirm"))) {
        runDelete();
      }
    },
    [getClient, fetchTasks, user, t],
  );

  const toggleLang = () => {
    const ls = ["en", "ru", "de", "ua"];
    i18n.changeLanguage(ls[(ls.indexOf(i18n.language) + 1) % ls.length]);
  };

  if (!isClient) return <div className="min-h-screen bg-[#080c14]" />;

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
          <div className="relative w-16 h-16 rounded-full border-2 border-blue-500/50 p-1 overflow-hidden">
            <Image
              src={
                user?.photo_url ||
                `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.id || "guest"}`
              }
              alt="User Avatar"
              fill
              className="rounded-full object-cover p-1"
              unoptimized={true}
            />
          </div>
          <div className="text-left">
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
          <h3 className="text-sm font-black text-blue-500 uppercase tracking-[0.2em] mb-4 text-left">
            {t("title")}
          </h3>
          <p className="text-base text-slate-300 leading-relaxed font-medium italic text-left">
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
            {isLoading ? (
              <div className="text-center py-20 text-blue-500/50 font-mono text-xs uppercase tracking-widest animate-pulse">
                Syncing...
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-20 rounded-3xl border-2 border-dashed border-slate-800/50 bg-slate-900/20">
                <p className="text-slate-500 italic text-lg font-light tracking-wide">
                  {t("placeholder")}
                </p>
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={`group flex items-center justify-between p-5 rounded-2xl border transition-all duration-500 ${task.completed ? "bg-blue-500/5 border-blue-500/20 opacity-50 translate-x-1" : "bg-[#0f172a] border-slate-800 shadow-xl"}`}
                >
                  <div className="flex items-center gap-4 overflow-hidden">
                    <button
                      onClick={() => toggleTask(task)}
                      className={`shrink-0 cursor-pointer transition-all ${task.completed ? "text-blue-500 scale-110" : "text-slate-700 hover:text-blue-400"}`}
                    >
                      <CheckCircle2 className="w-7 h-7" />
                    </button>
                    <div className="truncate text-left">
                      <p
                        className={`text-lg font-bold tracking-tight transition-all ${task.completed ? "line-through text-slate-500" : "text-slate-100"}`}
                      >
                        {task.text}
                      </p>
                      <p className="text-xs text-slate-600 font-mono mt-1 uppercase italic">
                        Ref: {task.created_at}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-3 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <footer className="p-12 mt-20 border-t border-slate-900 flex flex-col items-center gap-4 opacity-40">
          <p className="text-lg font-black tracking-[0.3em] uppercase italic">
            Task <span className="text-blue-500">/</span> Manager
          </p>
          <p className="text-[10px] uppercase tracking-[0.5em] font-light italic text-center">
            NEVER STOP EXPLORING • 2026
          </p>
        </footer>
      </main>
    </div>
  );
}
