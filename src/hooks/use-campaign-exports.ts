import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "react-toastify";

export function useCampaignExports(content: any) {
  const handleDownloadPDF = () => {
    const downloadToast = toast.loading("Downloading PDF...");
    const input = document.getElementById("pdf-content");

    if (!input) return;

    document.body.style.overflow = "hidden";
    const fullHeight = input.scrollHeight;

    html2canvas(input, {
      scale: 2,
      height: fullHeight,
      windowHeight: fullHeight,
      scrollY: -window.scrollY,
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("landscape");
        const pageWidth = 297;
        const pageHeight = 210;
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * pageWidth) / canvas.width;

        let position = 0;
        while (position < imgHeight) {
          if (position > 0) {
            pdf.addPage();
          }

          pdf.addImage(imgData, "PNG", 0, -position, imgWidth, imgHeight);
          position += pageHeight;
        }

        pdf.save("dashboard.pdf");
        toast.update(downloadToast, {
          render: "PDF Downloaded",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
        toast.update(downloadToast, {
          render: "Failed to download PDF",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      })
      .finally(() => {
        document.body.style.overflow = "";
      });
  };

  const handleExportCSV = () => {
    if (!content || Object.keys(content).length === 0) {
      toast.error("No data available to export");
      return;
    }

    const headers = [
      "Code",
      "Description",
      "Title",
      "Total Audience Growth",
      "Total Investment",
      "Total Revenue Min",
      "Total Revenue Max",
    ];

    const row = [
      content.code ?? "",
      content.description ? content.description.replace(/,/g, ";") : "",
      content.title ? content.title.replace(/,/g, ";") : "",
      content.total_audience_growth?.value ?? 0,
      content.total_investment ?? 0,
      content.total_revenue?.mininum ?? 0,
      content.total_revenue?.maximum ?? 0,
    ].join(",");

    const csvContent = [headers.join(","), row].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", "project_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("CSV exported successfully");
  };

  return {
    handleDownloadPDF,
    handleExportCSV,
  };
}
