"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { apiRequest } from "@/services/api";

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);

    try {
      await apiRequest<{ message: string }>("/auth/esqueci-senha", {
        method: "POST",
        body: JSON.stringify({ email: email.trim() }),
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao processar a solicitação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#111827] font-sans flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-8 shadow-xl space-y-6">
        
        {/* LOGO E IDENTIDADE */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block group">
            <div className="w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-[#0A1A3C] p-0.5 bg-[#0A1A3C] shadow-md group-hover:scale-105 transition-transform">
              <Image
                src="/logo.png"
                alt="Fluxtur Logo"
                width={64}
                height={64}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </Link>
          <div>
            <span className="text-2xl font-black tracking-widest text-[#0A1A3C]">FLUXTUR</span>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
              Recuperação de Acesso Administrativo
            </p>
          </div>
        </div>

        {submitted ? (
          /* MENSAGEM AMIGÁVEL DE CONFIRMAÇÃO */
          <div className="space-y-5 text-center py-2">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 text-2xl">
              ✉️
            </div>
            
            <div className="space-y-2">
              <h2 className="text-lg font-black text-[#0A1A3C]">Instruções Enviadas!</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Se este e-mail estiver registrado, as instruções de recuperação foram enviadas.
              </p>
              <p className="text-[11px] text-slate-400">
                Verifique sua caixa de entrada e a pasta de spam. O link expira em 30 minutos.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center justify-center w-full py-3 bg-[#0A1A3C] hover:bg-[#122A5C] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                Voltar para o Login
              </Link>
            </div>
          </div>
        ) : (
          /* FORMULÁRIO DE RECUPERAÇÃO */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-base font-black text-[#0A1A3C]">Esqueceu sua senha?</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Informe o e-mail corporativo cadastrado para receber o link seguro de redefinição de senha.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="email">
                E-mail Administrativo:
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                placeholder="seu.email@fluxtur.com.br"
                required
                className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs text-[#111827] placeholder-slate-400 focus:outline-none focus:border-[#0A1A3C] focus:ring-1 focus:ring-[#0A1A3C] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 ${
                loading || !email.trim()
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
                  : "bg-[#0A1A3C] hover:bg-[#122A5C] text-white shadow-md cursor-pointer hover:shadow-lg"
              }`}
            >
              {loading && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
              {loading ? "Processando..." : "Enviar Link de Recuperação"}
            </button>

            <div className="text-center pt-2 border-t border-slate-100">
              <Link href="/login" className="text-xs text-slate-500 hover:text-[#0A1A3C] transition-colors font-semibold">
                ← Voltar para o Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
