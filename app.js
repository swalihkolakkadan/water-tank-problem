const CELL_SIZE = 40;
const CELL_GAP = 2;

function parseInput(raw) {
    return raw.split(',').map((s) => {
        const n = Number(s.trim());
        if (isNaN(n) || n < 0 || !Number.isInteger(n)) {
            throw new Error(`Invalid input: "${s.trim()}"`);
        }
        return n;
    });
}

function buildSVG(height, waterPerColumn) {
    const maxH = Math.max(...height, 1);
    const cols = height.length;
    const svgW = cols * (CELL_SIZE + CELL_GAP) + CELL_GAP;
    const svgH = (maxH + 1) * (CELL_SIZE + CELL_GAP) + CELL_GAP;

    let rects = '';

    for (let col = 0; col < cols; col++) {
        const x = CELL_GAP + col * (CELL_SIZE + CELL_GAP);
        const blockH = height[col];
        const waterH = waterPerColumn[col];

        for (let row = 0; row < waterH; row++) {
            const wy = (maxH - blockH - row - 1) * (CELL_SIZE + CELL_GAP) + CELL_GAP;
            rects += `<rect x="${x}" y="${wy}" width="${CELL_SIZE}" height="${CELL_SIZE}" rx="4" fill="#4cc9f0" opacity="0.7"/>`;
        }

        for (let row = 0; row < blockH; row++) {
            const by = (maxH - row - 1) * (CELL_SIZE + CELL_GAP) + CELL_GAP;
            rects += `<rect x="${x}" y="${by}" width="${CELL_SIZE}" height="${CELL_SIZE}" rx="4" fill="#6c5b7b"/>`;
        }

        const labelY = maxH * (CELL_SIZE + CELL_GAP) + CELL_GAP + CELL_SIZE / 2 + 4;
        rects += `<text x="${x + CELL_SIZE / 2}" y="${labelY}" text-anchor="middle" fill="#888" font-size="12">${height[col]}</text>`;
    }

    return `<svg width="${svgW}" height="${svgH + 20}" viewBox="0 0 ${svgW} ${svgH + 20}">${rects}</svg>`;
}

function run() {
    const errorEl = document.getElementById('error');
    const resultEl = document.getElementById('result');
    const vizEl = document.getElementById('visualization');
    const raw = document.getElementById('heightInput').value.trim();

    errorEl.textContent = '';

    try {
        const height = parseInput(raw);
        if (height.length === 0) throw new Error('Empty input');

        const { total, waterPerColumn } = waterTankAlgorithm(height);

        resultEl.innerHTML = `Water trapped: <span>${total} unit${total !== 1 ? 's' : ''}</span>`;
        vizEl.innerHTML = buildSVG(height, waterPerColumn);
    } catch (e) {
        errorEl.textContent =
            'Please enter comma-separated non-negative integers (e.g. 0,4,0,0,0,6,0,6,4,0)';
        resultEl.innerHTML = '';
        vizEl.innerHTML = '';
    }
}

document.getElementById('computeBtn').addEventListener('click', run);
document.getElementById('heightInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') run();
});

run();
