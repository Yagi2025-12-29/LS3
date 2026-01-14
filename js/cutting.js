// cutting.js
// [v2.2.8-DRILL-LOGIC-FIX] ドリルの対象プロファイル（内径）と範囲の修正
window.LS2_Cut = {
    simulate() {
        const st = window.LS2_State;
        const type = document.getElementById("toolSelect").value;

        // 現在の位置と前回の位置
        const combinedZ = st.realPos.z + st.realPos.s;
        const prevZ = st.prevPos.z + st.prevPos.s;

        const zMin = Math.min(combinedZ, prevZ);
        const zMax = Math.max(combinedZ, prevZ);

        const limitZ = st.work.out * st.mmToPx;
        const toolRadius = Math.abs(st.realPos.x);

        // ネジ切り定数
        const pitchMm = 2.5;
        const pitchPx = pitchMm * st.mmToPx;
        const half = pitchPx / 2;
        const tan30 = Math.tan(30 * Math.PI / 180);

        // 判定範囲バッファ
        let buffer = 2;
        if (type === "parting") buffer = 10;
        if (type === "chamfer") buffer = 21; // 縮小に合わせてバッファも21に
        if (type === "centerDrill" || type === "drill25") buffer = 45;

        const loopStart = Math.round(zMin - (type === "thread" ? 0 : buffer));
        const loopEnd = Math.round(zMax + (type === "thread" ? 0 : buffer));

        st.isContact = false;

        for (let z = loopStart; z <= loopEnd; z++) {
            if (z < 0 || z >= limitZ) continue;

            const dz = z - combinedZ;

            if (type === "thread") {
                // 【ネジ切り】
                const baseR = st.threadBaseProfile[z];
                const depthPx = Math.max(0, baseR - toolRadius);
                let local = z % pitchPx;
                if (local < 0) local += pitchPx;
                const offsetPx = st.realPos.s * st.mmToPx;
                const localRel = local - (half + offsetPx);
                const distFromTip = Math.abs(localRel);
                const heightAtDist = depthPx - (distFromTip / tan30);

                if (heightAtDist > 0) {
                    st.isContact = true;
                    const targetR = baseR - heightAtDist;
                    if (targetR < st.workpieceProfile[z]) {
                        st.workpieceProfile[z] = targetR;
                    }
                }
            } else if (type === "chamfer") {
                // 【面取り：90度V形】
                const chamferR = toolRadius + Math.abs(dz);
                if (chamferR <= st.workpieceProfile[z] + 1) st.isContact = true;
                if (chamferR < st.workpieceProfile[z]) {
                    st.workpieceProfile[z] = chamferR;
                }
            } else if (type === "parting") {
                // 【突切り】
                if (Math.abs(dz) <= 10 || (z >= zMin - 10 && z <= zMax + 10)) {
                    if (toolRadius <= st.workpieceProfile[z] + 1) st.isContact = true;
                    if (toolRadius < st.workpieceProfile[z]) st.workpieceProfile[z] = toolRadius;
                }
            } else if (type === "centerDrill") {
                // 【センタードリル：段付き・テーパー切削】
                // ターゲットは innerProfile
                let localR = 0;
                const pL = 10;  // 2mm
                const pR = 2.5; // 0.5mm
                const cL = 34.6;// 6.93mm
                const sR = 22.5;// 4.5mm
                if (dz < 0) {
                    localR = 0;
                } else if (dz <= pL) {
                    localR = pR;
                } else if (dz <= pL + cL) {
                    localR = pR + (sR - pR) * (dz - pL) / cL;
                } else {
                    localR = sR;
                }
                if (localR > 0) {
                    if (localR >= st.innerProfile[z] - 1) st.isContact = true;
                    if (localR > st.innerProfile[z] && localR < st.workpieceProfile[z]) {
                        st.innerProfile[z] = localR;
                    }
                }
            } else if (type === "drill25") {
                // 【Φ25ドリル：内径切削】
                const drillR = 62.5; // Φ25 = 12.5mm = 62.5px
                // dz >= 0 (ドリルの先端から右側) かつ 今回の移動範囲内
                if (dz >= 0 && (Math.abs(dz) < 2 || (z >= zMin && z <= zMax))) {
                    if (drillR >= st.innerProfile[z] - 1) st.isContact = true;
                    if (drillR > st.innerProfile[z] && drillR < st.workpieceProfile[z]) {
                        st.innerProfile[z] = drillR;
                    }
                }
            } else if (type.startsWith("inner")) {
                // 【内径ボーリング：内径切削】
                if (Math.abs(dz) < 2 || (z >= zMin && z <= zMax)) {
                    if (toolRadius >= st.innerProfile[z] - 1) st.isContact = true;
                    if (toolRadius > st.innerProfile[z] && toolRadius < st.workpieceProfile[z]) {
                        st.innerProfile[z] = toolRadius;
                    }
                }
            } else {
                // 【外径一般：外径切削】
                // outerRough, outerFinish など
                if (Math.abs(dz) < 2 || (z >= zMin && z <= zMax)) {
                    if (toolRadius <= st.workpieceProfile[z] + 1) st.isContact = true;
                    if (toolRadius < st.workpieceProfile[z]) {
                        st.workpieceProfile[z] = toolRadius;
                        if (z < 2) st.step1.faceCut = true;
                    }
                }
            }
        }
        st.prevPos.z = st.realPos.z;
        st.prevPos.s = st.realPos.s;
    },

    lockThreadBase() {
        const st = window.LS2_State;
        for (let i = 0; i < st.workpieceProfile.length; i++) {
            st.threadBaseProfile[i] = st.workpieceProfile[i];
        }
    }
};
