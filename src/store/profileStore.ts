import { create } from "zustand";
import { type PersistStorage, persist } from "zustand/middleware";
import {
	applySnapshot,
	captureSnapshot,
	createDefaultSnapshot,
	isValidSnapshot,
	type ProfileSnapshotV1,
} from "@/lib/profileSnapshot";
import { useUIStore } from "@/store/uiStore";

export interface StoredProfile {
	id: string;
	name: string;
	snapshot: ProfileSnapshotV1;
}

interface ProfileCatalogState {
	profiles: StoredProfile[];
	activeProfileId: string | null;
	ensureMigrated: () => void;
	saveActiveSnapshot: () => void;
	switchProfile: (id: string) => string | undefined;
	createProfile: (name?: string) => void;
	renameProfile: (id: string, name: string) => void;
	deleteProfile: (id: string) => string | undefined;
}

type PersistedCatalog = Pick<ProfileCatalogState, "profiles" | "activeProfileId">;

const storageAdapter: PersistStorage<PersistedCatalog> = {
	getItem: (name) => {
		const str = localStorage.getItem(name);
		if (!str) return null;
		try {
			return JSON.parse(str) as { state: PersistedCatalog; version?: number };
		} catch {
			return null;
		}
	},
	setItem: (name, newValue) => {
		try {
			localStorage.setItem(name, JSON.stringify(newValue));
		} catch (error) {
			if (error instanceof DOMException && error.name === "QuotaExceededError") {
				useUIStore.getState().setMessage("Armazenamento cheio. Não foi possível salvar os perfis.");
				return;
			}
			throw error;
		}
	},
	removeItem: (name) => localStorage.removeItem(name),
};

function sanitizeProfiles(profiles: StoredProfile[]): StoredProfile[] {
	return profiles.filter(
		(p) => p && typeof p.id === "string" && typeof p.name === "string" && isValidSnapshot(p.snapshot),
	);
}

export const useProfileStore = create<ProfileCatalogState>()(
	persist(
		(set, get) => ({
			profiles: [],
			activeProfileId: null,

			ensureMigrated: () => {
				const { profiles } = get();
				const valid = sanitizeProfiles(profiles);
				if (valid.length === 0) {
					const id = crypto.randomUUID();
					const principal: StoredProfile = {
						id,
						name: "Principal",
						snapshot: captureSnapshot(),
					};
					set({ profiles: [principal], activeProfileId: id });
					return;
				}

				let activeProfileId = get().activeProfileId;
				if (!activeProfileId || !valid.some((p) => p.id === activeProfileId)) {
					activeProfileId = valid[0]?.id ?? null;
				}

				if (valid.length !== profiles.length || activeProfileId !== get().activeProfileId) {
					set({ profiles: valid, activeProfileId });
					const active = valid.find((p) => p.id === activeProfileId);
					if (active) applySnapshot(active.snapshot);
					if (valid.length !== profiles.length) {
						useUIStore.getState().setMessage("Um ou mais perfis inválidos foram ignorados.");
					}
				}
			},

			saveActiveSnapshot: () => {
				const { profiles, activeProfileId } = get();
				if (!activeProfileId) return;
				const snapshot = captureSnapshot();
				set({
					profiles: profiles.map((p) => (p.id === activeProfileId ? { ...p, snapshot } : p)),
				});
			},

			switchProfile: (id) => {
				const { profiles, activeProfileId } = get();
				if (id === activeProfileId) return undefined;
				const target = profiles.find((p) => p.id === id);
				if (!target) return "Perfil não encontrado.";

				get().saveActiveSnapshot();
				applySnapshot(target.snapshot);
				set({ activeProfileId: id });
				return undefined;
			},

			createProfile: (name) => {
				get().saveActiveSnapshot();
				const id = crypto.randomUUID();
				const trimmed = name?.trim();
				const profile: StoredProfile = {
					id,
					name: trimmed && trimmed.length > 0 ? trimmed : "Novo perfil",
					snapshot: createDefaultSnapshot(),
				};
				set((state) => ({
					profiles: [...state.profiles, profile],
					activeProfileId: id,
				}));
				applySnapshot(profile.snapshot);
			},

			renameProfile: (id, name) => {
				const trimmed = name.trim();
				const nextName = trimmed.length > 0 ? trimmed : "Sem nome";
				set((state) => ({
					profiles: state.profiles.map((p) => (p.id === id ? { ...p, name: nextName } : p)),
				}));
			},

			deleteProfile: (id) => {
				const { profiles, activeProfileId } = get();
				if (profiles.length <= 1) {
					return "Não é possível apagar o único perfil.";
				}
				const remaining = profiles.filter((p) => p.id !== id);
				if (remaining.length === profiles.length) {
					return "Perfil não encontrado.";
				}

				get().saveActiveSnapshot();
				const updatedRemaining = get().profiles.filter((p) => p.id !== id);

				if (activeProfileId === id) {
					const next = updatedRemaining[0];
					if (!next) return "Não é possível apagar o único perfil.";
					applySnapshot(next.snapshot);
					set({ profiles: updatedRemaining, activeProfileId: next.id });
				} else {
					set({ profiles: updatedRemaining });
				}
				return undefined;
			},
		}),
		{
			name: "organiza-perfis",
			storage: storageAdapter,
			partialize: (state) => ({ profiles: state.profiles, activeProfileId: state.activeProfileId }),
		},
	),
);
