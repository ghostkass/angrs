import PDFDocument from "pdfkit";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

import { requireRole } from "@/lib/auth";
import { exportMembers } from "@/lib/store";

export async function GET(request: Request) {
  await requireRole(["ADMIN", "MANAGER"]);
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") ?? "xlsx";
  const rows = await exportMembers();

  if (format === "pdf") {
    const doc = new PDFDocument({ margin: 32 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk as Buffer));
    doc.fontSize(18).text("Registre ANGRS des membres", { underline: true });
    doc.moveDown();
    rows.forEach((row, index) => {
      doc
        .fontSize(11)
        .text(
          `${index + 1}. ${row.Nom} ${row.Prenom} | ${row.Carte} | ${row.Grade} | ${row.Telephone}`,
        );
    });
    doc.end();

    await new Promise((resolve) => doc.on("end", resolve));
    const buffer = Buffer.concat(chunks);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="angrs-membres.pdf"',
      },
    });
  }

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Membres");
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="angrs-membres.xlsx"',
    },
  });
}
