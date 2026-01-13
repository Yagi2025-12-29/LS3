// tools.js
// 工具の描画のみを担当するロジック
window.LS2_Tools = {
    drawOuter(ctx, bX, bY) {
        ctx.fillStyle = "#ffcc00";
        ctx.beginPath();
        ctx.moveTo(bX, bY);
        ctx.lineTo(bX + 5, bY + 40);
        ctx.lineTo(bX + 35, bY + 30);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "#fff"; ctx.stroke();
    },

    drawInner(ctx, bX, bY) {
        ctx.fillStyle = "#ffcc00";
        ctx.beginPath();
        ctx.moveTo(bX, bY);
        ctx.lineTo(bX + 5, bY - 35);
        ctx.lineTo(bX + 80, bY - 30);
        ctx.lineTo(bX + 80, bY - 10);
        ctx.lineTo(bX + 10, bY - 10);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "#fff"; ctx.stroke();
    },

    drawThread(ctx, bX, bY) {
        ctx.fillStyle = "#ffd700";
        ctx.beginPath();
        ctx.moveTo(bX, bY);
        ctx.lineTo(bX + 12, bY + 25);
        ctx.lineTo(bX - 12, bY + 25);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "#fff"; ctx.stroke();
    },

    drawChamfer(ctx, bX, bY) {
        ctx.fillStyle = "#ffd700";
        ctx.beginPath();
        ctx.moveTo(bX, bY);
        ctx.lineTo(bX + 40, bY + 40); // 右側に45度の斜面
        ctx.lineTo(bX + 40, bY + 60);
        ctx.lineTo(bX - 10, bY + 60);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "#fff"; ctx.stroke();
    },

    drawDrill(ctx, bX, bY, isCenter = false) {
        ctx.fillStyle = "#ffd700";
        const radius = isCenter ? 6 : 31;
        ctx.beginPath();
        ctx.moveTo(bX, bY);
        ctx.lineTo(bX + 15, bY - radius);
        ctx.lineTo(bX + 150, bY - radius);
        ctx.lineTo(bX + 150, bY + radius);
        ctx.lineTo(bX + 15, bY + radius);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#555"; ctx.fillRect(bX + 150, bY - 15, 80, 30);
    },

    drawParting(ctx, bX, bY) {
        ctx.fillStyle = "#ffd700";
        ctx.fillRect(bX - 10, bY, 20, 60);
        ctx.strokeStyle = "#fff"; ctx.strokeRect(bX - 10, bY, 20, 60);
    }
};
