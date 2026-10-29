import { describe, expect, it } from "vitest";
import { motionState } from "../../src/lib/motion";

describe("motionState", () => {
  it("is on by default, and off when the reader turned it off", () => {
    expect(motionState(false, undefined)).toBe("on");
    expect(motionState(false, "off")).toBe("off");
  });
  it("follows the system: reduced motion is off whatever the switch says", () => {
    expect(motionState(true, undefined)).toBe("system");
    expect(motionState(true, "off")).toBe("system");
  });
});
