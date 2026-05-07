type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({
  value,
  onChange,
}: Props) {
  return (
    <div className="absolute top-4 left-4 right-4 z-10">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 px-4 py-3">

        <input
          type="text"
          placeholder="Cari dispenser..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full outline-none text-sm text-black placeholder:text-gray-400"
        />

      </div>
    </div>
  );
}