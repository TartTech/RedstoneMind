import { create } from 'zustand';

/**
 * Store for режима выбора координат в 3D Viewer
 * Используется нодами navigation:go_to for выбора точки назначения
 */
export const useCoordinatePickerStore = create((set, get) => ({
  isPickMode: false,

  onSelect: null,

  selectedCoords: null,

  hoveredCoords: null,

  /**
   * Активировать режим выбора координат
   * @param {Function} callback - функция которая получит {x, y, z}
   */
  startPicking: (callback) => {
    set({
      isPickMode: true,
      onSelect: callback,
      selectedCoords: null,
      hoveredCoords: null,
    });
  },

  /**
   * Завершить выбор (callsся при клике на блок)
   * @param {Object} coords - {x, y, z}
   */
  confirmSelection: (coords) => {
    const { onSelect } = get();
    if (onSelect) {
      onSelect(coords);
    }
    set({
      isPickMode: false,
      onSelect: null,
      selectedCoords: null,
      hoveredCoords: null,
    });
  },

  /**
   * Undo выбор
   */
  cancelPicking: () => {
    set({
      isPickMode: false,
      onSelect: null,
      selectedCoords: null,
      hoveredCoords: null,
    });
  },

  /**
   * Refresh координаты под курсором
   */
  setHoveredCoords: (coords) => {
    set({ hoveredCoords: coords });
  },

  /**
   * Install выбранные координаты (до подтверждения)
   */
  setSelectedCoords: (coords) => {
    set({ selectedCoords: coords });
  },
}));
