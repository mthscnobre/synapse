import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href="/" aria-label="Synapse Homepage">
      {/* Usando uma única logo (versão clara), que terá bom contraste nos dois modos do header */}
      <Image
        src="/Logo-dark.svg"
        alt="Synapse Logo"
        width={120}
        height={28}
        priority
      />
    </Link>
  );
}
