const categories=[

"iPhone",

"Mac",

"iPad",

"Watch",

"AirPods"

];

export default function Categories(){

return(

<section className="grid grid-cols-5 gap-6">

{categories.map(item=>(

<div
key={item}
className="rounded-3xl border p-10 hover:shadow-xl transition">

<h2>{item}</h2>

</div>

))}

</section>

);

}