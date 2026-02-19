import React, { useState, useEffect, useRef } from "react";
import { Grip, X, ArrowUp, Info, XCircle } from "lucide-react";
import { getSpinsAnalytics } from "@/services/api";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ChartData {
  position: number;
  song: string;
  artist: string;
  spins: number;
  lastWeek: number | null;
  peak: number;
  weeks: number;
  growth: number;
  status: "NEW" | "HOT" | "BREAKING" | "";
  location: string;
  dj: string;
}

interface SortConfig {
  column: keyof ChartData | null;
  direction: "asc" | "desc";
}

type VideoLanguage = "english" | "pidgin";

const SpinsTableComponent: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [helpOpen, setHelpOpen] = useState<boolean>(false);
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: null,
    direction: "asc",
  });
  const [tableData, setTableData] = useState<ChartData[]>([]);
  const [videoLang, setVideoLang] = useState<VideoLanguage>("english");
  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (dateInputRef.current) {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 7);

      flatpickr(dateInputRef.current, {
        mode: "range",
        dateFormat: "M d, Y",
        defaultDate: [start, end], // Set default dates
        onChange: (selectedDates) => {
          if (selectedDates.length === 2) {
            setStartDate(selectedDates[0]);
            setEndDate(selectedDates[1]);
          }
        },
        onClose: (selectedDates) => {
          if (selectedDates.length === 2) {
            setDateRange(formatDateRange());
          }
        },
      });
    }
  }, []);

  const formatDateRange = (): string => {
    if (!startDate || !endDate) return dateRange;

    const fmt = (d: Date): string =>
      d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

    return `${fmt(startDate)} - ${fmt(endDate)}`;
  };

  // Function to map API data to ChartData format
  const mapApiDataToChartData = (apiData: any[]): ChartData[] => {
    return apiData.map((item, index) => {
      // Parse song and artist from title
      const titleParts = item.title.split(" by ");
      const song = titleParts[0] || item.title;
      const artist = titleParts[1] || item.artist || "";

      return {
        position: index + 1,
        song: song.trim(),
        artist: artist.trim(),
        spins: item.spin_count || 0,
        lastWeek: item.lw || 0,
        peak: 0,
        weeks: item.woc || 0,
        growth: item.growth_percentage,
        status: item.status || "",
        location: item.top_locations?.[0]?.location || "",
        dj: item.top_djs?.[0]?.dj_name || "",
      };
    });
  };

  const formatDateForAPI = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const startDateStr = startDate ? formatDateForAPI(startDate) : undefined;
    const endDateStr = endDate ? formatDateForAPI(endDate) : undefined;

    getSpinsAnalytics(startDateStr, endDateStr)
      .then((fetchedContent: any) => {
        console.log("ANALYTICS", fetchedContent?.audio_spins);
        if (
          fetchedContent?.audio_spins &&
          Array.isArray(fetchedContent.audio_spins)
        ) {
          const mappedData = mapApiDataToChartData(fetchedContent.audio_spins);
          setTableData(mappedData);
        }
      })
      .catch((err) => {
        console.error("Error fetching analytics data:", err);
      });
  }, [startDate, endDate]);
  // Initial sample data
  const initialData: ChartData[] = [
    {
      position: 1,
      song: "MOVE (EDIT)",
      artist: "DJ ZED",
      spins: 1112,
      lastWeek: null,
      peak: 1,
      weeks: 1,
      growth: 10,
      status: "NEW",
      location: "LAGOS",
      dj: "DJ SPINALL",
    },
    {
      position: 2,
      song: "ENERGY",
      artist: "AMAARA",
      spins: 1615,
      lastWeek: null,
      peak: 2,
      weeks: 1,
      growth: 10,
      status: "NEW",
      location: "LONDON",
      dj: "DJ EZ",
    },
    {
      position: 3,
      song: "MIDNIGHT GROOVE",
      artist: "KAYBEE",
      spins: 5201,
      lastWeek: null,
      peak: 3,
      weeks: 1,
      growth: 10,
      status: "HOT",
      location: "ACCRA",
      dj: "DJ JULS",
    },
    {
      position: 4,
      song: "RHYTHM CTRL",
      artist: "ZINO FLEX",
      spins: 2900,
      lastWeek: null,
      peak: 4,
      weeks: 1,
      growth: 10,
      status: "NEW",
      location: "IBIZA",
      dj: "BLACK COFFEE",
    },
    {
      position: 5,
      song: "NO SIGNAL",
      artist: "AYO BLU",
      spins: 4100,
      lastWeek: null,
      peak: 5,
      weeks: 1,
      growth: 10,
      status: "HOT",
      location: "LAGOS",
      dj: "DJ CONSEQUENCE",
    },
    {
      position: 6,
      song: "ALL NIGHT LONG",
      artist: "MAYA SOUL",
      spins: 5400,
      lastWeek: null,
      peak: 6,
      weeks: 1,
      growth: 10,
      status: "HOT",
      location: "JOHANNESBURG",
      dj: "DJ MAPORISA",
    },
    {
      position: 7,
      song: "STEADY MOTION",
      artist: "TREVOR J",
      spins: 1800,
      lastWeek: null,
      peak: 7,
      weeks: 1,
      growth: 10,
      status: "NEW",
      location: "BERLIN",
      dj: "DJ TEN WALLS",
    },
    {
      position: 8,
      song: "LAST CALL",
      artist: "NOVA GREY",
      spins: 740,
      lastWeek: null,
      peak: 8,
      weeks: 1,
      growth: 10,
      status: "NEW",
      location: "PARIS",
      dj: "DJ DEEP",
    },
  ];

  useEffect(() => {
    // Only set initial data as fallback if no data has been loaded yet
    if (tableData.length === 0) {
      setTableData(initialData);
    }

    const handleScroll = (): void => {
      setShowBackToTop(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSort = (column: keyof ChartData): void => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.column === column && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sorted = [...tableData].sort((a, b) => {
      const aVal = a[column];
      const bVal = b[column];

      if (typeof aVal === "number" && typeof bVal === "number") {
        return direction === "asc" ? aVal - bVal : bVal - aVal;
      }

      return direction === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

    setTableData(sorted);
    setSortConfig({ column, direction });
  };

  const getMovementPill = (growth: number): JSX.Element => {
    if (!growth) {
      return (
        <span className="px-3 py-1.5 rounded-full text-xs font-black bg-gray-100 text-gray-600">
          •
        </span>
      );
    }

    const delta = growth;

    if (delta > 0) {
      return (
        <span className="px-3 py-1.5 rounded-full text-xs font-black bg-green-100 text-green-600">
          ▲{delta}%
        </span>
      );
    } else if (delta < 0) {
      return (
        <span className="px-3 py-1.5 rounded-full text-xs font-black bg-red-100 text-red-600">
          ▼{Math.abs(delta)}%
        </span>
      );
    }

    return (
      <span className="px-3 py-1.5 rounded-full text-xs font-black bg-gray-100 text-gray-600">
        —
      </span>
    );
  };

  const getStatusPill = (status: string): JSX.Element => {
    const styles: Record<string, string> = {
      NEW: "bg-sky-500 text-white",
      HOT: "bg-orange-500 text-white",
      BREAKING: "bg-gray-900 text-white",
      "": "bg-gray-100 text-gray-600",
    };

    return (
      <span
        className={`px-3 py-1.5 rounded-full text-xs font-black ${styles[status] || styles[""]}`}
      >
        {status || "—"}
      </span>
    );
  };

  const getSpinIntensity = (spins: number): string => {
    const maxSpins = Math.max(...tableData.map((d) => d.spins));
    const intensity = Math.max(0.08, spins / maxSpins);
    return `rgba(230, 90, 40, ${0.08 + intensity * 0.22})`;
  };

  const exportToCSV = (): void => {
    const headers = [
      "POSITION",
      "SONG",
      "ARTIST",
      "SPINS",
      "LW",
      "PEAK",
      "WOC",
      "GROWTH",
      "STATUS",
      "TOP LOCATION",
      "TOP DJ",
    ];
    const rows = tableData.map((row) => [
      row.position,
      row.song,
      row.artist,
      row.spins,
      row.lastWeek || "—",
      row.peak,
      row.weeks,
      row.growth,
      row.status,
      row.location,
      row.dj,
    ]);

    const csvContent = [
      [dateRange],
      headers,
      ...rows,
      [
        "",
        "Generated by Arroweye® Pro Tools. Explore Afrobeats DJ spins worldwide on https://spins.arroweye.pro/",
      ],
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "ae-spins.csv";
    link.click();
    setExportModalOpen(false);
  };

  const exportToPDF = (): void => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Arroweye® Pro Tools - DJ Spins Analytics", 14, 20);

    // Add date range
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(dateRange, 14, 28);

    // Prepare table data
    const headers = [
      [
        "POS",
        "SONG",
        "ARTIST",
        "SPINS",
        "LW",
        "PEAK",
        "WOC",
        "GROWTH",
        "STATUS",
        "LOCATION",
        "DJ",
      ],
    ];

    const rows = tableData.map((row) => [
      row.position,
      row.song,
      row.artist,
      row.spins,
      row.lastWeek || "—",
      row.peak,
      row.weeks,
      row.growth,
      row.status,
      row.location,
      row.dj,
    ]);

    // Generate table
    autoTable(doc, {
      head: headers,
      body: rows,
      startY: 35,
      styles: {
        fontSize: 7,
        cellPadding: 1.5,
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [59, 130, 246],
        fontStyle: "bold",
        halign: "center",
        fontSize: 7,
      },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" }, // POS
        1: { cellWidth: 25 }, // SONG
        2: { cellWidth: 22 }, // ARTIST
        3: { cellWidth: 12, halign: "center" }, // SPINS
        4: { cellWidth: 8, halign: "center" }, // LW
        5: { cellWidth: 10, halign: "center" }, // PEAK
        6: { cellWidth: 8, halign: "center" }, // WOC
        7: { cellWidth: 13, halign: "center" }, // GROWTH
        8: { cellWidth: 13 }, // STATUS
        9: { cellWidth: 13 }, // GENRE
        10: { cellWidth: 18 }, // LOCATION
        11: { cellWidth: 18 }, // DJ
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
      margin: { top: 35, left: 14, right: 14 },
    });

    // Add footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    const pageHeight = doc.internal.pageSize.height;

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.text(
        "Generated by Arroweye® Pro Tools. Explore Afrobeats DJ spins worldwide on https://spins.arroweye.pro/",
        14,
        pageHeight - 10,
        { maxWidth: 180 },
      );
    }

    doc.save("ae-spins.pdf");
    setExportModalOpen(false);
  };

  const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  interface MenuItem {
    name: string;
    img: string;
    url: string;
  }

  const menuItems: MenuItem[] = [
    {
      name: "Studio",
      img: "https://res.cloudinary.com/dyueswnzk/image/upload/v1758701294/qkpawzztfn7c6osevfmm_sripez.svg",
      url: "https://studio.arroweye.pro/",
    },
    {
      name: "Recipes",
      img: "https://res.cloudinary.com/dyueswnzk/image/upload/v1758701298/asasas_xtjuvt_vvmlne.svg",
      url: "https://pinegingr.com/services",
    },
    {
      name: "Showtime",
      img: "https://res.cloudinary.com/dyueswnzk/image/upload/v1758701304/sds_nzwm72_m4pzcw.svg",
      url: "https://studio.arroweye.pro/",
    },
    {
      name: "Drops",
      img: "https://res.cloudinary.com/dyueswnzk/image/upload/v1758701297/qkpawzztfn7c6osevfmm_1_14_dnwz5r_cduoei.svg",
      url: "https://studio.arroweye.pro/",
    },
    {
      name: "Spots",
      img: "https://res.cloudinary.com/dyueswnzk/image/upload/v1758701294/21_elj38n_jljfio.svg",
      url: "https://spots.arroweye.pro/",
    },
    {
      name: "AI Tools",
      img: "https://res.cloudinary.com/dyueswnzk/image/upload/v1758701302/sds_3_tsxk8m_ftgc0v.svg",
      url: "https://cocoa.house/tools",
    },
  ];

  const tableHeaders: { label: string; key: keyof ChartData }[] = [
    { label: "POSITION", key: "position" },
    { label: "SONG", key: "song" },
    { label: "SPINS", key: "spins" },
    { label: "LW", key: "lastWeek" },
    { label: "PEAK", key: "peak" },
    { label: "WOC", key: "weeks" },
    { label: "GROWTH(%)", key: "growth" },
    { label: "STATUS", key: "status" },
    { label: "TOP LOCATION", key: "location" },
    { label: "TOP DJ", key: "dj" },
  ];

  return (
    <div
      className="min-h-screen bg-white font-sans"
      style={{ fontFamily: "IBM Plex Sans" }}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-4">
          <img
            src="https://res.cloudinary.com/dyueswnzk/image/upload/v1758701301/qkpawzztfn7c6osevfmm_1_4_x8h1iz_i2uebl.svg"
            alt="Logo"
            className="w-12 h-12"
          />
        </div>

        <input
          ref={dateInputRef}
          type="text"
          placeholder="Select date range"
          className="w-60 text-center px-4 py-3 border rounded-[1rem] text-sm max-w-xs outline-none focus:border-blue-500 cursor-pointer"
          readOnly
        />

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-gray-600 hover:text-black transition-colors"
        >
          {menuOpen ? <X size={24} /> : <Grip size={24} />}
        </button>
      </div>

      {/* Menu Grid */}
      {menuOpen && (
        <div className="absolute right-4 top-16 bg-white border rounded-[1rem] shadow-lg p-6 z-50">
          <div className="grid grid-cols-3 gap-12 mb-6">
            {menuItems.map((item: MenuItem) => (
              <div
                key={item.name}
                className="text-center cursor-pointer hover:opacity-70 transition-opacity"
                onClick={() => window.open(item.url, "_blank")}
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-12 h-12 mx-auto mb-2"
                />
                <span className="text-sm text-gray-600 font-semibold">
                  {item.name}
                </span>
              </div>
            ))}
          </div>

          {/* Ad Section */}
          <div className="flex items-center border rounded-lg p-5 bg-white mt-10">
            <img
              src="https://res.cloudinary.com/dyueswnzk/image/upload/v1758701617/r3o4deralgc2jl1y1xag_ynrxbj.webp"
              alt="Ad"
              className="w-16 h-[120px] rounded mr-5"
            />
            <div className="flex-1">
              <div className="text-[10px] font-semibold text-gray-400 mb-2">
                ADS BY <span className="underline">VIVO</span>
              </div>
              <div className="text-sm mb-3 max-w-[200px]">
                Stay in tune with the continent that makes the world dance
              </div>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 bg-black text-white text-sm rounded"
                  onClick={() =>
                    window.open("https://butta.cocoa.house/", "_blank")
                  }
                >
                  Subscribe
                </button>
                <button
                  className="px-3 py-1 border border-black text-sm rounded"
                  onClick={() =>
                    window.open(
                      "https://open.spotify.com/playlist/3CVugIVKRAsTMQn0JeaP65?si=q_g3HBORS7GFNUdIC1BMDA&pi=qbbp4pmmSOCgF&nd=1&dlsi=d383ce1fced64d36",
                      "_blank",
                    )
                  }
                >
                  Listen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="p-6 overflow-x-auto">
        <table ref={tableRef} className="mt-5 w-full border-collapse border">
          <thead>
            <tr className="bg-gray-50">
              {tableHeaders.map((header, index) => (
                <th
                  key={header.label}
                  onClick={() => handleSort(header.key)}
                  onMouseEnter={() => setHoveredColumn(index)}
                  onMouseLeave={() => setHoveredColumn(null)}
                  className={`px-8 py-6 text-xs font-bold text-center border-b cursor-pointer hover:text-orange-600 transition-colors uppercase relative ${hoveredColumn === index && "border border-orange-600 border-b-0"}`}
                >
                  {hoveredColumn === index && (
                    <div className="z-50 mt-2 w-full absolute -top-8 left-1/2 transform -translate-x-1/2 bg-orange-600 text-white py-1 rounded-t text-xs font-bold whitespace-nowrap">
                      SORTING BY
                    </div>
                  )}
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row: ChartData, idx: number) => (
              <tr
                key={idx}
                className={`border-b ${idx < 5 ? "shadow-sm" : ""}`}
              >
                <td
                  className={`px-6 py-6 text-center text-sm transition-all ${
                    hoveredColumn === 0
                      ? "bg-orange-50 border-l border-r border-orange-600"
                      : ""
                  } ${idx === 0 && hoveredColumn === 0 ? "border-t-0" : ""} ${idx === tableData.length - 1 && hoveredColumn === 0 ? "border-b-2 border-orange-600" : ""}`}
                >
                  {row.position}
                </td>
                <td
                  className={`px-6 py-6 text-center text-sm transition-all ${
                    hoveredColumn === 1
                      ? "bg-orange-50 border-l border-r border-orange-600"
                      : ""
                  } ${idx === 0 && hoveredColumn === 1 ? "border-t-0" : ""} ${idx === tableData.length - 1 && hoveredColumn === 1 ? "border-b-2 border-orange-600" : ""}`}
                >
                  <div className="font-bold">{row.song.toUpperCase()}</div>
                  <div className="text-gray-500 text-xs mt-1">
                    {row.artist.toUpperCase()}
                  </div>
                </td>
                <td
                  className={`px-6 py-6 text-center text-sm transition-all ${
                    hoveredColumn === 2
                      ? "bg-orange-50 border-l border-r border-orange-600"
                      : ""
                  } ${idx === 0 && hoveredColumn === 2 ? "border-t-0" : ""} ${idx === tableData.length - 1 && hoveredColumn === 2 ? "border-b-2 border-orange-600" : ""}`}
                  style={{
                    background:
                      hoveredColumn === 2
                        ? "rgb(255 247 237)"
                        : getSpinIntensity(row.spins),
                  }}
                >
                  {row.spins}
                </td>
                <td
                  className={`px-6 py-6 text-center text-sm transition-all ${
                    hoveredColumn === 3
                      ? "bg-orange-50 border-l border-r border-orange-600"
                      : ""
                  } ${idx === 0 && hoveredColumn === 3 ? "border-t-0" : ""} ${idx === tableData.length - 1 && hoveredColumn === 3 ? "border-b-2 border-orange-600" : ""}`}
                >
                  {row.lastWeek || "—"}
                </td>
                <td
                  className={`px-6 py-6 text-center text-sm transition-all ${
                    hoveredColumn === 4
                      ? "bg-orange-50 border-l border-r border-orange-600"
                      : ""
                  } ${idx === 0 && hoveredColumn === 4 ? "border-t-0" : ""} ${idx === tableData.length - 1 && hoveredColumn === 4 ? "border-b-2 border-orange-600" : ""}`}
                >
                  {row.peak || "—"}
                </td>
                <td
                  className={`px-6 py-6 text-center text-sm transition-all ${
                    hoveredColumn === 5
                      ? "bg-orange-50 border-l border-r border-orange-600"
                      : ""
                  } ${idx === 0 && hoveredColumn === 5 ? "border-t-0" : ""} ${idx === tableData.length - 1 && hoveredColumn === 5 ? "border-b-2 border-orange-600" : ""}`}
                >
                  {row.weeks || "—"}
                </td>
                <td
                  className={`px-6 py-6 text-center text-sm transition-all ${
                    hoveredColumn === 6
                      ? "bg-orange-50 border-l border-r border-orange-600"
                      : ""
                  } ${idx === 0 && hoveredColumn === 6 ? "border-t-0" : ""} ${idx === tableData.length - 1 && hoveredColumn === 6 ? "border-b-2 border-orange-600" : ""}`}
                >
                  {getMovementPill(row.growth)}
                </td>
                <td
                  className={`px-6 py-6 text-center text-sm transition-all ${
                    hoveredColumn === 7
                      ? "bg-orange-50 border-l border-r border-orange-600"
                      : ""
                  } ${idx === 0 && hoveredColumn === 7 ? "border-t-0" : ""} ${idx === tableData.length - 1 && hoveredColumn === 7 ? "border-b-2 border-orange-600" : ""}`}
                >
                  {getStatusPill(row.status)}
                </td>
                <td
                  className={`px-6 py-6 text-center text-sm transition-all ${
                    hoveredColumn === 8
                      ? "bg-orange-50 border-l border-r border-orange-600"
                      : ""
                  } ${idx === 0 && hoveredColumn === 8 ? "border-t-0" : ""} ${idx === tableData.length - 1 && hoveredColumn === 8 ? "border-b-2 border-orange-600" : ""}`}
                >
                  <a href="#" className="hover:underline">
                    {row.location.toUpperCase() || "—"}
                  </a>
                </td>
                <td
                  className={`px-6 py-6 text-center text-sm transition-all ${
                    hoveredColumn === 9
                      ? "bg-orange-50 border-l border-r border-orange-600"
                      : ""
                  } ${idx === 0 && hoveredColumn === 9 ? "border-t-0" : ""} ${idx === tableData.length - 1 && hoveredColumn === 9 ? "border-b-2 border-orange-600" : ""}`}
                >
                  <a href="#" className="hover:underline">
                    {row.dj.toUpperCase() || "—"}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Export Button */}
      <button
        onClick={() => setExportModalOpen(true)}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-blue-700 transition-colors"
      >
        Export
      </button>

      {/* Export Modal */}
      {exportModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
            onClick={() => setExportModalOpen(false)}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-8 z-50 w-[550px]">
            <button
              onClick={() => setExportModalOpen(false)}
              className="float-right text-gray-600 hover:text-black"
            >
              <XCircle size={24} />
            </button>
            <p className="text-center text-lg mt-14 mb-8">
              Select your preferred format
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={exportToCSV}
                className="w-48 h-48 border rounded-lg hover:border-blue-500 hover:text-blue-500 transition-colors font-semibold"
              >
                CSV
              </button>
              <button
                onClick={exportToPDF}
                className="w-48 h-48 border rounded-lg hover:border-blue-500 hover:text-blue-500 transition-colors font-semibold"
              >
                PDF
              </button>
            </div>
          </div>
        </>
      )}

      {showBackToTop && (
        <button
          onClick={() => setHelpOpen(true)}
          className="fixed bottom-8 left-5 w-12 h-12 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-colors flex items-center justify-center"
        >
          <Info size={20} />
        </button>
      )}

      {/* Help Modal */}
      {helpOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 flex items-center justify-center"
            onClick={() => setHelpOpen(false)}
          >
            <div
              className="bg-white rounded-lg p-10 w-3/5 max-h-[520px] overflow-y-auto"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <button
                onClick={() => setHelpOpen(false)}
                className="float-right text-gray-600 hover:text-black"
              >
                <XCircle size={24} />
              </button>

              <h3 className="text-2xl font-bold border-b pb-4 mt-6">
                Data Guide
              </h3>

              <div className="mt-6 space-y-4 leading-relaxed">
                <div>
                  <strong>Spins</strong>
                  <p className="mt-2 opacity-90">
                    The total number of verified plays a song receives from
                    tracked DJs during the selected chart period. Spins are
                    aggregated across{" "}
                    <a
                      target="new"
                      className="underline"
                      href="https://arroweye.pro/product/spins"
                    >
                      Arroweye® Pro Spins
                    </a>{" "}
                    and all monitored sources, forming the primary basis for
                    chart rankings.
                  </p>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setVideoLang("english")}
                    className={`px-4 py-2 rounded-xl font-bold ${videoLang === "english" ? "bg-black text-white" : "bg-white border"}`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setVideoLang("pidgin")}
                    className={`px-4 py-2 rounded-xl font-bold ${videoLang === "pidgin" ? "bg-black text-white" : "bg-white border"}`}
                  >
                    Pidgin
                  </button>
                </div>

                <div className="border rounded-2xl overflow-hidden mt-4">
                  <div className="aspect-video bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">
                      Video Player ({videoLang})
                    </span>
                  </div>
                </div>

                <div>
                  <strong>Ranking</strong>
                  <p className="mt-2 mb-5 opacity-90">
                    Charts reflect activity within a weekly reporting period
                    unless otherwise specified. Rankings are determined using a
                    combination of total spins, week-over-week movement, and
                    sustained chart presence, rather than spins alone.
                    Interactive sorting allows alternate views of the data but
                    does not affect official chart positions.
                  </p>
                  <strong>LW (Last Week)</strong>
                  <p className="mt-2 mb-5 opacity-90">
                    Indicates the song's position on the previous chart. A dash
                    (—) means the track did not appear on the chart during the
                    prior period.
                  </p>
                  <strong>WOC (Weeks on Chart)</strong>
                  <p className="mt-2 mb-5 opacity-90">
                    The total number of weeks a song has appeared on the chart,
                    including the current week. This metric reflects longevity
                    and sustained audience or DJ support.
                  </p>
                  <strong>Growth</strong>
                  <p className="mt-2 opacity-90">
                    Shows the change in chart position compared to the previous
                    period.
                  </p>
                  <div className="mt-3 p-3 border rounded-xl flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 rounded-full text-xs font-black bg-green-100 text-green-600">
                        ▲7
                      </span>
                      <span className="opacity-85">Up</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 rounded-full text-xs font-black bg-gray-100 text-gray-600">
                        —
                      </span>
                      <span className="opacity-85">No change</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 rounded-full text-xs font-black bg-red-100 text-red-600">
                        ▼3
                      </span>
                      <span className="opacity-85">Down</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 rounded-full text-xs font-black bg-gray-100 text-gray-600">
                        •
                      </span>
                      <span className="opacity-85">New entry</span>
                    </div>
                  </div>
                </div>

                <div>
                  <strong>Status</strong>
                  <p className="mt-2 opacity-90">
                    Editorial indicators that highlight notable chart activity.
                  </p>
                  <div className="mt-3 p-3 border rounded-xl flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 rounded-full text-xs font-black bg-sky-500 text-white">
                        NEW
                      </span>
                      <span className="opacity-85">First appearance</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 rounded-full text-xs font-black bg-gray-900 text-white">
                        BREAKING
                      </span>
                      <span className="opacity-85">Big jump / Top 5 entry</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 rounded-full text-xs font-black bg-orange-500 text-white">
                        HOT
                      </span>
                      <span className="opacity-85">High spins / momentum</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 rounded-full text-xs font-black">
                        -
                      </span>
                      <span className="opacity-85">Stable</span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-xl p-3">
                  <strong>Example Scenarios</strong>
                  <div className="mt-4 flex gap-2">
                    <div className="w-14 flex justify-center px-3 py-1.5 rounded-full text-xs font-black bg-gray-100 text-gray-600">
                      •
                    </div>
                    <span className="px-3 py-1.5 rounded-full text-xs font-black bg-sky-500 text-white">
                      NEW
                    </span>
                    <p>Debut entry on the chart</p>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <div className="w-14 flex justify-center px-3 py-1.5 rounded-full text-xs font-black bg-green-100 text-green-600">
                      ▲6
                    </div>{" "}
                    <span className="px-3 py-1.5 rounded-full text-xs font-black bg-gray-900 text-white">
                      BREAKING
                    </span>
                    <p>Fast riser / major jump</p>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <div className="w-14 flex justify-center px-3 py-1.5 rounded-full text-xs font-black bg-green-100 text-green-600">
                      ▲2
                    </div>
                    <span className="px-3 py-1.5 rounded-full text-xs font-black bg-orange-500 text-white">
                      HOT
                    </span>
                    <p>Strong momentum & spins</p>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <div className="w-14 flex justify-center px-3 py-1.5 rounded-full text-xs font-black bg-red-100 text-red-600">
                      ▼4
                    </div>{" "}
                    <span className="px-3 py-1.5 rounded-full text-xs font-black">
                      -
                    </span>
                    <p>Decline without breakout activity</p>
                  </div>
                </div>
                <div>
                  {" "}
                  <strong>Top Location</strong>
                  <p className="mt-2 mb-4 opacity-90">
                    The city or market where the song recorded its highest
                    concentration of verified spins during the chart period.
                  </p>
                  <strong>Top DJ</strong>
                  <p className="mt-2 opacity-90">
                    The DJ or broadcaster who played the song most frequently
                    within the selected period, based on tracked and verified
                    data sources.
                  </p>
                </div>
              </div>

              <div className="mt-8 border-t pt-6">
                <p className="font-bold text-lg">Need Assistance?</p>
                <p className="mt-4 opacity-90 leading-relaxed">
                  Drop us a message at{" "}
                  <a href="mailto:hi@arroweye.pro" className="underline">
                    hi@arroweye.pro
                  </a>
                  . We are always working to make this tool better for you.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-orange-600 text-white rounded-full shadow-lg hover:bg-black transition-colors flex items-center justify-center"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
};

export default SpinsTableComponent;
