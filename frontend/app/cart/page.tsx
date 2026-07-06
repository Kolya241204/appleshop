"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CartPage() {
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Загрузка корзины при открытии страницы
    useEffect(() => {
        const fetchCart = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setLoading(false);
                return;
            }

            const res = await fetch("http://localhost:5000/api/cart", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setCartItems(data);
            }
            setLoading(false);
        };
        fetchCart();
    }, []);

    // Подсчет общей суммы
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Функция оформления заказа
    const handleCheckout = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/orders/checkout", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
            alert("Заказ успешно оформлен! Спасибо за покупку.");
            setCartItems([]); // Очищаем корзину на фронтенде
        } else {
            const error = await res.json();
            alert(`Ошибка: ${error.message}`);
        }
    };

    if (loading) return <div className="text-center mt-20">Загрузка...</div>;

    return (
        <main className="max-w-4xl mx-auto py-16 px-6">
            <h1 className="text-5xl font-bold mb-10">Ваша корзина</h1>

            {cartItems.length === 0 ? (
                <div className="text-xl text-gray-500">
                    Корзина пуста. <Link href="/catalog" className="text-blue-600 underline">Перейти в каталог</Link>
                </div>
            ) : (
                <div className="flex flex-col gap-8">
                    {/* Список товаров */}
                    <div className="space-y-6">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex items-center justify-between border-b pb-6">
                                <div className="flex items-center gap-6">
                                    <img src={item.image || "/placeholder.png"} alt={item.product_name} className="w-24 h-24 object-contain" />
                                    <div>
                                        <h2 className="text-2xl font-semibold">{item.product_name}</h2>
                                        <p className="text-gray-500">{item.option_name}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-medium">{item.price.toLocaleString()} ₽</p>
                                    <p className="text-gray-500">Кол-во: {item.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Итого и кнопка */}
                    <div className="bg-gray-50 p-8 rounded-3xl flex justify-between items-center mt-6">
                        <div>
                            <p className="text-gray-500 text-lg">Итого к оплате:</p>
                            <p className="text-4xl font-bold">{totalPrice.toLocaleString()} ₽</p>
                        </div>
                        <button 
                            onClick={handleCheckout}
                            className="bg-blue-600 text-white text-xl px-10 py-5 rounded-full hover:bg-blue-700 transition shadow-lg"
                        >
                            Оформить заказ
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}