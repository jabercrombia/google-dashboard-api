const colors = [
    "oklch(0.87 0.02 253)", // slate-300
    "oklch(0.71 0.04 257)", // slate-400
    "oklch(0.55 0.04 257)", // slate-500
    "oklch(0.45 0.04 257)", // slate-600
    "oklch(0.37 0.04 257)", // slate-700
    "oklch(0.21 0.04 266)", // slate-900
  ];
  
  /**
   * Get a random color from the predefined list.
   * @returns {string} A hex color code.
   */
  export function getRandomColor(): string {
    if (colors.length === 0) {
      console.error("No colors available in the array.");
      return "#000";
    }
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  /**
   * Get a color from the list based on an index.
   * This ensures consistent colors for items in a list.
   * @param index - The index to get the color for.
   * @returns {string} A hex color code.
   */
  export function getColorByIndex(index: number): string {
    return colors[index % colors.length];
  }
  
  export default colors;
  