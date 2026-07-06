"use client";

export default function AddToCart({
    optionId,
}: {
    optionId: number;
}) {

    async function add() {

        await fetch("http://localhost:5000/api/cart", {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({

                optionId,

                quantity: 1,

            }),

        });

        alert("Товар добавлен в корзину");

    }

    return (

        <button
            onClick={add}
            className="mt-10 w-full bg-blue-600 text-white rounded-full py-4 hover:bg-blue-700 transition"
        >

            Добавить в корзину

        </button>

    );

}