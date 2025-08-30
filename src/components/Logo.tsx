// src/components/Logo.tsx - CÓDIGO COMPLETO E ATUALIZADO

import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  variant?: "default" | "inverse"; // Nossa nova prop de variante
}

export default function Logo({ variant = "default" }: LogoProps) {
  return (
    <Link href="/" aria-label="Synapse Homepage">
      {variant === "inverse" ? (
        // Variante 'inverse': Mostra apenas a logo clara, sempre.
        <Image
          src="/Logo-dark.svg"
          alt="Synapse Logo"
          width={120}
          height={28}
          priority
        />
      ) : (
        // Variante 'default': A logo inteligente que troca com o tema
        <>
          <Image
            src="/Logo-light.svg"
            alt="Synapse Logo"
            width={120}
            height={28}
            className="dark:hidden"
            priority
          />
          <Image
            src="/Logo-dark.svg"
            alt="Synapse Logo"
            width={120}
            height={28}
            className="hidden dark:block"
            priority
          />
        </>
      )}
    </Link>
  );
}
