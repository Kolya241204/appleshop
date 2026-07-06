type Props = {
    specifications: any[];
};

export default function Specifications({
    specifications,
}: Props) {
    return (
        <div className="mt-12">

            <h2 className="text-3xl font-semibold mb-6">
                Характеристики
            </h2>

            <div className="space-y-4">

                {specifications.map((item) => (

                    <div
                        key={item.id}
                        className="flex justify-between border-b pb-3"
                    >

                        <span className="text-gray-500">
                            {item.name}
                        </span>

                        <span className="font-medium">
                            {item.value}
                        </span>

                    </div>

                ))}

            </div>

        </div>
    );
}