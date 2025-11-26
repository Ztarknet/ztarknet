/**
 * Utility function to merge class names
 * @param  {...any} classes - Class names to merge
 * @returns {string} Merged class names
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
