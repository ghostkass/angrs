import type { Role, SocialOperationType } from "@/lib/types";

export const AUTH_COOKIE_NAME = "angrs_session";
export const CSRF_COOKIE_NAME = "angrs_csrf";

export const roles: Array<{ value: Role; label: string; scope: string }> = [
  { value: "ADMIN", label: "Admin", scope: "Acces total et audit" },
  { value: "MANAGER", label: "Gestionnaire", scope: "Membres, cotisations, social" },
  { value: "MEMBER", label: "Membre", scope: "Consultation de son dossier" },
];

export const monthLabels = [
  "Jan",
  "Fev",
  "Mar",
  "Avr",
  "Mai",
  "Jun",
  "Jul",
  "Aou",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const socialOperationLabels: Record<SocialOperationType, string> = {
  MEDICAL: "Prise en charge medicale",
  FINANCIAL: "Aide financiere",
  SOCIAL: "Assistance sociale",
  EMERGENCY: "Urgence",
  DEATH: "Deces",
  EXCEPTIONAL: "Soutien exceptionnel",
};

export const apiEndpoints = [
  { method: "POST", path: "/api/auth/login", summary: "Connexion JWT avec cookie httpOnly" },
  { method: "POST", path: "/api/auth/logout", summary: "Suppression de la session" },
  { method: "GET", path: "/api/auth/session", summary: "Lecture de la session courante" },
  { method: "GET", path: "/api/dashboard", summary: "Resume metier du tableau de bord" },
  { method: "GET", path: "/api/members", summary: "Liste paginee des membres" },
  { method: "POST", path: "/api/members", summary: "Creation de membre avec photo" },
  { method: "PATCH", path: "/api/members/:id", summary: "Mise a jour de membre" },
  { method: "DELETE", path: "/api/members/:id", summary: "Suppression de membre" },
  { method: "GET", path: "/api/members/export", summary: "Export PDF ou Excel des membres" },
  { method: "GET", path: "/api/contributions", summary: "Historique et stats des cotisations" },
  { method: "POST", path: "/api/contributions", summary: "Enregistrement d'un paiement" },
  { method: "GET", path: "/api/social-operations", summary: "Historique des operations sociales" },
  { method: "POST", path: "/api/social-operations", summary: "Creation d'une operation sociale" },
  { method: "GET", path: "/api/documents", summary: "Liste securisee des documents" },
  { method: "POST", path: "/api/documents", summary: "Upload de document lie a un membre" },
  { method: "GET", path: "/api/openapi", summary: "Document OpenAPI compatible Swagger" },
];
