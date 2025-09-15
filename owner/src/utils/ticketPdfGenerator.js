import jsPDF from "jspdf";
import { getCurrentBranding } from "./brandingConfig.js";
import poppinsB64 from "../fonts/poppins.js";
import poppinsBoldBase64 from "../fonts/poppinsBlack.js";
import poppinsHighlightBoldBase64 from "../fonts/poppinsBoldForHighLights.js";

const BRAND_CONFIG = getCurrentBranding();

export const generateTicketPDF = async (booking) => {
  if (!booking) throw new Error("No booking data provided");

  const doc = new jsPDF();
  doc.addFileToVFS("Poppins-Regular.ttf", poppinsB64);
  doc.addFont("Poppins-Regular.ttf", "Poppins", "normal");
  doc.setFont("Poppins-Regular.ttf", "normal");

  doc.addFileToVFS("Poppins-Bold.ttf", poppinsBoldBase64);
  doc.addFont("Poppins-Bold.ttf", "PoppinsBold", "bold");
  doc.setFont("Poppins-Bold.ttf", "bold");

  doc.addFileToVFS("Poppins-Black.ttf", poppinsBoldBase64);
  doc.addFont("Poppins-Black.ttf", "PoppinsBlack", "black");
  doc.setFont("Poppins-Black.ttf", "black");

  doc.addFileToVFS("Poppins-Bold.ttf", poppinsHighlightBoldBase64);
  doc.addFont("Poppins-Black.ttf", "PoppinsBlack", "black");
  doc.setFont("Poppins-Black.ttf", "black");

  let yPos = 20;
  const leftMargin = 20;
  const rightMargin = 190;
  const lineHeight = 5;

  const addWrappedText = (text, x, y, maxWidth, fontSize = 11) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.setFont("Poppins", "normal");
    doc.setFontSize(10);
    doc.text(lines, x, y);
    return lines.length * lineHeight;
  };

  const addSectionHeader = (text, y) => {
    if (y > 260) y = 260;
    doc.setFontSize(12);
    doc.setFont("PoppinsBold", "bold");
    doc.setTextColor(0, 0, 0);
    doc.setFont("PoppinsBold", "bold");
    doc.setFontSize(10);
    doc.text(text, leftMargin, y);
    doc.setFont("PoppinsBold", "bold");
    doc.setTextColor(0, 0, 0);
    return y + lineHeight + 4;
  };

  const addKeyValue = (key, value, y, keyWidth = 65) => {
    if (y > 275) return 275;
    doc.setFont("Poppins", "normal");
    doc.setFontSize(10);
    doc.setTextColor(52, 73, 94);
    doc.text(key, leftMargin, y);
    doc.setFont("Poppins", "normal");
    doc.setTextColor(0, 0, 0);
    const valueX = leftMargin + keyWidth + 4;
    const valueWidth = rightMargin - valueX;
    const valueLines = doc.splitTextToSize(value ?? "", valueWidth);
    doc.setFont("Poppins", "normal");
    doc.setFontSize(10);
    doc.text(valueLines, valueX, y);
    const rowH = Math.max(lineHeight, valueLines.length * lineHeight) + 2;
    return y + rowH;
  };

  const addSeparator = (y) => {
    if (y > 278) return 278;
    doc.setDrawColor(128, 128, 128);
    doc.line(leftMargin, y, rightMargin, y);
    return y + 6;
  };

  const addCompanyLogo = async (x, y, size = 14) => {
    try {
      if (BRAND_CONFIG.logoDataUrl) {
        doc.addImage(BRAND_CONFIG.logoDataUrl, "PNG", x, y, size, size);
        return size;
      }
      const url =
        (typeof window !== "Poppins" ? window.location.origin : "") +
        (BRAND_CONFIG.logoPath || "/logo.png");
      const resp = await fetch(url);
      const blob = await resp.blob();
      const reader = new FileReader();
      const dataUrl = await new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      try {
        doc.addImage(dataUrl, "PNG", x, y, size, size);
      } catch {
        doc.addImage(dataUrl, "JPEG", x, y, size, size);
      }
      return size;
    } catch {
      return 0;
    }
  };

  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, 30, "F");
  // doc.setDrawColor(0, 0, 0);
  doc.rect(0, 0, 210, 30);
  doc.setFontSize(18);
  doc.setFont("PoppinsBold", "bold");
  // await addCompanyLogo(leftMargin, 5, 18);
  doc.setFontSize(18);
  doc.setFont("PoppinsBold", "bold");
  doc.setTextColor(2, 74, 173);
  doc.setFontSize(28);
  doc.setFont("PoppinsBlack", "black");
  doc.text(BRAND_CONFIG.companyName, 105, 14, { align: "center" });
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.setFont("Poppins", "normal");
  doc.text(BRAND_CONFIG.tagline, 105, 22, { align: "center" });

  yPos = 38;

  doc.setFontSize(16);
  doc.setFont("Poppins", "normal");
  doc.setTextColor(0, 0, 0);
  doc.text("E-TICKET", 105, yPos, { align: "center" });
  yPos += 10;
  doc.setDrawColor(0, 0, 0);
  // doc.line(70, yPos, 140, yPos);
  yPos += 6;

  yPos = addSectionHeader("Booking Information", yPos);
  yPos = addKeyValue("Booking ID:", booking.bookingReference || "N/A", yPos);
  doc.setFont("Poppins", "normal");
  yPos = addKeyValue("Status:", (booking.status || "N/A").toUpperCase(), yPos);
  yPos = addKeyValue(
    "Date:",
    new Date(booking.journeyDate).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    yPos
  );

  yPos = addSeparator(yPos);

  doc.setFont("Poppins", "normal");
  doc.setFontSize(10);
  yPos = addSectionHeader("Journey Details", yPos);
  yPos = addKeyValue("From:", booking.fromCity || "N/A", yPos);
  yPos = addKeyValue("To:", booking.toCity || "N/A", yPos);
  const departureTime =
    booking?.departureTimeDisplay || booking.departureTime || "N/A";
  const arrivalTime =
    booking?.arrivalTimeDisplay || booking.arrivalTime || "N/A";
  yPos = addKeyValue("Departure:", departureTime, yPos);
  yPos = addKeyValue("Arrival:", arrivalTime, yPos);

  yPos = addSeparator(yPos);

  doc.setFont("Poppins", "normal");
  doc.setFontSize(10);
  yPos = addSectionHeader("Passenger", yPos);
  yPos = addKeyValue("Name:", booking.passengerName || "N/A", yPos);
  yPos = addKeyValue(
    "Seats:",
    Array.isArray(booking.seatNumbers)
      ? booking.seatNumbers.join(", ")
      : booking.seatNumbers || "N/A",
    yPos
  );

  yPos = addSeparator(yPos);

  doc.setFont("Poppins", "normal");
  doc.setFontSize(10);
  yPos = addSectionHeader("Bus", yPos);
  yPos = addKeyValue("Bus Name:", booking.busId?.busName || "N/A", yPos);
  yPos = addKeyValue(
    "Route:",
    `${booking.fromCity || "N/A"} → ${booking.toCity || "N/A"}`,
    yPos
  );

  yPos = addSeparator(yPos);

  doc.setFont("Poppins", "normal");
  doc.setFontSize(10);
  const baseFare = Number(booking.amount || 0);
  const processingFee = Math.round(baseFare * 0.05);
  const totalPaid = booking?.paymentDetails?.amount
    ? Math.round(booking.paymentDetails.amount / 100)
    : baseFare + processingFee;

  yPos = addSectionHeader("Payment", yPos);
  yPos = addKeyValue("Base Fare:", `₹${baseFare}`, yPos);
  
  if (booking.paymentType === 'offline') {
    yPos = addKeyValue("Payment Method:", "Cash (Offline)", yPos);
    yPos = addKeyValue("Payment Status:", "Completed", yPos);
    yPos = addKeyValue("Total Paid:", `₹${baseFare}`, yPos);
  } else {
    yPos = addKeyValue("Processing Fee:", `₹${processingFee}`, yPos);
    if (booking.paymentDetails) {
      yPos = addKeyValue("Method:", booking.paymentDetails.method || "N/A", yPos);
      if (booking.paymentDetails.bank)
        yPos = addKeyValue("Bank:", booking.paymentDetails.bank, yPos);
      yPos = addKeyValue("Paid (Razorpay):", `₹${totalPaid}`, yPos);
      yPos = addKeyValue(
        "Order ID:",
        booking.paymentDetails.razorpayOrderId || "N/A",
        yPos
      );
      yPos = addKeyValue(
        "Payment ID:",
        booking.paymentDetails.razorpayPaymentId || "N/A",
        yPos
      );
    }
  }

  yPos = Math.min(yPos + 8, 278);
  doc.setFontSize(9);
  doc.setTextColor(128, 128, 128);
  doc.setFont("Poppins", "normal");
  doc.setFontSize(10);
  doc.text(
    "Generated on: " + new Date().toLocaleString("en-IN"),
    leftMargin,
    yPos
  );
  doc.setFont("Poppins", "normal");
  doc.setFontSize(10);
  doc.text(
    `Thank you for choosing ${BRAND_CONFIG.companyName}!`,
    105,
    Math.min(yPos + 7, 287),
    { align: "center" }
  );

  const date = new Date(booking.journeyDate).toISOString().split("T")[0];
  const filename = `SB${date}${booking.toCity}${booking.fromCity}.pdf`;
  doc.save(filename);
  return filename;
};
