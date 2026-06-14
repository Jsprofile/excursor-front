import { api } from '@/lib/api';
import { Excursion } from '@/types/excursion';
import { ExcursionCard } from '@/components/ExcursionCard';
import { Header } from '@/components/Header';
import { AdminButton } from '@/components/AdminButton';

async function getExcursions(): Promise<Excursion[]> {
  try {
    const { data } = await api.get('/excursions');
    return data;
  } catch (error) {
    console.error('Erro ao buscar excursões:', error);
    return [];
  }
}

export default async function Home() {
  const excursions = await getExcursions();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-16 px-4 text-center">
        <h2 className="text-4xl font-bold mb-3">Encontre sua próxima aventura</h2>
        <p className="text-lg text-white/80">
          Excursões incríveis esperando por você
        </p>
      </section>

      {/* Lista de excursões */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h3 className="text-xl font-bold text-gray-700 mb-6">
          Excursões disponíveis ({excursions.length})
        </h3>

        {excursions.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">🗺️</p>
            <p className="text-lg">Nenhuma excursão disponível no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {excursions.map((excursion) => (
              <ExcursionCard key={excursion.id} excursion={excursion} />
            ))}
          </div>
        )}
      </section>
      <AdminButton />
    </main>
  );
}