import ProductGrid from "@/components/ProductGrid";

export default function CatalogPage() {
    return (
        <main className="max-w-7xl mx-auto py-16 px-6">

            <h1 className="text-5xl font-bold mb-10">

                Каталог

            </h1>

            <ProductGrid/>

        </main>
    );
}