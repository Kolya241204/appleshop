import Link from "next/link";

type Props = {
    id: number;
    name: string;
    price: number;
    image: string;
};

export default function ProductCard({
    id,
    name,
    price,
    image,
}: Props) {
    return (
        <Link href={`/product/${id}`}>

            <div className="rounded-3xl border p-5 hover:shadow-xl transition">

                <img
                    src={image}
                    alt={name}
                    className="h-72 w-full object-contain"
                />

                <h2 className="text-xl font-semibold mt-5">

                    {name}

                </h2>

                <p className="text-blue-600 mt-3">

                    от {price.toLocaleString()} ₽

                </p>

            </div>

        </Link>
    );
}