import Image from "next/image";
import Link from "next/link";

export default function CreateSidebar() {
  return (
    <aside className="flex h-screen w-[72px] shrink-0 flex-col border-r border-[#dedede] bg-white sm:w-[108px]">
      <Link
        href="/campaigns"
        aria-label="Back to campaigns"
        className="flex h-[134px] shrink-0 items-center justify-center border-b border-[#dedede] outline-none transition-opacity duration-150 ease-out hover:opacity-65 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-inset active:opacity-45"
      >
        <Image
          src="/assets/arroreyelogoSm.svg"
          alt="Arroweye"
          width={49}
          height={28}
          priority
          className="h-auto w-[38px] sm:w-[49px]"
        />
      </Link>
    </aside>
  );
}
