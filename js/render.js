// render.js
// キャンバスへの描画を担当
window.LS2_Render = {
    draw() {
        const st = window.LS2_State;
        const canvas = document.getElementById("latheCanvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        const midY = 200;
        const chuckX = 150;

        ctx.clearRect(0, 0, 800, 400);

        // 背景
        ctx.fillStyle = "#1a1a1a";
        ctx.fillRect(0, 0, 800, 400);

        // チャック
        ctx.fillStyle = "#333";
        ctx.fillRect(0, midY - 125, chuckX, 250);

        // ワーク（プロファイル）の描画
        const limitZ = st.work.out * st.mmToPx;
        ctx.fillStyle = "#aaa";
        for (let z = 0; z < limitZ; z++) {
            const outerR = st.workpieceProfile[z];
            const innerR = st.innerProfile[z];
            const xPos = chuckX + z;

            // 外径部
            ctx.fillRect(xPos, midY - outerR, 1, outerR - innerR);
            ctx.fillRect(xPos, midY + innerR, 1, outerR - innerR);

            // 内径部（穴の中を暗く）
            if (innerR > 0) {
                ctx.fillStyle = "#444";
                ctx.fillRect(xPos, midY - innerR, 1, innerR * 2);
                ctx.fillStyle = "#aaa";
            }
        }

        // 中心線
        ctx.setLineDash([5, 5]); ctx.strokeStyle = "#444";
        ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(800, midY); ctx.stroke();
        ctx.setLineDash([]);

        // 工具
        const type = document.getElementById("toolSelect").value;
        const combinedZ = st.realPos.z + st.realPos.s;
        const bX = chuckX + combinedZ;
        const bY = midY + st.realPos.x;

        ctx.save();
        const tools = window.LS2_Tools;
        if (type === "outerRough") tools.drawOuter(ctx, bX, bY, false);
        if (type === "outerFinish") tools.drawOuter(ctx, bX, bY, true);
        if (type === "innerRough") tools.drawInner(ctx, bX, bY, false);
        if (type === "innerFinish") tools.drawInner(ctx, bX, bY, true);
        if (type === "thread") tools.drawThread(ctx, bX, bY);
        if (type === "chamfer") tools.drawChamfer(ctx, bX, bY);
        if (type === "centerDrill") tools.drawDrill(ctx, bX, midY, true);
        if (type === "drill25") tools.drawDrill(ctx, bX, midY, false);
        if (type === "parting") tools.drawParting(ctx, bX, bY);
        ctx.restore();

        // 【追加】接触ランプの更新
        const lamp = document.getElementById("contact-lamp");
        if (lamp) {
            if (st.isContact) {
                lamp.style.background = "#ff3333";
                lamp.style.boxShadow = "0 0 8px #ff0000";
            } else {
                lamp.style.background = "#222";
                lamp.style.boxShadow = "none";
            }
        }

        // 【追加】火花エフェクト（接触中のみ）
        if (st.isContact) {
            const tipY = (type.startsWith("inner") || type.includes("Drill")) ? midY : (midY - Math.abs(st.realPos.x));
            ctx.strokeStyle = "#ffcc00";
            ctx.lineWidth = 1;
            for (let i = 0; i < 6; i++) {
                ctx.beginPath();
                ctx.moveTo(bX, tipY);
                ctx.lineTo(bX + (Math.random() - 0.5) * 20, tipY + (Math.random() - 1.0) * 20);
                ctx.stroke();
            }
        }
    }
};
