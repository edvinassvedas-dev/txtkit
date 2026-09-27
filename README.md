# txtkit


**Live:** https://edvinassvedas-dev.github.io/txtkit/

---

Plain web tools for dealing with text.

- **No dependencies.** That's why [sqlfmt](https://edvinassvedas-dev.github.io/sqlfmt/) lives elsewhere.
- **Everything stays in your browser.** Input text is never stored. Options live in the URL hash; the theme and the `replace` dictionary in localStorage.

---

## The kit

- **quote** — wrap list items in quote characters
- **unquote** — strip surrounding quotes or brackets
- **compare** — items in list A only, B only, or both
- **dedupe** — find duplicates and produce a deduplicated list
- **tabulate** — turn tabular text into Markdown, CSV, Python, or SQL
- **mdtoc** — generate a table of contents from markdown headings
- **replace** — apply a CSV dictionary of identifier renames to code or text
- **jsonfmt** — format, minify, or sort keys in JSON
- **template** — render a pattern once per input row
- **sqlchar** — rewrite special characters in SQL literals as CHAR()/CHR() calls *(used with Spark; other dialects tested in local containers only)*

## License

MIT
