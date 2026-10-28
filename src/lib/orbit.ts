// orbit ellipses for the map (ported from the concept mockup)
export const MAP_CENTRE: [number, number] = [410, 270];
export const orbitRadii = (i: number): [number, number] => [96 + i * 39, +((96 + i * 39) * 0.4).toFixed(4)];
export function planetAt(i: number, angle: number, [cx, cy] = MAP_CENTRE): [number, number] {
  const [rx, ry] = orbitRadii(i);
  return [cx + rx * Math.cos(angle), cy + ry * Math.sin(angle)];
}
export const planetRadius = (moonCount: number) => Math.min(20, 8 + moonCount * 0.6);
// server-rendered starting angle; the orbit island picks up from here
// golden-angle spacing so neighbouring rings never start bunched together
export const startAngle = (i: number) => (i * 2.39996) % (2 * Math.PI);
// radians per second: outer planets are slower (Kepler-ish, as in the mockup)
export const angularSpeed = (i: number) => (2 * Math.PI) / (50 * Math.pow(orbitRadii(i)[0] / 110, 1.5));
// moon dots circle the planet on a flattened ring just outside its body
export function moonAt(k: number, count: number, bodyR: number, t = 0): [number, number] {
  const R = bodyR + 9, b = (k / count) * 2 * Math.PI + t * 0.5;
  return [R * Math.cos(b), R * 0.5 * Math.sin(b)];
}
