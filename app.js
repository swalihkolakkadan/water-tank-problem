const CELL_SIZE = 40;
const CELL_GAP = 2;

const EMPTY = "empty";
const BLOCK = "block";
const WATER = "water";

function parseInput(raw) {
  return raw.split(",").map((s) => {
    const n = Number(s.trim());
    if (isNaN(n) || n < 0 || !Number.isInteger(n)) {
      throw new Error(`Invalid input: "${s.trim()}"`);
    }
    return n;
  });
}

function buildMatrix(height, waterPerColumn) {
  const maxH = Math.max(...height, 1);
  const cols = height.length;
  const grid = [];

  for (let row = 0; row < maxH; row++) {
    grid[row] = [];
    for (let col = 0; col < cols; col++) {
      const currentHeight = maxH - row;
      if (currentHeight <= height[col]) {
        grid[row][col] = BLOCK;
      } else if (currentHeight <= height[col] + waterPerColumn[col]) {
        grid[row][col] = WATER;
      } else {
        grid[row][col] = EMPTY;
      }
    }
  }

  return { grid, maxH, cols };
}

function buildSVG(height, waterPerColumn) {
  const { grid, maxH, cols } = buildMatrix(height, waterPerColumn);
  const svgW = cols * (CELL_SIZE + CELL_GAP) + CELL_GAP;
  const svgH = (maxH + 1) * (CELL_SIZE + CELL_GAP) + CELL_GAP;

  let rects = "";

  for (let row = 0; row < maxH; row++) {
    for (let col = 0; col < cols; col++) {
      if (grid[row][col] === EMPTY) continue;

      const x = CELL_GAP + col * (CELL_SIZE + CELL_GAP);
      const y = CELL_GAP + row * (CELL_SIZE + CELL_GAP);

      if (grid[row][col] === BLOCK) {
        rects += `<rect x="${x}" y="${y}" width="${CELL_SIZE}" height="${CELL_SIZE}" rx="4" fill="#6c5b7b"/>`;
      } else {
        rects += `<rect x="${x}" y="${y}" width="${CELL_SIZE}" height="${CELL_SIZE}" rx="4" fill="#4cc9f0" opacity="0.7"/>`;
      }
    }
  }

  for (let col = 0; col < cols; col++) {
    const x = CELL_GAP + col * (CELL_SIZE + CELL_GAP);
    const labelY = maxH * (CELL_SIZE + CELL_GAP) + CELL_GAP + CELL_SIZE / 2 + 4;
    rects += `<text x="${x + CELL_SIZE / 2}" y="${labelY}" text-anchor="middle" fill="#888" font-size="12">${height[col]}</text>`;
  }

  return `<svg width="${svgW}" height="${svgH + 20}" viewBox="0 0 ${svgW} ${svgH + 20}">${rects}</svg>`;
}

function run() {
  const errorEl = document.getElementById("error");
  const resultEl = document.getElementById("result");
  const vizEl = document.getElementById("visualization");
  const raw = document.getElementById("heightInput").value.trim();

  errorEl.textContent = "";

  try {
    const height = parseInput(raw);
    if (height.length === 0) throw new Error("Empty input");

    const { total, waterPerColumn } = waterTankAlgorithm(height);

    resultEl.innerHTML = `Water trapped: <span>${total} unit${total !== 1 ? "s" : ""}</span>`;
    vizEl.innerHTML = buildSVG(height, waterPerColumn);
  } catch (e) {
    errorEl.textContent =
      "Please enter comma-separated non-negative integers (e.g. 0,4,0,0,0,6,0,6,4,0)";
    resultEl.innerHTML = "";
    vizEl.innerHTML = "";
  }
}

document.getElementById("computeBtn").addEventListener("click", run);
document.getElementById("heightInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") run();
});

run();
