import { NextResponse } from "next/server";

import { apiEndpoints } from "@/lib/constants";

export async function GET() {
  return NextResponse.json({
    openapi: "3.1.0",
    info: {
      title: "ANGRS API",
      version: "1.0.0",
      description: "API REST de demonstration pour la gestion des membres ANGRS.",
    },
    paths: Object.fromEntries(
      apiEndpoints.map((endpoint) => [
        endpoint.path.replace(":id", "{id}"),
        {
          [endpoint.method.toLowerCase()]: {
            summary: endpoint.summary,
            tags: ["ANGRS"],
          },
        },
      ]),
    ),
  });
}
