export type ToastType = "success" | "error" | "info";

export function showToast(message: string, type: ToastType = "info") {
  window.dispatchEvent(
    new CustomEvent("mmm-toast", { detail: { message, type, id: Date.now() } })
  );
}
