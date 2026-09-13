export function calculatePreparationGridScrollOffset(
  index: number,
  columnCount: number,
  rowHeight: number,
  scrollLead: number,
) {
  const targetRow = Math.floor(index / columnCount);

  return Math.max(0, targetRow * rowHeight - scrollLead);
}
