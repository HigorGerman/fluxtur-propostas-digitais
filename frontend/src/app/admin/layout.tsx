"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const userStr = sessionStorage.getItem("user") || localStorage.getItem("user");
    if (!userStr) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role !== "Admin" && user.role !== "Funcionario") {
        router.push("/login");
        return;
      }
      setRole(user.role);
      setUserName(user.nome);
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const getInitials = (name: string) => {
    if (!name) return "AD";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  const getSectionTitle = () => {
    if (pathname === "/admin") return { parent: "Visao Geral", title: "Dashboard Executivo" };
    if (pathname === "/admin/hoteis") return { parent: "Gestao", title: "Hoteis Credenciados" };
    if (pathname === "/admin/pacotes") return { parent: "Gestao", title: "Pacotes de Viagem" };
    if (pathname.startsWith("/admin/orcamentos")) return { parent: "Cotações", title: "Propostas Digitais Interativas" };
    if (pathname === "/admin/manual") return { parent: "Central de Ajuda", title: "Manual de Operação Fluxtur" };
    return { parent: "Painel Admin", title: "Administracao" };
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0A1A3C] text-white">
        <div className="text-xl font-black tracking-[0.15em] text-[#5EA8FF] animate-pulse">
          FLUXTUR
        </div>
      </div>
    );
  }

  const isLinkActive = (path: string) => pathname === path;
  const sectionInfo = getSectionTitle();

  return (
    <div className="flex h-screen bg-[#F5F7FB] text-[#111827] overflow-hidden font-sans">
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col h-full w-72 bg-[#0A1A3C] text-white border-r border-[#122A5C] transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 shrink-0 shadow-lg ${
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between px-6 border-b border-[#122A5C] shrink-0">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-10 h-10 relative rounded-full overflow-hidden border border-[#5EA8FF]/40 p-0.5 bg-[#0A1128] shrink-0">
              <img
                src="/logo.png"
                alt="Fluxtur Logo"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-[0.12em] text-[#5EA8FF]">
                FLUXTUR
              </span>
              <span className="text-[9px] tracking-[0.15em] text-slate-300 font-bold uppercase">
                PAINEL DA AGÊNCIA
              </span>
            </div>
          </Link>

          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 text-slate-300 hover:text-white md:hidden cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 space-y-6 px-4 py-6 overflow-y-auto">
          <div>
            <div className="px-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-3">
              Visao Geral
            </div>

            <Link
              href="/admin"
              className={`group flex items-center justify-between px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                isLinkActive("/admin")
                  ? "bg-[#122A5C] text-[#5EA8FF] border-l-4 border-[#5EA8FF] shadow-xs"
                  : "text-slate-200 hover:text-white hover:bg-[#122A5C]/60"
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div className={`p-2 rounded-md transition-all shrink-0 ${
                  isLinkActive("/admin")
                    ? "bg-[#5EA8FF] text-[#0A1A3C]"
                    : "bg-[#122A5C] text-slate-300 group-hover:text-white"
                }`}>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
                  </svg>
                </div>
                <span className="truncate">Dashboard</span>
              </div>
            </Link>

            <Link
              href="/"
              className="group flex items-center justify-between px-4 py-3 rounded-lg font-semibold text-sm text-slate-200 hover:text-white hover:bg-[#122A5C]/60 transition-all duration-200 mt-1"
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div className="p-2 rounded-md bg-[#122A5C] text-slate-300 group-hover:text-white transition-all shrink-0">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <span className="truncate">Tela Inicial (Site)</span>
              </div>
              <span className="text-slate-400 text-xs">↗</span>
            </Link>
          </div>


          {role === "Admin" && (
            <div>
              <div className="px-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-3">
                Gestao Principal
              </div>

              <div className="space-y-1.5">

                <Link
                  href="/admin/hoteis"
                  className={`group flex items-center justify-between px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                    isLinkActive("/admin/hoteis")
                      ? "bg-[#122A5C] text-[#5EA8FF] border-l-4 border-[#5EA8FF] shadow-xs"
                      : "text-slate-200 hover:text-white hover:bg-[#122A5C]/60"
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className={`p-2 rounded-md transition-all shrink-0 ${
                      isLinkActive("/admin/hoteis")
                        ? "bg-[#5EA8FF] text-[#0A1A3C]"
                        : "bg-[#122A5C] text-slate-300 group-hover:text-white"
                    }`}>
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <span className="truncate">Hotéis</span>
                  </div>
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    Catálogo
                  </span>
                </Link>

                <Link
                  href="/admin/pacotes"
                  className={`group flex items-center justify-between px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                    isLinkActive("/admin/pacotes")
                      ? "bg-[#122A5C] text-[#5EA8FF] border-l-4 border-[#5EA8FF] shadow-xs"
                      : "text-slate-200 hover:text-white hover:bg-[#122A5C]/60 opacity-80"
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className={`p-2 rounded-md transition-all shrink-0 ${
                      isLinkActive("/admin/pacotes")
                        ? "bg-[#5EA8FF] text-[#0A1A3C]"
                        : "bg-[#122A5C] text-slate-300 group-hover:text-white"
                    }`}>
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <span className="truncate">Pacotes Base</span>
                  </div>
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Em Produção
                  </span>
                </Link>

                <Link
                  href="/admin/orcamentos"
                  className={`group flex items-center justify-between px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                    pathname.startsWith("/admin/orcamentos")
                      ? "bg-[#122A5C] text-[#5EA8FF] border-l-4 border-[#5EA8FF] shadow-xs"
                      : "text-slate-200 hover:text-white hover:bg-[#122A5C]/60"
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className={`p-2 rounded-md transition-all shrink-0 ${
                      pathname.startsWith("/admin/orcamentos")
                        ? "bg-[#5EA8FF] text-[#0A1A3C]"
                        : "bg-[#122A5C] text-slate-300 group-hover:text-white"
                    }`}>
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span className="truncate">Orçamentos</span>
                  </div>
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-[#5EA8FF]/20 text-[#5EA8FF] border border-[#5EA8FF]/30">
                    InfoTravel
                  </span>
                </Link>
              </div>
            </div>
          )}

          <div>
            <div className="px-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-3">
              Cotações
            </div>
            <Link
              href="/admin/orcamentos/novo"
              className="group flex items-center space-x-3 px-4 py-3 rounded-lg font-semibold text-sm text-[#5EA8FF] bg-[#122A5C] hover:bg-[#1a3875] border border-[#5EA8FF]/30 transition-all mb-1.5"
            >
              <div className="p-2 rounded-md bg-[#5EA8FF] text-[#0A1A3C] transition-all shrink-0">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="truncate">+ Nova Proposta</span>
            </Link>
          </div>

          <div>
            <div className="px-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-3">
              Ajuda & Suporte
            </div>
            <Link
              href="/admin/manual"
              className={`group flex items-center justify-between px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                isLinkActive("/admin/manual")
                  ? "bg-[#122A5C] text-[#5EA8FF] border-l-4 border-[#5EA8FF] shadow-xs"
                  : "text-slate-200 hover:text-white hover:bg-[#122A5C]/60"
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div className={`p-2 rounded-md transition-all shrink-0 ${
                  isLinkActive("/admin/manual")
                    ? "bg-[#5EA8FF] text-[#0A1A3C]"
                    : "bg-[#122A5C] text-slate-300 group-hover:text-white"
                }`}>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <span className="truncate">Manual do Sistema</span>
              </div>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Guia
              </span>
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-[#122A5C] shrink-0">
          <div className="flex items-center justify-between bg-[#122A5C]/80 border border-[#5EA8FF]/20 p-3 rounded-lg">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="h-9 w-9 rounded-full bg-[#5EA8FF] text-[#0A1A3C] flex items-center justify-center text-xs font-bold shrink-0">
                {getInitials(userName)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">{userName || "Admin"}</p>
                <p className="text-[10px] font-bold text-[#5EA8FF] uppercase tracking-wider">{role || "ADMIN"}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-300 hover:text-red-400 hover:bg-[#0A1A3C] rounded-md transition-colors cursor-pointer shrink-0"
              title="Sair da Conta"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="flex h-20 items-center justify-between px-6 md:px-10 border-b border-[#122A5C] bg-[#0A1A3C] text-white shrink-0 shadow-sm">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 text-slate-300 hover:text-white bg-[#122A5C] rounded-lg md:hidden cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center space-x-2 text-sm">
              <span className="text-slate-300 font-medium">{sectionInfo.parent}</span>
              <span className="text-slate-500">/</span>
              <span className="text-white font-bold tracking-tight text-base">{sectionInfo.title}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#5EA8FF] hover:text-white bg-[#122A5C] hover:bg-[#1a3878] border border-[#5EA8FF]/40 transition-all cursor-pointer shadow-xs"
              title="Voltar para a tela inicial do sistema"
            >
              <span>🏠</span>
              <span>Tela Inicial</span>
            </Link>

            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Sistema Operacional
            </span>

            <div className="flex items-center space-x-2 pl-2 border-l border-[#122A5C]">
              <span className="text-xs font-bold text-[#5EA8FF] bg-[#122A5C] border border-[#5EA8FF]/30 px-3 py-1 rounded-md uppercase tracking-wider">
                {role}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-10 flex flex-col items-center bg-[#F5F7FB]">
          <div className="max-w-6xl w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
