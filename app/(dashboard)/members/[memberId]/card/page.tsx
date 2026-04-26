import QRCode from "qrcode";
import { notFound } from "next/navigation";

import { getMember } from "@/lib/store";

export default async function MemberCardPage({
  params,
}: {
  params: Promise<{ memberId: string }>;
}) {
  const { memberId } = await params;
  const member = await getMember(memberId);
  if (!member) {
    notFound();
  }

  const qrCode = await QRCode.toDataURL(member.qrValue, {
    color: { dark: "#0d6b3e", light: "#ffffff" },
    width: 160,
    margin: 1,
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-6 print:p-0">
      <div className="w-full max-w-md rounded-[28px] border border-zinc-200 bg-white p-6 shadow-lg print:shadow-none">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Carte membre</p>
            <h1 className="mt-2 text-2xl font-semibold text-zinc-950">ANGRS</h1>
          </div>
          <div className="rounded-2xl bg-emerald-700 px-3 py-2 text-sm font-semibold text-white">
            {member.cardNumber}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-emerald-50 text-xl font-semibold text-emerald-700">
            {member.firstName[0]}
            {member.lastName[0]}
          </div>
          <div>
            <p className="text-xl font-semibold text-zinc-950">
              {member.firstName} {member.lastName}
            </p>
            <p className="text-sm text-zinc-600">{member.grade}</p>
            <p className="text-sm text-zinc-600">{member.functionTitle}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-[1fr_auto] items-center gap-4">
          <div className="space-y-2 text-sm text-zinc-600">
            <p>{member.phone}</p>
            <p>{member.address}</p>
            <p>Retraite: {member.retirementDate}</p>
          </div>
          <img src={qrCode} alt="QR code membre" className="h-36 w-36 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
