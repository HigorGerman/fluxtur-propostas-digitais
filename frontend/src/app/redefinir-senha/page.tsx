"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { apiRequest } from "@/services/api";

function RedefinirSenhaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError("Token de recuperação não encontrado no link. Por favor, solicite um novo link.");
      return;
    }

    if (novaSenha.length < 8) {
      setError("A nova senha deve ter no mínimo 8 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setError("A confirmação de senha não confere com a nova senha digitada.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await apiRequest<{ message: string }>("/auth/redefinir-senha", {
        method: "POST",
        body: JSON.stringify({
          token,
          novaSenha,
        }),
      });

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2500);
    } catch (err: any) {
      setError(err.message || "Não foi possível redefinir sua senha. O link pode ter expirado.");
    } finally {
      setLoading(false);
    }
  };

  return (
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
            Cadastrar Nova Senha
          </p>
        </div>
      </div>

      {success ? (
        /* SUCESSO E REDIRECIONAMENTO */
        <div className="text-center space-y-4 py-3">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 text-2xl">
            ✓
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-black text-[#0A1A3C]">Senha Alterada com Sucesso!</h2>
            <p className="text-xs text-slate-600">
              Sua nova credencial foi atualizada. Você será redirecionado para a tela de login em instantes...
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center justify-center w-full py-3 bg-[#0A1A3C] hover:bg-[#122A5C] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              Ir para o Login Agora
            </Link>
          </div>
        </div>
      ) : (
        /* FORMULÁRIO DE NOVA SENHA */
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-base font-black text-[#0A1A3C]">Definir Nova Senha</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Crie uma senha segura com no mínimo 8 caracteres para sua conta.
            </p>
          </div>

          {!token && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium space-y-1">
              <span className="font-bold block">⚠️ Link incompleto</span>
              <p>O token de recuperação não foi detectado no link. Solicite uma nova recuperação para continuar.</p>
              <Link href="/esqueci-senha" className="inline-block font-bold text-amber-900 underline mt-1">
                Solicitar novo link de recuperação
              </Link>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="novaSenha">
              Nova Senha (mínimo 8 caracteres):
            </label>
            <div className="relative">
              <input
                id="novaSenha"
                type={showPassword ? "text" : "password"}
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                disabled={loading || !token}
                placeholder="••••••••"
                required
                minLength={8}
                className="w-full p-3 pr-10 bg-white border border-slate-300 rounded-xl text-xs text-[#111827] placeholder-slate-400 focus:outline-none focus:border-[#0A1A3C] focus:ring-1 focus:ring-[#0A1A3C] transition-all"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-700 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="confirmarSenha">
              Confirmar Nova Senha:
            </label>
            <input
              id="confirmarSenha"
              type={showPassword ? "text" : "password"}
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              disabled={loading || !token}
              placeholder="••••••••"
              required
              minLength={8}
              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs text-[#111827] placeholder-slate-400 focus:outline-none focus:border-[#0A1A3C] focus:ring-1 focus:ring-[#0A1A3C] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !token || novaSenha.length < 8 || novaSenha !== confirmarSenha}
            className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 ${
              loading || !token || novaSenha.length < 8 || novaSenha !== confirmarSenha
                ? "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
                : "bg-[#0A1A3C] hover:bg-[#122A5C] text-white shadow-md cursor-pointer hover:shadow-lg"
            }`}
          >
            {loading && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
            {loading ? "Salvando..." : "Salvar Nova Senha"}
          </button>

          <div className="text-center pt-2 border-t border-slate-100">
            <Link href="/login" className="text-xs text-slate-500 hover:text-[#0A1A3C] transition-colors font-semibold">
              ← Cancelar e Voltar ao Login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}

export default function RedefinirSenhaPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#111827] font-sans flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-[#0A1A3C] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500 font-bold">Carregando formulário seguro...</p>
        </div>
      }>
        <RedefinirSenhaContent />
      </Suspense>
    </div>
  );
}
