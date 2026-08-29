import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0A1A3C] text-slate-300 border-t border-[#122A5C] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        <div className="space-y-4">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-black tracking-widest text-[#5EA8FF]">
              FLUXTUR
            </span>
          </Link>
          <p className="text-sm text-slate-400 leading-relaxed">
            Sua agência de viagens completa. Conectamos você aos melhores destinos, hotéis parceiros e experiências inesquecíveis.
          </p>
        </div>

        <div>
          <h3 className="text-white font-bold text-base mb-4 tracking-tight">Navegação Rápidas</h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link href="/" className="hover:text-[#5EA8FF] transition-colors">Início</Link>
            </li>
            <li>
              <Link href="/pacotes" className="hover:text-[#5EA8FF] transition-colors">Pacotes de Viagem</Link>
            </li>
            <li>
              <Link href="/hoteis" className="hover:text-[#5EA8FF] transition-colors">Hotéis Parceiros</Link>
            </li>
            <li>
              <Link href="/#sobre" className="hover:text-[#5EA8FF] transition-colors">Sobre a Fluxtur</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold text-base mb-4 tracking-tight">Suporte & Dúvidas</h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <span className="hover:text-[#5EA8FF] transition-colors cursor-pointer">Central de Ajuda</span>
            </li>
            <li>
              <span className="hover:text-[#5EA8FF] transition-colors cursor-pointer">Política de Privacidade</span>
            </li>
            <li>
              <span className="hover:text-[#5EA8FF] transition-colors cursor-pointer">Termos de Uso</span>
            </li>
            <li>
              <span className="hover:text-[#5EA8FF] transition-colors cursor-pointer">Segurança nas Reservas</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold text-base mb-4 tracking-tight">Atendimento</h3>
          <div className="space-y-3 text-sm text-slate-400">
            <p>📞 0800 777 5890</p>
            <p>✉️ contato@fluxtur.com.br</p>
            <p>📍 Av. Paulista, 1000 - São Paulo, SP</p>
            <p className="text-xs text-slate-400 mt-2">Segunda a Sexta, das 08h às 20h</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-[#122A5C] flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <p>© 2026 Fluxtur Viagens & Turismo Ltda. Todos os direitos reservados.</p>
        <div className="flex items-center gap-6">
          <span>CNPJ: 12.345.678/0001-90</span>
          <span>Cadastur: 26.012345.10.0001-8</span>
        </div>
      </div>
    </footer>
  );
}
