import { parseSlugQuery, resolveQuery } from "../lib/terms";
import { href } from "../lib/url";

// fetch the index only when the URL actually carries a term (spec §6)
if (parseSlugQuery(location.search)) {
  fetch(href("terms-index.json"))
    .then((r) => r.json())
    .then((index: Record<string, string>) => {
      const to = resolveQuery(location.search, index);
      if (to) location.replace(href(to));
    })
    .catch(() => {});
}
