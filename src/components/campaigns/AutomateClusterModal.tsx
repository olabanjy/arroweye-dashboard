import Link from "next/link";
import React from "react";
import { ClusterGrid } from "./Clustergrid";
import { Slider } from "@/components/ui/slider";
import { Zap } from "lucide-react";
import { ClusterCardProps } from "./Clustercard";

interface AutomateClusterModalProp {
  clusters: ClusterCardProps[];
  activeDistricts?: Set<number>;
  onDistrictClick: (
    _clusterIndex: number,
    districtId: number,
    districtName: string,
  ) => void;
}

const AutomateClusterModal: React.FC<AutomateClusterModalProp> = ({
  clusters,
  activeDistricts,
  onDistrictClick,
}) => {
  return (
    <div className="fixed inset-0 z-10 lg:z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="flex flex-col justify-center items-center gap-24 p-8 lg:p-24">
        <ClusterGrid
          clusters={clusters}
          activeDistricts={activeDistricts} // ← pass the Set
          onDistrictClick={onDistrictClick}
          titleStyle={"text-white"}
        />

        <div className="w-full flex flex-col gap-10">
          <p className="text-white font-bold lg:text-lg">Max Spins Per DJ</p>
          <Slider
            defaultValue={[75]}
            variant="light"
            max={100}
            step={1}
            className="mx-auto w-full max-w-full"
          />
        </div>

        <div>
          <button
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white font-medium bg-gradient-to-r from-purple-500 to-pink-500"
            // onClick={() => setShowAutomateModal(true)}
          >
            {/* Icon wrapper */}
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white">
              <Zap size={14} className="text-purple-600" />
            </span>
            Automate
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutomateClusterModal;
