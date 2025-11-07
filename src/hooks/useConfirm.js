import { useState } from "react";

/**
 * Hook personalizado para gestionar diálogos de confirmación
 * @returns {Object} - { isOpen, data, openConfirm, closeConfirm, confirmData }
 *
 * @example
 * const confirm = useConfirm();
 *
 * // Abrir el diálogo
 * <button onClick={() => confirm.openConfirm({ userId: 123 })}>
 *   Eliminar
 * </button>
 *
 * // En el componente
 * <ConfirmDialog
 *   isOpen={confirm.isOpen}
 *   onClose={confirm.closeConfirm}
 *   onConfirm={() => {
 *     console.log("ID del usuario:", confirm.data.userId);
 *     // Realizar la acción
 *   }}
 * />
 */
export function useConfirm() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(null);

  const openConfirm = (confirmData = null) => {
    setData(confirmData);
    setIsOpen(true);
  };

  const closeConfirm = () => {
    setIsOpen(false);
    setData(null);
  };

  return {
    isOpen,
    data,
    openConfirm,
    closeConfirm,
  };
}
