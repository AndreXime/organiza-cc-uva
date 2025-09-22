import { useUIStore } from '@/store/ui/uiStore';

export default function Modal() {
    const { modalMessage, onConfirmAction, closeModal } = useUIStore();

    const handleConfirm = () => {
        if (onConfirmAction) {
            onConfirmAction(); // Executa a ação guardada
        }
        closeModal(); // Fecha o modal e limpa o estado
    };

    if (modalMessage === '') return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
                <p className="mb-6 text-center text-gray-800">{modalMessage}</p>

                <div className="flex justify-end space-x-4">
                    <button
                        onClick={closeModal}
                        className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 transition hover:bg-gray-300"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={handleConfirm}
                        className="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                    >
                        Sim
                    </button>
                </div>
            </div>
        </div>
    );
}
