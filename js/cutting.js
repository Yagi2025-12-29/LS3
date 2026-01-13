// [v1.7-PRECISION-X] (ネジ切り先端中心化・X軸0.1mm化)
// cutting.js
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

        // 判定範囲：ネジ切りは「先端」でのみ削るため、スイープ範囲(zMin-zMax)を正確に守る
        let buffer = 2;
        if (type === "parting") buffer = 10; // 突切りの刃幅判定用

        const loopStart = Math.round(zMin - (type === "thread" ? 0 : buffer));
        const loopEnd = Math.round(zMax + (type === "thread" ? 0 : buffer));

        st.isContact = false;

        for (let z = loopStart; z <= loopEnd; z++) {
            if (z < 0 || z >= limitZ) continue;

            const dz = z - combinedZ;

            if (type === "thread") {
                // 【ネジ切り：厳密に先端の移動軌跡(zMin〜zMax)のみを削る】
                const baseR = st.threadBaseProfile[z];
                const depthPx = Math.max(0, baseR - toolRadius);

                // 現在の地点zに最も近い「バイトの通過点」を特定
                // スイープ中であればその点の位相、そうでなければ現在の刃先の位相
                const targetZ = Math.max(zMin, Math.min(z, zMax));

                let local = z % pitchPx;
                if (local < 0) local += pitchPx;

                // 小ハンドル(S)のオフセットを適用
                const offsetPx = st.realPos.s * st.mmToPx;
                const localRel = local - (half + offsetPx);
                const distFromTip = Math.abs(localRel);

                // 60度物理計算：頂点(localRel=0)が最も深く削れる
                const heightAtDist = depthPx - (distFromTip / tan30);

                if (heightAtDist > 0) {
                    st.isContact = true;
                    const targetR = baseR - heightAtDist;
                    if (targetR < st.workpieceProfile[z]) {
                        st.workpieceProfile[z] = targetR;
                    }
                }

            } else if (type === "chamfer") {
                const chamferR = toolRadius + Math.max(0, dz);
                if (chamferR <= st.workpieceProfile[z] + 1) st.isContact = true;
                if (chamferR < st.workpieceProfile[z]) {
                    st.workpieceProfile[z] = chamferR;
                }

            } else if (type === "parting") {
                if (Math.abs(dz) <= 10 || (z >= zMin - 10 && z <= zMax + 10)) {
                    if (toolRadius <= st.workpieceProfile[z] + 1) st.isContact = true;
                    if (toolRadius < st.workpieceProfile[z]) st.workpieceProfile[z] = toolRadius;
                }

            } else if (type.startsWith("inner")) {
                if (Math.abs(dz) < 2 || (z >= zMin && z <= zMax)) {
                    if (toolRadius >= st.innerProfile[z] - 1) st.isContact = true;
                    if (toolRadius > st.innerProfile[z] && toolRadius < st.workpieceProfile[z]) {
                        st.innerProfile[z] = toolRadius;
                    }
                }
            } else if (type.toLowerCase().includes("drill")) {
                const drillR = type === "centerDrill" ? 6 : 31;
                if (Math.abs(dz) < 2 || (z >= zMin && z <= zMax)) {
                    if (drillR >= st.innerProfile[z] - 1) st.isContact = true;
                    if (drillR > st.innerProfile[z]) st.innerProfile[z] = drillR;
                }
            } else {
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
