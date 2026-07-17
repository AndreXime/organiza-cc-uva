import useProfileSync from "@/hooks/useProfileSync";
import { useProfileStore } from "@/store/profileStore";
import { useUIStore } from "@/store/uiStore";

const buttonClassName =
	"cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background/50 px-4 py-2 text-sm font-medium text-foreground hover:border-primary/40 hover:bg-card transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export default function ProfileManager() {
	const profiles = useProfileStore((s) => s.profiles);
	const activeProfileId = useProfileStore((s) => s.activeProfileId);
	const switchProfile = useProfileStore((s) => s.switchProfile);
	const createProfile = useProfileStore((s) => s.createProfile);
	const renameProfile = useProfileStore((s) => s.renameProfile);
	const deleteProfile = useProfileStore((s) => s.deleteProfile);
	const setMessage = useUIStore((s) => s.setMessage);
	const openModal = useUIStore((s) => s.openModal);
	const { exportProfile, importProfile } = useProfileSync();

	const activeName = profiles.find((p) => p.id === activeProfileId)?.name ?? "—";

	function handleSwitch(id: string) {
		const err = switchProfile(id);
		if (err) setMessage(err);
	}

	function handleCreate() {
		const nome = window.prompt("Nome do novo perfil:", "Novo perfil");
		if (nome === null) return;
		createProfile(nome);
		setMessage("Perfil criado.");
	}

	function handleRename() {
		if (!activeProfileId) return;
		const nome = window.prompt("Novo nome do perfil:", activeName);
		if (nome === null) return;
		renameProfile(activeProfileId, nome);
		setMessage("Perfil renomeado.");
	}

	function handleDelete() {
		if (!activeProfileId) return;
		const id = activeProfileId;
		openModal("Tem certeza que deseja apagar este perfil?", () => {
			const err = deleteProfile(id);
			if (err) setMessage(err);
			else setMessage("Perfil apagado.");
		});
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-2">
				<label htmlFor="perfil-ativo" className="text-sm font-medium text-foreground">
					Perfil ativo: <span className="font-semibold">{activeName}</span>
				</label>
				<select
					id="perfil-ativo"
					className="w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
					value={activeProfileId ?? ""}
					onChange={(e) => handleSwitch(e.target.value)}
				>
					{profiles.map((p) => (
						<option key={p.id} value={p.id}>
							{p.name}
						</option>
					))}
				</select>
			</div>
			<div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:flex-wrap">
				<button type="button" className={buttonClassName} onClick={handleCreate}>
					Criar
				</button>
				<button type="button" className={buttonClassName} onClick={handleRename}>
					Renomear
				</button>
				<button type="button" className={buttonClassName} onClick={handleDelete}>
					Apagar
				</button>
				<button type="button" className={buttonClassName} onClick={exportProfile}>
					Exportar
				</button>
				<label className={buttonClassName}>
					Importar
					<input
						type="file"
						accept="application/json"
						className="hidden"
						onChange={async (e) => {
							const file = e.target.files?.[0];
							e.target.value = "";
							if (!file) return;
							try {
								const text = await file.text();
								importProfile(text);
							} catch {
								setMessage("Não foi possível ler o arquivo.");
							}
						}}
					/>
				</label>
			</div>
		</div>
	);
}
