import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";

export default function Home() {

return(

<>

<Header/>

<Hero/>

<main className="max-w-7xl mx-auto">

<Categories/>

<section className="mt-24">

<h2 className="text-5xl font-bold mb-12">

Популярные товары

</h2>

<ProductGrid/>

</section>

</main>

<Footer/>

</>

);

}