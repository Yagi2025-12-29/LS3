// tools.js
// 工具の描画を担当するロジック
// [v2.2.5-INNER-TOOL-UPDATE] 内径工具の形状・位置をユーザー調整値に基づき更新
window.LS2_Tools = {
    drawOuter(ctx, bX, bY, isFinish = false) {
        ctx.save();

        // --- 1. チップの中心位置の設定 (USER TUNE) ---
        const offsetX = 5.5;
        const offsetY = 16.5;
        const rotateDeg = 90;

        const chipCenterX = bX + offsetX;
        const chipCenterY = bY + offsetY;

        // --- 2. シャンク（柄）の描画 ---
        ctx.fillStyle = '#333';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(bX - 5, bY + 15);
        ctx.lineTo(bX + 25, bY + 15);
        ctx.lineTo(bX + 25, bY + 65);
        ctx.lineTo(bX - 5, bY + 65);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // --- 3. チップ本体の描画 ---
        ctx.translate(chipCenterX, chipCenterY);
        ctx.scale(-1, 1);
        ctx.rotate(rotateDeg * Math.PI / 180);

        // チップポケット
        ctx.fillStyle = '#444';
        ctx.beginPath();
        const pW = 14.5, pH = 14.5, pS = 4;
        ctx.moveTo(-pW - pS, -pH); ctx.lineTo(pW - pS, -pH);
        ctx.lineTo(pW + pS, pH); ctx.lineTo(-pW + pS, pH);
        ctx.closePath();
        ctx.fill();

        // チップ
        ctx.fillStyle = isFinish ? "#C0C0C0" : "#FFD700";
        ctx.beginPath();
        const cW = 12, cH = 12, cS = 3.5;
        ctx.moveTo(-cW - cS, -cH); ctx.lineTo(cW - cS, -cH);
        ctx.lineTo(cW + cS, cH); ctx.lineTo(-cW + cS, cH);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = isFinish ? "#888" : "#B8860B";
        ctx.lineWidth = 1;
        ctx.stroke();

        // ボルト
        ctx.fillStyle = '#C0C0C0';
        ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#000'; ctx.stroke();
        ctx.fillStyle = '#222';
        ctx.beginPath(); ctx.arc(0, 0, 2, 0, Math.PI * 2); ctx.fill();

        ctx.restore();
    },

    drawInner(ctx, bX, bY, isFinish = false) {
        ctx.save();

        // --- 1. チップの中心位置の設定 (USER TUNE for INNER) ---
        const offsetX = 16.5;
        const offsetY = 15.5;
        const rotateDeg = 185;

        const chipCenterX = bX + offsetX;
        const chipCenterY = bY + offsetY;

        // --- 2. シャンク（長方形ボーリングバー）の描画 ---
        const shankLen = 200;
        const shankThick = 20;
        const shankYPos = 25;

        ctx.fillStyle = '#333';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;

        // 切削ポイント(bX, bY)を基準とした長方形
        ctx.fillRect(bX + 5, bY + shankYPos - (shankThick / 2), shankLen, shankThick);
        ctx.strokeRect(bX + 5, bY + shankYPos - (shankThick / 2), shankLen, shankThick);

        // --- 3. チップ本体の描画 ---
        ctx.translate(chipCenterX, chipCenterY);
        ctx.scale(1, 1); // 左右反転なし
        ctx.rotate(rotateDeg * Math.PI / 180);

        // チップポケット
        ctx.fillStyle = '#444';
        ctx.beginPath();
        const pW = 14.5, pH = 14.5, pS = 4;
        ctx.moveTo(-pW - pS, -pH); ctx.lineTo(pW - pS, -pH);
        ctx.lineTo(pW + pS, pH); ctx.lineTo(-pW + pS, pH);
        ctx.closePath();
        ctx.fill();

        // チップ (内径用: 黄色/荒, グレー/仕上)
        ctx.fillStyle = isFinish ? "#C0C0C0" : "#FFD700";
        ctx.beginPath();
        const cW = 12, cH = 12, cS = 3.5;
        ctx.moveTo(-cW - cS, -cH); ctx.lineTo(cW - cS, -cH);
        ctx.lineTo(cW + cS, cH); ctx.lineTo(-cW + cS, cH);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = isFinish ? "#888" : "#B8860B";
        ctx.lineWidth = 1;
        ctx.stroke();

        // ボルト
        ctx.fillStyle = '#C0C0C0';
        ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#000'; ctx.stroke();
        ctx.fillStyle = '#111';
        ctx.beginPath(); ctx.arc(0, 0, 2, 0, Math.PI * 2); ctx.fill();

        ctx.restore();
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
        const tw = 40;
        const th = 20;
        const sl = 30;

        ctx.fillStyle = "#f1c40f"; // 工業用イエロー
        ctx.strokeStyle = "#d4ac0d";
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(bX, bY); // 先端 (90度頂点)
        ctx.lineTo(bX + (tw / 2), bY + th); // 右肩
        ctx.lineTo(bX + (tw / 2), bY + th + sl); // 右下
        ctx.lineTo(bX - (tw / 2), bY + th + sl); // 左下
        ctx.lineTo(bX - (tw / 2), bY + th); // 左肩
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    },

    drawDrill(ctx, bX, bY, isCenter = false) {
        ctx.fillStyle = "#FFD700";
        ctx.strokeStyle = "#d4ac0d";
        ctx.lineWidth = 1;

        if (isCenter) {
            // センタードリル (A型 60度)
            const pL = 10;  // 先端ドリル長 (2mm)
            const pR = 2.5; // 先端ドリル径R (1d -> 0.5R = 2.5px)
            const cL = 34.6;// 面取り部高 (6.93mm -> 34.6px)
            const sR = 22.5;// シャンク径R (9D -> 4.5R = 22.5px)
            const sL = 100; // シャンク長 (表示用)

            ctx.beginPath();
            // 先端から順に
            ctx.moveTo(bX, bY - pR);
            ctx.lineTo(bX + pL, bY - pR);
            ctx.lineTo(bX + pL + cL, bY - sR);
            ctx.lineTo(bX + pL + cL + sL, bY - sR);
            ctx.lineTo(bX + pL + cL + sL, bY + sR);
            ctx.lineTo(bX + pL + cL, bY + sR);
            ctx.lineTo(bX + pL, bY + pR);
            ctx.lineTo(bX, bY + pR);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // センターライン（刃先の分割感）
            ctx.beginPath();
            ctx.moveTo(bX, bY);
            ctx.lineTo(bX + pL + cL + sL, bY);
            ctx.strokeStyle = "rgba(0,0,0,0.1)";
            ctx.stroke();

            // 刃先先端線
            ctx.beginPath();
            ctx.moveTo(bX, bY - pR);
            ctx.lineTo(bX, bY + pR);
            ctx.strokeStyle = "#d4ac0d";
            ctx.stroke();

        } else {
            // 普通のドリル (Φ25 -> R12.5mm -> 62.5px)
            const radius = 62.5;
            ctx.beginPath();
            ctx.moveTo(bX, bY);
            ctx.lineTo(bX + 20, bY - radius);
            ctx.lineTo(bX + 250, bY - radius);
            ctx.lineTo(bX + 250, bY + radius);
            ctx.lineTo(bX + 20, bY + radius);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // ドリルの溝っぽい装飾
            ctx.beginPath();
            ctx.moveTo(bX + 20, bY - radius * 0.4);
            ctx.lineTo(bX + 250, bY - radius * 0.4);
            ctx.moveTo(bX + 20, bY + radius * 0.4);
            ctx.lineTo(bX + 250, bY + radius * 0.4);
            ctx.strokeStyle = "rgba(0,0,0,0.1)";
            ctx.stroke();

            ctx.fillStyle = "#555";
            ctx.fillRect(bX + 250, bY - 25, 80, 50);
        }
    },

    drawParting(ctx, bX, bY) {
        ctx.fillStyle = "#ffd700";
        ctx.fillRect(bX - 10, bY, 20, 60);
        ctx.strokeStyle = "#fff"; ctx.strokeRect(bX - 10, bY, 20, 60);
    }
};
