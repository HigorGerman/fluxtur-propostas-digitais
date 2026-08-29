"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { apiRequest } from "@/services/api";

interface LoginResponse {
  usuarioId: string;
  nome: string;
  email: string;
  accessToken: string;
  role: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [identificador, setIdentificador] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [identificadorTouched, setIdentificadorTouched] = useState(false);
  const [senhaTouched, setSenhaTouched] = useState(false);

  const isIdentificadorValid = identificador.trim().length > 0;
  const isSenhaValid = senha.length >= 6;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIdentificadorTouched(true);
    setSenhaTouched(true);

    if (!isIdentificadorValid || !isSenhaValid) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiRequest<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ identificador, senha }),
      });

      if (typeof window !== "undefined") {
        const userData = JSON.stringify({
          usuarioId: data.usuarioId,
          nome: data.nome,
          email: data.email,
          role: data.role,
        });
        window.sessionStorage.setItem("accessToken", data.accessToken);
        window.sessionStorage.setItem("user", userData);
        window.localStorage.setItem("accessToken", data.accessToken);
        window.localStorage.setItem("user", userData);
      }

      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Falha ao realizar login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070E1B] text-slate-100 font-sans flex items-center justify-center p-4 relative overflow-hidden selection:bg-[#38BDF8] selection:text-[#070E1B]">
      {/* GLOW BACKGROUND EFFECT */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#38BDF8]/15 via-[#0284C7]/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-md w-full bg-[#0A1128]/90 border border-[#38BDF8]/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(7,14,27,0.8)] backdrop-blur-xl relative z-10 space-y-6">
        {/* LOGO E TÍTULO */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block group">
            <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-[#38BDF8] p-1 bg-[#070E1B] shadow-[0_0_25px_rgba(56,189,248,0.3)] group-hover:scale-105 transition-transform">
              <Image
                src="/logo.png"
                alt="Fluxtur Logo"
                width={80}
                height={80}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </Link>
          <div>
            <h1 className="text-2xl font-black tracking-widest text-white">FLUXTUR</h1>
            <p className="text-xs text-[#38BDF8] font-bold uppercase tracking-wider mt-1">
              Painel Administrativo & Gestão de Propostas
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        {/* FORMULÁRIO */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5" htmlFor="identificador">
              E-mail de Acesso:
            </label>
            <input
              id="identificador"
              type="email"
              value={identificador}
              onChange={(e) => setIdentificador(e.target.value)}
              onBlur={() => setIdentificadorTouched(true)}
              disabled={loading}
              placeholder="admin@gmail.com"
              required
              className="w-full p-3.5 bg-[#070E1B]/80 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition-all"
            />
            {identificadorTouched && !isIdentificadorValid && (
              <p className="text-[11px] text-rose-400 mt-1">Por favor, informe seu e-mail de acesso.</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5" htmlFor="senha">
              Senha:
            </label>
            <div className="relative">
              <input
                id="senha"
                type={showPassword ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                onBlur={() => setSenhaTouched(true)}
                disabled={loading}
                placeholder="••••••••"
                required
                className="w-full p-3.5 pr-10 bg-[#070E1B]/80 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition-all"
              />
              <button
                type="button"
                className="absolute right-3 top-3.5 text-slate-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
            {senhaTouched && !isSenhaValid && (
              <p className="text-[11px] text-rose-400 mt-1">A senha deve ter pelo menos 6 caracteres.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !isIdentificadorValid || !isSenhaValid}
            className={`w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-300 ${
              loading || !isIdentificadorValid || !isSenhaValid
                ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                : "bg-gradient-to-r from-[#0284C7] to-[#38BDF8] text-[#070E1B] shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:brightness-110 cursor-pointer"
            }`}
          >
            {loading ? "Autenticando..." : "Entrar no Painel"}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-white/5">
          <Link href="/" className="text-xs text-slate-400 hover:text-[#38BDF8] transition-colors font-medium">
            ← Voltar para a Vitrine do Site
          </Link>
        </div>
      </div>
    </div>
  );
}
