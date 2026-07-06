type Props = {
    images: string[];
};

export default function ProductGallery({ images }: Props) {
    return (
        <div className="flex gap-6">

            <div className="flex flex-col gap-4">
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt=""
                        className="w-20 h-20 object-contain border rounded-xl cursor-pointer hover:border-blue-500"
                    />
                ))}
            </div>

            <div className="flex-1 flex justify-center items-center">
                <img
                    src={images[0]}
                    alt=""
                    className="max-h-[650px] object-contain"
                />
            </div>

        </div>
    );
}