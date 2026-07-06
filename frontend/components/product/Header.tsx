import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">

      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">

        <Link href="/" className="text-2xl font-semibold">
           AppleShop
        </Link>

        <nav className="flex gap-8">

          <Link href="/">Главная</Link>

          <Link href="/catalog">Каталог</Link>

          <Link href="/cart">Корзина</Link>

          <Link href="/profile">Профиль</Link>

        </nav>

      </div>

    </header>
  );
}