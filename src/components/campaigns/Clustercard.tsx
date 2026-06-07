export interface ClusterCardProps {
  city: string;
  country: string;
  count: string;
  districts: { id: number; name: string }[];
  activeDistricts?: Set<number>; // ← was activeDistrict?: number
  onDistrictClick?: (id: number, name: string) => void;
}

export const ClusterCard: React.FC<ClusterCardProps> = ({
  city,
  country,
  count,
  districts,
  activeDistricts,
  onDistrictClick,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-5 py-8 flex flex-col gap-3 h-full hover:shadow-md hover:border-gray-300 transition-all duration-200">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-bold text-gray-900 text-base">
          {city}, {country}
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-600 border border-red-300">
          {count}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {districts.map((district) => (
          <button
            key={district.id}
            type="button"
            onClick={() => onDistrictClick?.(district.id, district.name)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 cursor-pointer ${
              activeDistricts?.has(district.id)
                ? "bg-blue-600 border-blue-600 text-white"
                : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300"
            }`}
          >
            {district.name}
          </button>
        ))}
      </div>
    </div>
  );
};