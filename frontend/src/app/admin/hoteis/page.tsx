"use client";

import { useEffect, useState, FormEvent, useMemo } from "react";
import Link from "next/link";
import { apiRequest } from "@/services/api";
import {
  Hotel as HotelIcon,
  Plus,
  Search,
  Trash2,
  MapPin,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Send,
  Building2,
  X
} from "lucide-react";

interface Hotel {
  id: string;
  nome: string;
  cidade: string;
  endereco: string;
  estrelas?: number;
  fotoUrl?: string;
  galeriaFotos?: string;
}

export default function AdminHoteisPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Campos do formulário simplificado
  const [nome, setNome] = useState("");
  const [cidade, setCidade] = useState("");
  const [endereco, setEndereco] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [galeriaFotos, setGaleriaFotos] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchHotels = async () => {
    try {
      const data = await apiRequest<Hotel[]>("/hotels");
      setHotels(data);
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    const userStr = sessionStorage.getItem("user") || localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setRole(user.role);
      } catch {}
    }
    fetchHotels().finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      setError("Por favor, informe o nome do hotel ou acomodação.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("nome", nome.trim());
    formData.append("cidade", cidade.trim());
    formData.append("endereco", endereco.trim());
    formData.append("estrelas", "5");
    formData.append("telefone", "");
    formData.append("emailContato", "");

    if (fotoUrl && fotoUrl.trim() !== "") {
      formData.append("fotoUrl", fotoUrl.trim());
    }
    if (galeriaFotos && galeriaFotos.trim() !== "") {
      formData.append("galeriaFotos", galeriaFotos.trim());
    }

    try {
      await apiRequest("/hotels", {
        method: "POST",
        body: formData,
      });

      setNome("");
      setCidade("");
      setEndereco("");
      setFotoUrl("");
      setGaleriaFotos("");
      setShowForm(false);
      setSuccessMessage("Hotel adicionado com sucesso ao catálogo!");
      setTimeout(() => setSuccessMessage(null), 4000);
      await fetchHotels();
    } catch (err: any) {
      setError(err.message || "Erro ao cadastrar hotel no catálogo.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, hotelNome: string) => {
    if (!window.confirm(`Deseja realmente remover o hotel "${hotelNome}" do catálogo rápido?`)) {
      return;
    }

    setDeletingId(id);
    try {
      await apiRequest(`/hotels/${id}`, { method: "DELETE" });
      setHotels((prev) => prev.filter((h) => h.id !== id));
      setSuccessMessage(`Hotel "${hotelNome}" removido do catálogo.`);
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err: any) {
      alert(err.message || "Erro ao remover hotel.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredHotels = useMemo(() => {
    if (!searchTerm.trim()) return hotels;
    const term = searchTerm.toLowerCase();
    return hotels.filter(
      (h) =>
        h.nome.toLowerCase().includes(term) ||
        (h.cidade && h.cidade.toLowerCase().includes(term)) ||
        (h.endereco && h.endereco.toLowerCase().includes(term))
    );
  }, [hotels, searchTerm]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-slate-500 font-medium text-sm">
        Carregando catálogo de hotéis...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 p-4 sm:p-6 lg:p-8">
      {/* CABEÇALHO */}
      <div className="bg-white border border-[#E5E9F0] rounded-xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A1A3C] text-[#5EA8FF] text-xs font-bold tracking-wide mb-2">
            <Building2 className="w-3.5 h-3.5" />
            CATÁLOGO RÁPIDO DE HOSPEDAGENS
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1A3C] tracking-tight">
            Catálogo de Hotéis
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl mt-1">
            Gerencie os hotéis e pousadas cadastrados para puxar automaticamente ao criar novas propostas.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0A1A3C] hover:bg-[#122A5C] text-white font-bold text-xs rounded-lg shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4 text-[#5EA8FF]" />}
            <span>{showForm ? "Fechar Cadastro" : "+ Novo Hotel"}</span>
          </button>
        </div>
      </div>

      {/* NOTIFICAÇÃO DE SUCESSO */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* CALLOUT EXPLICATIVO DO FLUXO RÁPIDO */}
      <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-xl flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-950 leading-relaxed">
          <strong className="font-bold text-blue-900">Como funciona o catálogo de hotéis:</strong> Você não precisa cadastrar todos os hotéis de antemão! Ao montar uma nova proposta em <strong>"Nova Proposta"</strong>, basta preencher o nome e foto do hotel e manter a opção <strong>"Salvar no catálogo rápido"</strong> marcada. O hotel fica salvo automaticamente para todas as próximas propostas!
        </div>
      </div>

      {/* FORMULÁRIO SIMPLIFICADO DE CADASTRO AVULSO */}
      {showForm && (
        <div className="bg-white border border-[#E5E9F0] rounded-xl p-6 shadow-sm space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-[#E5E9F0] pb-4">
            <div>
              <h2 className="text-base font-bold text-[#0A1A3C]">
                Adicionar Hotel ao Catálogo
              </h2>
              <p className="text-xs text-slate-500">
                Preencha apenas as informações reais utilizadas nas propostas digitais.
              </p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-100 text-sky-800">
              Avulso
            </span>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nome do Hotel / Acomodação *
                </label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Grand Hyatt Rio de Janeiro"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E5E9F0] rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0A1A3C] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Cidade / Destino
                </label>
                <input
                  type="text"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  placeholder="Ex: Rio de Janeiro, RJ"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E5E9F0] rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0A1A3C] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Endereço Completo (Opcional)
              </label>
              <input
                type="text"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="Ex: Av. Lúcio Costa, 9600 - Barra da Tijuca"
                className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E5E9F0] rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0A1A3C] transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  URL da Foto Principal (Capa)
                </label>
                <input
                  type="url"
                  value={fotoUrl}
                  onChange={(e) => setFotoUrl(e.target.value)}
                  placeholder="https://exemplo.com/foto-hotel.jpg"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E5E9F0] rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0A1A3C] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Galeria de Fotos (Links separados por vírgula)
                </label>
                <input
                  type="text"
                  value={galeriaFotos}
                  onChange={(e) => setGaleriaFotos(e.target.value)}
                  placeholder="https://ex.com/foto1.jpg, https://ex.com/foto2.jpg"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E5E9F0] rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0A1A3C] transition-all"
                />
              </div>
            </div>

            {/* PREVIEW DA FOTO */}
            {fotoUrl && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3">
                <div className="w-16 h-12 rounded overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
                  <img
                    src={fotoUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>
                <div className="text-xs text-slate-600">
                  <p className="font-bold text-slate-800">Preview da Foto de Capa</p>
                  <p className="text-[11px] text-slate-500">Essa foto será exibida no card do hotel e nas propostas.</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-[#0A1A3C] hover:bg-[#122A5C] text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                {submitting ? "Salvando..." : "Salvar no Catálogo"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* BARRA DE PESQUISA DO CATÁLOGO */}
      <div className="bg-white border border-[#E5E9F0] rounded-xl p-4 shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar hotel por nome, cidade ou endereço..."
            className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#E5E9F0] rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#0A1A3C]"
          />
        </div>

        <div className="text-xs font-bold text-slate-500 shrink-0">
          Total: <span className="text-[#0A1A3C] font-extrabold">{filteredHotels.length}</span> hotéis
        </div>
      </div>

      {/* GRADE DE CARDS DE HOTÉIS */}
      {filteredHotels.length === 0 ? (
        <div className="bg-white border border-[#E5E9F0] rounded-xl p-12 text-center space-y-3">
          <HotelIcon className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">
            {searchTerm ? `Nenhum hotel encontrado para "${searchTerm}"` : "Nenhum hotel no catálogo ainda"}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchTerm
              ? "Tente buscar por outro termo ou limpe a pesquisa."
              : "Cadastre seu primeiro hotel acima ou crie uma nova proposta com 'Salvar no catálogo rápido' ativado."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHotels.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-white border border-[#E5E9F0] rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col group"
            >
              <div className="h-40 w-full relative bg-[#0A1A3C] overflow-hidden">
                {hotel.fotoUrl ? (
                  <img
                    src={hotel.fotoUrl}
                    alt={hotel.nome}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                    <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain opacity-50 mb-1" />
                    <span className="text-[11px] font-semibold text-slate-300">Sem foto de capa</span>
                  </div>
                )}
                <div className="absolute top-2.5 right-2.5">
                  <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold">
                    {hotel.cidade || "Destino Flexível"}
                  </span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-[#0A1A3C] line-clamp-1" title={hotel.nome}>
                    {hotel.nome}
                  </h3>
                  {hotel.endereco ? (
                    <p className="text-xs text-slate-500 flex items-center gap-1 line-clamp-1" title={hotel.endereco}>
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span>{hotel.endereco}</span>
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400 italic">Endereço não informado</p>
                  )}
                </div>

                <div className="pt-2 border-t border-[#E5E9F0] flex items-center justify-between gap-2">
                  <Link
                    href={`/admin/orcamentos/novo?hotelId=${hotel.id}`}
                    className="text-[11px] font-bold text-[#0284C7] hover:text-[#0369A1] flex items-center gap-1"
                  >
                    <span>Usar em Proposta</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>

                  <button
                    onClick={() => handleDelete(hotel.id, hotel.nome)}
                    disabled={deletingId === hotel.id}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                    title="Remover do catálogo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
