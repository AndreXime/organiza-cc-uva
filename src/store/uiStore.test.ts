/// <reference types="jest" />

import { useUIStore } from "./uiStore";

function resetUiStore(): void {
	jest.useRealTimers();
	useUIStore.getState().setMessage("");
	useUIStore.setState({
		Tab: "gerenciador",
		mode: "default",
		message: "",
		modalMessage: "",
		onConfirmAction: null,
		mostrarFeitas: true,
	});
}

describe("useUIStore", () => {
	beforeEach(() => {
		resetUiStore();
	});

	describe("setMessage", () => {
		beforeEach(() => {
			jest.useFakeTimers();
		});
		afterEach(() => {
			resetUiStore();
		});

		it("limpa a mensagem após 7 segundos", () => {
			useUIStore.getState().setMessage("ok");
			expect(useUIStore.getState().message).toBe("ok");

			jest.advanceTimersByTime(6999);
			expect(useUIStore.getState().message).toBe("ok");
			jest.advanceTimersByTime(1);
			expect(useUIStore.getState().message).toBe("");
		});

		it("mensagem vazia não agenda novo timeout", () => {
			useUIStore.getState().setMessage("x");
			jest.advanceTimersByTime(7000);
			expect(useUIStore.getState().message).toBe("");

			useUIStore.getState().setMessage("");
			jest.advanceTimersByTime(7000);
			expect(useUIStore.getState().message).toBe("");
		});

		it("nova mensagem cancela o timer da anterior", () => {
			useUIStore.getState().setMessage("primeira");
			jest.advanceTimersByTime(3000);

			useUIStore.getState().setMessage("segunda");
			jest.advanceTimersByTime(6999);
			expect(useUIStore.getState().message).toBe("segunda");

			jest.advanceTimersByTime(1);
			expect(useUIStore.getState().message).toBe("");
		});
	});

	describe("modal", () => {
		it("openModal define mensagem e callback; closeModal limpa", () => {
			const fn = jest.fn();
			useUIStore.getState().openModal("confirma?", fn);

			expect(useUIStore.getState().modalMessage).toBe("confirma?");
			expect(useUIStore.getState().onConfirmAction).toBe(fn);

			useUIStore.getState().closeModal();
			expect(useUIStore.getState().modalMessage).toBe("");
			expect(useUIStore.getState().onConfirmAction).toBe(null);
		});
	});
});
