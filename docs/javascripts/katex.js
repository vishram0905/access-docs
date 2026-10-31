// We render the equations on the client with KaTeX. Material swaps pages without a full reload, so we hook into
// its document$ stream rather than DOMContentLoaded, otherwise equations would only render on the first page.
// We only accept \( \) and \[ \], the delimiters arithmatex writes, because a bare $ also appears in amounts
// such as S$3,500 and must not be read as maths.
document$.subscribe(({ body }) => {
  renderMathInElement(body, {
    delimiters: [
      { left: "\\(", right: "\\)", display: false },
      { left: "\\[", right: "\\]", display: true }
    ]
  });
});
