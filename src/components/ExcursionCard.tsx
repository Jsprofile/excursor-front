import Link from 'next/link';
import { Excursion } from '@/types/excursion';

interface Props {
  excursion: Excursion;
}

export function ExcursionCard({ excursion }: Props) {
  const adultPrice = excursion.ticketTypes.find((t) => t.type === 'adult');
  const childPrice = excursion.ticketTypes.find((t) => t.type === 'child');

  const formattedDate = new Date(excursion.departureAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-32 flex items-end p-4">
        <span className="text-white text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">
          {excursion.category.name}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-2">
        <h2 className="text-lg font-bold text-gray-800 leading-tight">
          {excursion.title}
        </h2>

        <p className="text-sm text-gray-500 flex items-center gap-1">
          📍 {excursion.location}
        </p>

        <p className="text-sm text-gray-500 flex items-center gap-1">
          📅 {formattedDate}
        </p>

        <p className="text-sm text-gray-400">
          por <span className="font-medium text-gray-600">{excursion.company.name}</span>
        </p>

        <div className="flex gap-3 mt-2">
          {adultPrice && (
            <span className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
              Adulto: R$ {Number(adultPrice.price).toFixed(2)}
            </span>
          )}
          {childPrice && (
            <span className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium">
              Criança: R$ {Number(childPrice.price).toFixed(2)}
            </span>
          )}
        </div>

        {/* Botão agora é um Link */}
        <Link
          href={`/excursions/${excursion.id}`}
          className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 rounded-xl transition-colors text-center"
        >
          Ver detalhes
        </Link>
      </div>
    </div>
  );
}