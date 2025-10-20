import { useCallback } from "react";

export function useToast() {
  const toast = useCallback(({ title, description, variant }) => {
    // Exemplo simples: console.log ou futura integração com lib de UI
    console.log(`[${variant || "info"}] ${title}: ${description}`);
    alert(`${title}\n${description}`);
  }, []);

  return { toast };
}
