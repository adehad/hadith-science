// the small API islands share through window.nuzhah, declared once here: if each island redeclared
// Window.nuzhah with its own shape, the declarations would conflict and astro check would fail
interface NuzhahApi {
  /** popover.ts: open the term's popover; false when the page has no trigger for it */
  openTerm?(slug: string): boolean;
  /** viewswitch.ts: switch to a view instantly and record it in ?view= */
  setView?(id: string): void;
  /** carousel.ts: scroll the portrait carousel holding el so el is in view */
  reveal?(el: Element): void;
}
interface Window { nuzhah?: NuzhahApi }

declare namespace App {
  interface Locals {
    /** [scene].astro: the carousel panels of the scene being built, for Term's panel check */
    panels?: import("./lib/panels").Panel[];
  }
}
