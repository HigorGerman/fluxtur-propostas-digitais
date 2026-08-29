"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<{ nome: string; role: string } | null>(null);

  useEffect(() => {
    const userStr = sessionStorage.getItem("user") || localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch {}
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-[#070E1B] border-b border-white/10 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 relative rounded-full overflow-hidden border border-[#38BDF8]/40 p-0.5 bg-[#0A1128] group-hover:scale-105 transition-transform duration-300">
            <Image
              src="/logo.png"
              alt="Fluxtur Logo"
              width={40}
              height={40}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-widest text-white group-hover:text-[#38BDF8] transition-colors">
              FLUXTUR
            </span>
            <span className="text-[9px] tracking-widest bg-[#0A1128] text-[#38BDF8] px-2 py-0.5 rounded font-bold uppercase border border-[#38BDF8]/30">
              PROPOSTA DIGITAL
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              {(user.role === "Admin" || user.role === "Funcionario") && (
                <Link
                  href="/admin"
                  className="px-4 py-2 bg-[#0A1128] hover:bg-[#121E3E] text-[#38BDF8] border border-[#38BDF8]/30 font-bold text-xs rounded-xl transition-all"
                >
                  Painel Admin
                </Link>
              )}
              <span className="hidden sm:inline text-xs font-semibold text-slate-300">
                Olá, {user.nome.split(" ")[0]}
              </span>
              <button
                onClick={handleLogout}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer"
              >
                Sair
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 bg-gradient-to-r from-[#0284C7] to-[#38BDF8] text-[#070E1B] font-black text-xs rounded-xl transition-all shadow-[0_0_15px_rgba(56,189,248,0.3)] hover:brightness-110"
              >
                Painel do Agente
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
