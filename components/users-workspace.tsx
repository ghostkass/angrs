"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { createUser, updateUser, deleteUser } from "@/app/(dashboard)/users/actions";

export function UsersWorkspace({ users }: { users: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "MEMBER" });
  const [loading, setLoading] = useState(false);

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({ name: "", email: "", password: "", role: "MEMBER" });
    setIsModalOpen(true);
  };

  const openEditModal = (user: any) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, password: "", role: user.role });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingUser) {
        await updateUser(editingUser.id, formData);
      } else {
        await createUser(formData);
      }
      setIsModalOpen(false);
    } catch (error) {
      alert("Erreur lors de la sauvegarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      try {
        await deleteUser(id);
      } catch (error) {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="panel rounded-[32px] p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Utilisateurs</h1>
            <p className="text-sm text-[var(--muted)]">Gérez les accès à la plateforme ANGRS.</p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-2xl bg-[var(--primary)] px-4 py-2 font-semibold text-white transition hover:brightness-110"
          >
            <Plus size={18} />
            Ajouter un utilisateur
          </button>
        </div>
      </div>

      <div className="panel overflow-hidden rounded-[32px]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[var(--surface-strong)] text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
              <tr>
                <th className="px-6 py-4 font-semibold">Nom</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Rôle</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {users.map((user) => (
                <tr key={user.id} className="transition hover:bg-[var(--surface-strong)]">
                  <td className="px-6 py-4 font-medium">{user.name}</td>
                  <td className="px-6 py-4 text-[var(--muted)]">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-[var(--primary-soft)] px-3 py-1 text-xs font-semibold text-[var(--primary)]">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => openEditModal(user)}
                      className="mr-3 inline-flex rounded-lg p-2 text-[var(--muted)] transition hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]"
                      title="Modifier"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="inline-flex rounded-lg p-2 text-[var(--danger)] transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-[var(--muted)]">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[32px] bg-[var(--background)] p-6 shadow-2xl border border-[var(--line)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">{editingUser ? "Modifier l'utilisateur" : "Nouvel utilisateur"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="rounded-full p-2 text-[var(--muted)] hover:bg-[var(--line)]">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--muted)] mb-1">Nom complet</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 outline-none focus:border-[var(--primary)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--muted)] mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 outline-none focus:border-[var(--primary)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--muted)] mb-1">
                  Mot de passe {editingUser && <span className="text-xs">(Laisser vide pour ne pas changer)</span>}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 outline-none focus:border-[var(--primary)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--muted)] mb-1">Rôle</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 outline-none focus:border-[var(--primary)]"
                >
                  <option value="ADMIN">Administrateur</option>
                  <option value="MANAGER">Gestionnaire</option>
                  <option value="MEMBER">Membre</option>
                </select>
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-[var(--primary)] py-3 font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
                >
                  {loading ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
