"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const whatsappAgencyNumber = "5518998048355";
  const whatsappBioUrl = "https://api.whatsapp.com/message/4S7WZNCQT5SUH1?autoload=1&app_absent=0&utm_source=ig";
  const whatsappUrl = whatsappBioUrl;

  const destinosDestaque = [
    {
      id: "cancun",
      titulo: "Cancún & Riviera Maya",
      subtitulo: "Resort All Inclusive 5 Estrelas",
      imagem: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      precoApartir: "R$ 4.890",
      inclusoes: ["Voo Direto", "Resort Beira-Mar", "Transfer Executivo", "Seguro Viagem"],
    },
    {
      id: "paris",
      titulo: "Paris & Romantismo Francês",
      subtitulo: "Hospedagem de Charme + Passeios Exclusivos",
      imagem: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
      precoApartir: "R$ 6.450",
      inclusoes: ["Passagem Aérea", "Hotel de Charme", "Passeio de Barco no Sena", "Seguro Viagem"],
    },
    {
      id: "maldivas",
      titulo: "Arquipélago de Maldivas",
      subtitulo: "Bungalow Sobre as Águas com Piscina Privativa",
      imagem: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80",
      precoApartir: "R$ 9.800",
      inclusoes: ["Transfer Hidroavião", "Pensão Completa", "Assistência 24h", "Seguro Viagem"],
    },
    {
      id: "gramado",
      titulo: "Gramado & Serra Gaúcha",
      subtitulo: "Experiência Gastronômica e Rota dos Vinhos",
      imagem: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
      precoApartir: "R$ 2.150",
      inclusoes: ["Hospedagem 5★", "Tour Maria Fumaça", "Transfer Aeroporto", "Seguro Viagem"],
    },
  ];

  return (
    <div className="min-h-screen bg-[#070E1B] text-slate-100 font-sans selection:bg-[#38BDF8] selection:text-[#070E1B]">
      {/* BACKGROUND GLOW ACCENTS */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#38BDF8]/15 via-[#0284C7]/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* HEADER / NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#070E1B]/90 backdrop-blur-md border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 relative rounded-full overflow-hidden border border-[#38BDF8]/40 p-0.5 bg-[#0A1128] group-hover:scale-105 transition-transform duration-300 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
              <Image
                src="/logo.png"
                alt="Fluxtur Logo"
                width={48}
                height={48}
                priority
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-widest text-white group-hover:text-[#38BDF8] transition-colors">
                FLUXTUR
              </span>
              <span className="text-[9px] font-bold tracking-[0.2em] text-[#38BDF8] uppercase">
                AGÊNCIA DE VIAGENS
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 font-semibold text-sm text-slate-300">
            <a href="#vitrine" className="hover:text-[#38BDF8] transition-colors">
              Vitrine de Viagens
            </a>
            <a href="#como-funciona" className="hover:text-[#38BDF8] transition-colors">
              Proposta Digital
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
              </svg>
              WhatsApp
            </a>

            <Link
              href="/login"
              className="px-4 py-2.5 bg-gradient-to-r from-[#0284C7] to-[#38BDF8] hover:brightness-110 text-[#070E1B] font-black text-xs rounded-xl shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Área Restrita
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-24 px-6 max-w-7xl mx-auto text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/30 text-[#38BDF8] text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse"></span>
            Propostas de Viagem Exclusivas & Sob Medida
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
            Sua próxima viagem planejada com <span className="bg-gradient-to-r from-[#38BDF8] via-[#0284C7] to-cyan-300 bg-clip-text text-transparent">excelência e facilidade</span>.
          </h1>

          <p className="text-base md:text-lg text-slate-300 font-light max-w-xl leading-relaxed">
            Monte itinerários incríveis, receba sua <strong>Proposta Digital Interativa</strong> diretamente no celular e aprove sua viagem em poucos cliques.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#25D366] to-[#1eb854] hover:opacity-95 text-white font-black text-sm rounded-xl shadow-xl transition-all flex items-center justify-center gap-3 group"
            >
              <svg className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
              </svg>
              Solicitar Orçamento no WhatsApp
            </a>

            <a
              href="#vitrine"
              className="w-full sm:w-auto px-6 py-4 bg-[#0A1128] hover:bg-[#121E3E] text-slate-200 border border-white/10 hover:border-[#38BDF8]/40 font-bold text-sm rounded-xl transition-all text-center"
            >
              Explorar Vitrine ➔
            </a>
          </div>
        </div>

        <div className="w-full md:w-96 flex items-center justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#38BDF8]/20 to-transparent rounded-full blur-2xl -z-10" />
          <div className="bg-[#0A1128]/80 border border-[#38BDF8]/30 p-8 rounded-3xl backdrop-blur-xl shadow-2xl text-center space-y-6">
            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-[#38BDF8] p-1 bg-[#070E1B] shadow-[0_0_25px_rgba(56,189,248,0.3)]">
              <Image src="/logo.png" alt="Fluxtur Logo" width={96} height={96} className="w-full h-full object-cover rounded-full" />
            </div>

            <div>
              <h3 className="text-xl font-black text-white">Fluxtur Agência</h3>
              <p className="text-xs text-[#38BDF8] font-semibold mt-1">Consultoria de Viagens Exclusivas</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#070E1B]/60 border border-white/5 text-left text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[#38BDF8]">✓</span>
                <span>Propostas Interativas via Link</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#38BDF8]">✓</span>
                <span>Atendimento Personalizado</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#38BDF8]">✓</span>
                <span>Hotéis e Vôos Selecionados</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VITRINE DE DESTINOS */}
      <section id="vitrine" className="py-20 px-6 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-[#38BDF8] uppercase tracking-widest bg-[#38BDF8]/10 px-3 py-1 rounded-full border border-[#38BDF8]/20">
            Inspiração de Viagem
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white">Vitrine de Roteiros Exclusivos</h2>
          <p className="text-slate-400 text-sm">
            Confira alguns dos destinos mais desejados com pacotes montados sob medida por nossa equipe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinosDestaque.map((item) => (
            <div
              key={item.id}
              className="bg-[#0A1128] border border-white/10 hover:border-[#38BDF8]/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_0_30px_rgba(56,189,248,0.15)] transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-52 w-full overflow-hidden bg-slate-900">
                <img
                  src={item.imagem}
                  alt={item.titulo}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-[#070E1B]/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#38BDF8]/30 text-xs font-black text-[#38BDF8]">
                  A partir de {item.precoApartir}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-black text-white group-hover:text-[#38BDF8] transition-colors">
                    {item.titulo}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 font-medium">{item.subtitulo}</p>
                </div>

                <div className="space-y-2 border-t border-white/5 pt-4">
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Incluso no pacote:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.inclusoes.map((inc, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-white/5 text-[#38BDF8] px-2 py-0.5 rounded border border-[#38BDF8]/20 font-semibold"
                      >
                        {inc}
                      </span>
                    ))}
                  </div>
                </div>

                <a
                  href={`https://wa.me/${whatsappAgencyNumber}?text=${encodeURIComponent(
                    `Olá! Vi o destino *${item.titulo}* na vitrine do site e gostaria de solicitar uma Proposta Digital!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-[#38BDF8]/10 hover:bg-[#38BDF8] text-[#38BDF8] hover:text-[#070E1B] font-bold text-xs rounded-xl border border-[#38BDF8]/30 transition-all text-center block mt-2"
                >
                  Solicitar este Roteiro
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA A PROPOSTA DIGITAL */}
      <section id="como-funciona" className="py-20 px-6 bg-[#0A1128]/50 border-t border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-[#38BDF8] uppercase tracking-widest bg-[#38BDF8]/10 px-3 py-1 rounded-full border border-[#38BDF8]/20">
              Experiência Fluxtur
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white">Como Funciona a Proposta Digital?</h2>
            <p className="text-slate-400 text-sm">
              Sem burocracias: tudo direto no seu celular com total transparência e facilidade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#070E1B] border border-white/10 p-8 rounded-2xl space-y-4 relative">
              <span className="text-4xl font-black text-[#38BDF8]">01</span>
              <h3 className="text-xl font-bold text-white">Você Solicita</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Entre em contato pelo WhatsApp informando suas preferências de datas, destinos e perfil de viagem.
              </p>
            </div>

            <div className="bg-[#070E1B] border border-[#38BDF8]/40 p-8 rounded-2xl space-y-4 relative shadow-[0_0_20px_rgba(56,189,248,0.1)]">
              <span className="text-4xl font-black text-[#38BDF8]">02</span>
              <h3 className="text-xl font-bold text-white">Criamos Sua Proposta Digital</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Elaboramos um link exclusivo com fotos da hospedagem, opções de voo, passeios inclusos e valor total.
              </p>
            </div>

            <div className="bg-[#070E1B] border border-white/10 p-8 rounded-2xl space-y-4 relative">
              <span className="text-4xl font-black text-[#38BDF8]">03</span>
              <h3 className="text-xl font-bold text-white">Aprovação em 1 Clique</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Você acessa a proposta, confere todos os detalhes e clica em "Aprovar Orçamento" para garantirmos suas reservas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 bg-[#040810] border-t border-white/10 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#38BDF8]/40 p-0.5 bg-[#0A1128]">
              <Image src="/logo.png" alt="Fluxtur Logo" width={32} height={32} className="w-full h-full object-cover rounded-full" />
            </div>
            <span className="font-black text-white tracking-widest text-base">FLUXTUR VIAGENS</span>
          </div>

          <p>© 2026 Fluxtur. Todos os direitos reservados. Gestão de Propostas digitais sob medida.</p>

          <div className="flex items-center gap-4 font-semibold">
            <Link href="/login" className="hover:text-[#38BDF8] transition-colors">
              Painel Admin
            </Link>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#38BDF8] transition-colors">
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
