let fields = [null, null, null, null, null, null, null, null, null];
let currentShape = "circle"; // Startspieler
let gameOver = false;

function init() {
  render();
}

function render() {
  let contentDiv = document.getElementById("content");
  let tableHTML = `<div class="board-wrapper"><table>`; //öffnet ein <div> und ein <table>, dies wird am Ende der Funktion wieder geschlossen

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

  tableHTML += `</table><svg class="overlay-line" width="100%" height="100%"></svg></div>`; // hier wird </table> geschlossen, ein svg eingefügt und die </div> geschlossen
  contentDiv.innerHTML = tableHTML;
}

function restartGame() {
  fields = [null, null, null, null, null, null, null, null, null];
  currentShape = "circle"; // Startspieler
  render();
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

  if (checkGameOver()) {
    gameOver = true;
    return;
  }

  // Spieler wechseln
  currentShape = currentShape === "circle" ? "cross" : "circle";
}

function checkGameOver() {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // horizontal
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // vertical
    [0, 4, 8],
    [2, 4, 6], // diagonal
  ];

  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
      drawWinningLine(pattern);
      return true;
    }
  }

  return false;
}

function drawWinningLine(indices) {
  const cells = document.querySelectorAll("td");
  const svg = document.querySelector(".overlay-line");

  // Alte Linie entfernen
  svg.innerHTML = "";

  const getCellCenter = (index) => {
    const rect = cells[index].getBoundingClientRect();
    const containerRect = svg.getBoundingClientRect();
    return {
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top + rect.height / 2,
    };
  };

  const start = getCellCenter(indices[0]);
  const end = getCellCenter(indices[2]);

  const svgNS = "http://www.w3.org/2000/svg";
  const line = document.createElementNS(svgNS, "line");

  line.setAttribute("x1", start.x);
  line.setAttribute("y1", start.y);
  line.setAttribute("x2", start.x);
  line.setAttribute("y2", start.y);
  line.setAttribute("stroke", "white");
  line.setAttribute("stroke-width", "6");
  line.setAttribute("stroke-linecap", "round");

  // Animation programmatisch hinzufügen
  const animateX = document.createElementNS(svgNS, "animate");
  animateX.setAttribute("attributeName", "x2");
  animateX.setAttribute("to", end.x);
  animateX.setAttribute("dur", "400ms");
  animateX.setAttribute("fill", "freeze");

  const animateY = document.createElementNS(svgNS, "animate");
  animateY.setAttribute("attributeName", "y2");
  animateY.setAttribute("to", end.y);
  animateY.setAttribute("dur", "400ms");
  animateY.setAttribute("fill", "freeze");

  line.appendChild(animateX);
  line.appendChild(animateY);
  svg.appendChild(line);
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
