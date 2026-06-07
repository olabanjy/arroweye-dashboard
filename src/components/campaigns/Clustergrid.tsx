import React, { useRef, useState, useCallback, useEffect } from "react";
import { ClusterCard, ClusterCardProps } from "./Clustercard";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface ClusterGridProps {
  clusters: ClusterCardProps[];
  onDistrictClick?: (
    clusterIndex: number,
    districtId: number,
    districtName: string,
  ) => void;
  activeDistricts?: Set<number>;
  titleStyle?: string;
}

function getColCount(containerWidth: number): number {
  if (containerWidth < 640) return 1;
  if (containerWidth < 1024) return 2;
  return 3;
}

function buildPages<T>(items: T[], cols: number): T[][] {
  const pageSize = cols * 2;
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += pageSize) {
    pages.push(items.slice(i, i + pageSize));
  }
  return pages;
}

export const ClusterGrid: React.FC<ClusterGridProps> = ({
  clusters,
  onDistrictClick,
  activeDistricts,
  titleStyle,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(3);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const ro = new ResizeObserver(([entry]) => {
      setCols(getColCount(entry.contentRect.width));
    });

    ro.observe(el);
    setCols(getColCount(el.clientWidth));
    return () => ro.disconnect();
  }, []);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateScrollState, { passive: true });
    return () => el.removeEventListener("scroll", updateScrollState);
  }, [updateScrollState]);

  const scrollByPage = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollBy({
      left: direction === "right" ? el.clientWidth : -el.clientWidth,
      behavior: "smooth",
    });
  };

  // const handleDistrictClick = (
  //   clusterIndex: number,
  //   districtId: number,
  //   districtName: string,
  // ) => {
  //   setActiveDistrict({ clusterIndex, districtId });

  //   onDistrictClick?.(clusterIndex, districtId, districtName);
  // };

  const pages = buildPages(clusters, cols);

  return (
    <div ref={wrapperRef} className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between">
        <h2 className={`text-xl font-bold text-gray-900 ${titleStyle}`}>
          Clusters
        </h2>
        <div className="flex gap-1">
          <button onClick={() => scrollByPage("left")}><ChevronLeft className={titleStyle}/></button>
          <button onClick={() => scrollByPage("right")}><ChevronRight className={titleStyle}/></button>
        </div>
      </div>

      <div ref={scrollRef} className="flex overflow-x-auto gap-0">
        {pages.map((pageItems, pageIndex) => (
          <div key={pageIndex} className="shrink-0 w-full">
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
            >
              {pageItems.map((cluster: any, localIndex) => {
                const globalIndex = pageIndex * cols * 2 + localIndex;
                return (
                  <ClusterCard
                    key={globalIndex}
                    {...cluster}
                    activeDistricts={activeDistricts} // ← pass the full Set
                    onDistrictClick={(id, name) =>
                      onDistrictClick?.(globalIndex, id, name)
                    }
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
