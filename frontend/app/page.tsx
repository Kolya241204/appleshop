export default function LoginPage(){

return(

<main className="max-w-md mx-auto py-32">

<h1 className="text-5xl font-bold mb-10">

Вход

</h1>

<form className="space-y-5">

<input
placeholder="Email"
className="border rounded-xl w-full p-4"
/>

<input
type="password"
placeholder="Пароль"
className="border rounded-xl w-full p-4"
/>

<button
className="bg-blue-600 text-white w-full rounded-full py-4">

Войти

</button>

</form>

</main>

);

}