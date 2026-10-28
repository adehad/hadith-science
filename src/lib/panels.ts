// spec §5 carousel: one SVG, wider than the screen in portrait; panels are x-slices of the diagram.
// The track is sized so the widest panel fits the viewport. The spec says n × viewport, but uneven panels would
// then overflow the screen, so we size by the widest panel instead.
export interface Panel { x0: number; x1: number }

/** the track (and so the SVG) width as a percentage of the scroller's width */
export function trackWidthPct(width: number, panels: Panel[]): number {
  return (width / Math.max(...panels.map((p) => p.x1 - p.x0))) * 100;
}

/** each panel's snap target, as percentages of the track */
export function stops(width: number, panels: Panel[]): { left: number; w: number }[] {
  return panels.map((p) => ({ left: (p.x0 / width) * 100, w: ((p.x1 - p.x0) / width) * 100 }));
}
