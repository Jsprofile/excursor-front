import { Header } from '@/components/Header';
import { api } from '@/lib/api';
import { Excursion } from '@/types/excursion';
import Link from 'next/link';

async function getExcursion(id: string): Promise<Excursion | null> {
  try {
    console.log('Buscando excursão com ID:', id);
    const { data } = await api.get(`/excursions/${id}`);
    return data;
  } catch (error) {
    console.error('Erro ao buscar excursão:', error);
    return null;
  }
}

export default async function ExcursionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const excursion = await getExcursion(id);

  if (!excursion) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p className="text-5xl mb-4">😕</p>
          <p className="text-lg">Excursão não encontrada.</p>
          <Link href="/" className="mt-4 inline-block text-indigo-600 hover:underline">
            Voltar para o início
          </Link>
        </div>
      </main>
    );
  }

  const adultPrice = excursion.ticketTypes.find((t) => t.type === 'adult');
  const childPrice = excursion.ticketTypes.find((t) => t.type === 'child');

  const formattedDate = new Date(excursion.departureAt).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const formattedTime = new Date(excursion.departureAt).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
            {excursion.category.name}
          </span>
          <h1 className="text-4xl font-bold mt-4 mb-2">{excursion.title}</h1>
          <p className="text-white/80 text-lg">por {excursion.company.name}</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4">
            <h2 className="text-lg font-bold text-gray-700">Informações</h2>

            <div className="flex items-start gap-3">
              <span className="text-2xl">📍</span>
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">Local de saída</p>
                <p className="text-gray-700 font-medium">{excursion.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">📅</span>
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">Data e horário</p>
                <p className="text-gray-700 font-medium capitalize">{formattedDate}</p>
                <p className="text-gray-500 text-sm">às {formattedTime}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">🪑</span>
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">Vagas totais</p>
                <p className="text-gray-700 font-medium">{excursion.totalSlots} vagas</p>
              </div>
            </div>
          </div>

          {excursion.description && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-700 mb-3">Sobre a excursão</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {excursion.description}
              </p>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-700 mb-3">Organizado por</h2>
            <p className="text-indigo-600 font-semibold text-lg">{excursion.company.name}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
            <h2 className="text-lg font-bold text-gray-700 mb-4">Valores</h2>

            {adultPrice && (
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">🧑 Adulto</span>
                <span className="font-bold text-gray-800">
                  R$ {Number(adultPrice.price).toFixed(2)}
                </span>
              </div>
            )}

            {childPrice && (
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">👧 Criança</span>
                <span className="font-bold text-gray-800">
                  R$ {Number(childPrice.price).toFixed(2)}
                </span>
              </div>
            )}

            {!adultPrice && !childPrice && (
              <p className="text-gray-400 text-sm">Preços não disponíveis.</p>
            )}

            <button className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors text-sm">
              Reservar agora
            </button>

            <p className="text-xs text-gray-400 text-center mt-3">
              Você terá 15 minutos para concluir o pagamento após a reserva.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}