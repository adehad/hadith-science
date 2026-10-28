// fail if copyrighted source material is ever tracked or staged (spec §2, §9)
import { execSync } from "node:child_process";
const files = execSync("git ls-files --cached", { encoding: "utf8" }).split("\n");
const bad = files.filter((f) => /(^|\/)source\/|\.pdf$|(^|\/)nuzhah[^/]*\.txt$|(^|\/)annotations[^/]*\.txt$/i.test(f));
if (bad.length) { console.error("Copyrighted source tracked:\n" + bad.join("\n")); process.exit(1); }
console.log("guard: ok");
