// the delivery staircase (mockup stairs()): a view places step i in column col[i] at height lvl[i].
// Steps are 105 wide, start 10 in, rise 32 per level from a top of 60, and all stand on the floor at 470.
export const STEP_W = 105, TOP0 = 60, RISE = 32, FLOOR = 470;

export interface StairView { col: number[]; lvl: number[] }

export function stepBox(v: StairView, i: number): { x: number; top: number; h: number } {
  const top = TOP0 + v.lvl[i] * RISE;
  return { x: 10 + v.col[i] * STEP_W, top, h: FLOOR - top };
}

// lower steps are paler: 30% gold at the top, 3.5 points less per level
export function stepFill(lvl: number): string {
  return `color-mix(in srgb,var(--gold-b) ${+(30 - lvl * 3.5).toFixed(2)}%,var(--surface))`;
}

const I8 = [0, 1, 2, 3, 4, 5, 6, 7];
// §5.55: Ibn Ḥajar ranks hearing first and reading to the teacher second; some scholars of Madīna ranked
// reading above hearing (steps 1 and 2 swap); al-Bukhārī and a large group hold the two equal (same height)
export const STAIR_VIEWS: Record<"ibn-hajar" | "madinah" | "bukhari", StairView> = {
  "ibn-hajar": { col: I8, lvl: I8 },
  madinah: { col: [1, 0, 2, 3, 4, 5, 6, 7], lvl: [1, 0, 2, 3, 4, 5, 6, 7] },
  bukhari: { col: I8, lvl: [0, 0, 2, 3, 4, 5, 6, 7] },
};
