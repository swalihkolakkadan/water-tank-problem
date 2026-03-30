function waterTankAlgorithm(height) {
    const maxLeft = [];
    const maxRight = [];

    for (let i = 0; i < height.length; i++) {
        maxLeft[i] = Math.max(height[i], maxLeft[i - 1] || 0);
    }
    for (let i = height.length - 1; i >= 0; i--) {
        maxRight[i] = Math.max(height[i], maxRight[i + 1] || 0);
    }

    const waterPerColumn = height.map(
        (h, i) => Math.min(maxLeft[i], maxRight[i]) - h
    );
    const total = waterPerColumn.reduce((sum, w) => sum + w, 0);

    return { waterPerColumn, total };
}
