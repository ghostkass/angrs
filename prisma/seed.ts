import "dotenv/config";
import { hashSync } from "bcryptjs";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/client/client";

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const year = 2026;

async function main() {
  console.log("Testing pg connection...");
  const client = await pool.connect();
  console.log("PG connected!");
  client.release();
  console.log("⏳ Nettoyage de la base ...");
  await prisma.auditLog.deleteMany();
  await prisma.contribution.deleteMany();
  await prisma.document.deleteMany();
  await prisma.socialOperation.deleteMany();
  await prisma.user.deleteMany();
  await prisma.member.deleteMany();
  await prisma.appSettings.deleteMany();

  console.log("⚙️  Paramètres ...");
  await prisma.appSettings.create({
    data: { id: "singleton", monthlyContributionAmount: 5000, fiscalYear: year },
  });

  console.log("👥 Membres ...");
  const members = await Promise.all([
    prisma.member.create({
      data: {
        id: "mbr-001",
        cardNumber: "ANGRS-0012",
        firstName: "Ibrahima",
        lastName: "Ba",
        functionTitle: "Ancien chef de brigade",
        grade: "Adjudant-chef",
        birthDate: new Date("1962-03-14"),
        phone: "+221 77 001 12 34",
        address: "Rufisque, Dakar",
        retirementDate: new Date("2022-06-30"),
        monthlyContributionTarget: 5000,
        qrValue: "ANGRS|ANGRS-0012|IBRAHIMA BA",
      },
    }),
    prisma.member.create({
      data: {
        id: "mbr-002",
        cardNumber: "ANGRS-0038",
        firstName: "Fatou",
        lastName: "Diallo",
        functionTitle: "Ancienne formatrice",
        grade: "Capitaine",
        birthDate: new Date("1965-11-08"),
        phone: "+221 76 412 44 11",
        address: "Saint-Louis",
        retirementDate: new Date("2021-10-15"),
        monthlyContributionTarget: 5000,
        qrValue: "ANGRS|ANGRS-0038|FATOU DIALLO",
      },
    }),
    prisma.member.create({
      data: {
        id: "mbr-003",
        cardNumber: "ANGRS-0054",
        firstName: "Moussa",
        lastName: "Sow",
        functionTitle: "Ancien officier logistique",
        grade: "Lieutenant",
        birthDate: new Date("1967-01-21"),
        phone: "+221 70 890 22 12",
        address: "Thiès",
        retirementDate: new Date("2023-01-31"),
        monthlyContributionTarget: 5000,
        qrValue: "ANGRS|ANGRS-0054|MOUSSA SOW",
      },
    }),
    prisma.member.create({
      data: {
        id: "mbr-004",
        cardNumber: "ANGRS-0067",
        firstName: "Aminata",
        lastName: "Gueye",
        functionTitle: "Ancienne responsable administrative",
        grade: "Commandant",
        birthDate: new Date("1961-08-16"),
        phone: "+221 78 399 11 55",
        address: "Mbour",
        retirementDate: new Date("2020-12-31"),
        monthlyContributionTarget: 5000,
        qrValue: "ANGRS|ANGRS-0067|AMINATA GUEYE",
      },
    }),
    prisma.member.create({
      data: {
        id: "mbr-005",
        cardNumber: "ANGRS-0089",
        firstName: "Cheikh",
        lastName: "Fall",
        functionTitle: "Ancien commandant d'unite",
        grade: "Colonel",
        birthDate: new Date("1959-05-27"),
        phone: "+221 75 555 66 77",
        address: "Kaolack",
        retirementDate: new Date("2019-05-31"),
        monthlyContributionTarget: 5000,
        qrValue: "ANGRS|ANGRS-0089|CHEIKH FALL",
      },
    }),
    prisma.member.create({
      data: {
        id: "mbr-006",
        cardNumber: "ANGRS-0103",
        firstName: "Mariama",
        lastName: "Seck",
        functionTitle: "Ancienne chargee sociale",
        grade: "Adjudant",
        birthDate: new Date("1966-02-04"),
        phone: "+221 77 632 21 10",
        address: "Ziguinchor",
        retirementDate: new Date("2022-11-30"),
        monthlyContributionTarget: 5000,
        qrValue: "ANGRS|ANGRS-0103|MARIAMA SECK",
      },
    }),
  ]);

  console.log("🔑 Utilisateurs ...");
  await Promise.all([
    prisma.user.create({
      data: {
        email: "admin@angrs.sn",
        password: hashSync("Admin@2026!", 12),
        name: "Colonel Mamadou Sarr",
        role: "ADMIN",
      },
    }),
    prisma.user.create({
      data: {
        email: "gestion@angrs.sn",
        password: hashSync("Gestion@2026!", 12),
        name: "Commandant Awa Ndiaye",
        role: "MANAGER",
      },
    }),
    prisma.user.create({
      data: {
        email: "membre@angrs.sn",
        password: hashSync("Membre@2026!", 12),
        name: "Adjudent Ibrahima Ba",
        role: "MEMBER",
        memberId: "mbr-001",
      },
    }),
  ]);

  console.log("💰 Cotisations ...");
  const contribs = [];
  for (let i = 0; i < 6; i++) {
    contribs.push(
      prisma.contribution.create({
        data: {
          memberId: "mbr-001",
          year,
          month: i + 1,
          amount: 5000,
          status: "PAID",
          paidAt: new Date(Date.UTC(year, i, 5, 10, 0, 0)),
          receiptNumber: `RCT-${year}-${String(i + 1).padStart(2, "0")}-001`,
          recordedBy: "Commandant Awa Ndiaye",
        },
      }),
    );
  }
  for (let i = 0; i < 4; i++) {
    contribs.push(
      prisma.contribution.create({
        data: {
          memberId: "mbr-002",
          year,
          month: i + 1,
          amount: 5000,
          status: "PAID",
          paidAt: new Date(Date.UTC(year, i, 7, 12, 0, 0)),
          receiptNumber: `RCT-${year}-${String(i + 1).padStart(2, "0")}-002`,
          recordedBy: "Commandant Awa Ndiaye",
        },
      }),
    );
  }
  contribs.push(
    prisma.contribution.create({
      data: {
        memberId: "mbr-003",
        year,
        month: 1,
        amount: 5000,
        status: "PAID",
        paidAt: new Date(Date.UTC(year, 0, 11, 9, 15, 0)),
        receiptNumber: `RCT-${year}-01-003`,
        recordedBy: "Colonel Mamadou Sarr",
      },
    }),
    prisma.contribution.create({
      data: {
        memberId: "mbr-004",
        year,
        month: 1,
        amount: 5000,
        status: "PAID",
        paidAt: new Date(Date.UTC(year, 0, 9, 8, 0, 0)),
        receiptNumber: `RCT-${year}-01-004`,
        recordedBy: "Colonel Mamadou Sarr",
      },
    }),
    prisma.contribution.create({
      data: {
        memberId: "mbr-005",
        year,
        month: 1,
        amount: 5000,
        status: "PAID",
        paidAt: new Date(Date.UTC(year, 0, 13, 8, 0, 0)),
        receiptNumber: `RCT-${year}-01-005`,
        recordedBy: "Colonel Mamadou Sarr",
      },
    }),
  );
  await Promise.all(contribs);

  console.log("🤝 Opérations sociales ...");
  await Promise.all([
    prisma.socialOperation.create({
      data: {
        memberId: "mbr-001",
        type: "MEDICAL",
        description: "Prise en charge ophtalmologique et prescription post-consultation.",
        amount: 125000,
        date: new Date("2026-02-18"),
        status: "VALIDATED",
        createdBy: "Commandant Awa Ndiaye",
      },
    }),
    prisma.socialOperation.create({
      data: {
        memberId: "mbr-004",
        type: "DEATH",
        description: "Accompagnement de la famille suite au deces d'un proche.",
        amount: 300000,
        date: new Date("2026-03-03"),
        status: "IN_PROGRESS",
        createdBy: "Colonel Mamadou Sarr",
      },
    }),
    prisma.socialOperation.create({
      data: {
        memberId: "mbr-006",
        type: "FINANCIAL",
        description: "Appui ponctuel pour frais de deplacement medical.",
        amount: 85000,
        date: new Date("2026-04-12"),
        status: "VALIDATED",
        createdBy: "Commandant Awa Ndiaye",
      },
    }),
  ]);

  console.log("📄 Documents ...");
  await Promise.all([
    prisma.document.create({
      data: {
        memberId: "mbr-001",
        title: "Arrete de retraite",
        category: "ADMINISTRATIVE",
        mimeType: "text/plain",
        size: 2840,
        storagePath: "/uploads/documents/sample-arrete.txt",
        accessLevel: "MANAGER",
        uploadedBy: "Commandant Awa Ndiaye",
      },
    }),
    prisma.document.create({
      data: {
        memberId: "mbr-004",
        title: "Note medicale",
        category: "MEDICAL",
        mimeType: "text/plain",
        size: 1480,
        storagePath: "/uploads/documents/sample-note.txt",
        accessLevel: "ADMIN_ONLY",
        uploadedBy: "Colonel Mamadou Sarr",
      },
    }),
  ]);

  console.log("📋 Audit ...");
  await Promise.all([
    prisma.auditLog.create({
      data: {
        actor: "Colonel Mamadou Sarr",
        action: "Validation aide sociale",
        entity: "social_operation",
        entityLabel: "soc-003",
        ip: "127.0.0.1",
        details: "Validation d'une aide financiere de 85 000 XOF.",
        timestamp: new Date("2026-04-12T12:15:00.000Z"),
      },
    }),
    prisma.auditLog.create({
      data: {
        actor: "Commandant Awa Ndiaye",
        action: "Enregistrement cotisation",
        entity: "contribution",
        entityLabel: "RCT-2026-04-002",
        ip: "127.0.0.1",
        details: "Paiement du mois d'avril pour Fatou Diallo.",
        timestamp: new Date("2026-04-08T09:10:00.000Z"),
      },
    }),
  ]);

  console.log("✅ Seed terminé avec succès !");
}

main()
  .catch((e) => {
    console.error("❌ Erreur seed :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await prisma.$disconnect();
  });
