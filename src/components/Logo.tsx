import Image from 'next/image';
import Link from 'next/link';

type LogoProps = {
  href?: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
};

export function Logo({
  href = '/',
  width = 160,
  height = 40,
  className = '',
  priority = false,
}: LogoProps) {
  return (
    <Link href={href} className={className} aria-label="Ir para a home">
      <Image
        src="/Excursor_Logo_Fundo_Branco.png"
        alt="ExcursoesApp"
        width={width}
        height={height}
        priority={priority}
      />
    </Link>
  );
}