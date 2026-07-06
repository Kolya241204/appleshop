import ProductCard from "./ProductCard";
import { getProducts } from "@/lib/api";

export default async function ProductGrid() {
  const products = await getProducts();

  return (
    <div className="grid grid-cols-4 gap-8 mt-10">
      {products.map((product: any) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          price={0}
          image="/placeholder.png"
        />
      ))}
    </div>
  );
}