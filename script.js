let fields = [null, null, null, null, null, null, null, null, null];
let currentShape = "circle"; // Startspieler

function init() {
  render();
}

function render() {
  let contentDiv = document.getElementById("content");
  let tableHTML = "<table>";

  for (let row = 0; row < 3; row++) {
    tableHTML += "<tr>";
    for (let col = 0; col < 3; col++) {
      let index = row * 3 + col;
      let field = fields[index];

      let symbol = "";
      if (field === "circle") {
        symbol = generateAnimatedCircleSVG();
      } else if (field === "cross") {
        symbol = generateAnimatedCrossSVG();
      }

      tableHTML += `<td onclick="handleClick(${index}, this)">
                      <div class="cell-content">${symbol}</div>
                    </td>`;
    }
    tableHTML += "</tr>";
  }

  tableHTML += "</table>";
  contentDiv.innerHTML = tableHTML;
}

function handleClick(index, tdElement) {
  // Abbruch, falls Feld bereits belegt
  if (fields[index] !== null) return;

  // Setze Symbol im Array
  fields[index] = currentShape;

  // Setze SVG im DOM
  const symbol = currentShape === "circle" ? generateAnimatedCircleSVG() : generateAnimatedCrossSVG();

  tdElement.innerHTML = `<div class="cell-content">${symbol}</div>`;

  // Entferne onclick-Handler direkt aus dem Element
  tdElement.onclick = null;

  // Spieler wechseln
  currentShape = currentShape === "circle" ? "cross" : "circle";
}

function generateAnimatedCircleSVG() {
  return `
<svg width="70" height="70">
  <circle
    cx="35"
    cy="35"
    r="31"
    fill="none"
    stroke="#00b0ef"
    stroke-width="4"
    stroke-dasharray="195"
    stroke-dashoffset="195">
    <animate
      attributeName="stroke-dashoffset"
      from="195"
      to="0"
      dur="250ms"
      fill="freeze"
    />
  </circle>
</svg>
  `.trim();
}

function generateAnimatedCrossSVG() {
  return `
<svg width="70" height="70" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
  <line x1="10" y1="10" x2="60" y2="60"
        stroke="#ffc000" stroke-width="4"
        stroke-dasharray="70" stroke-dashoffset="70">
    <animate attributeName="stroke-dashoffset"
             from="70" to="0" dur="250ms" fill="freeze" />
  </line>
  <line x1="60" y1="10" x2="10" y2="60"
        stroke="#ffc000" stroke-width="4"
        stroke-dasharray="70" stroke-dashoffset="70">
    <animate attributeName="stroke-dashoffset"
             from="70" to="0" dur="250ms" begin="250ms" fill="freeze" />
  </line>
</svg>
  `.trim();
}
