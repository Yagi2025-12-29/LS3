// [v2.0-HAND-WHEEL] (手回しハンドル連動・累積回転ロジック)
// ui.js
window.LS2_UI = {
    updateDRO() {
        const st = window.LS2_State;
        const type = document.getElementById("toolSelect").value;

        const dispZ = (st.realPos.z - st.zeroRef.z) / 5;
        const dispX = ((st.realPos.x - st.zeroRef.x) * 2) / 5;
        const dispS = (st.realPos.s - st.zeroRef.s) / 5;

        // ハンドル中央のデジタル表示を更新
        const valZ = document.getElementById("valZ");
        const valX = document.getElementById("valX");
        const valS = document.getElementById("valS");

        if (valZ) valZ.innerText = dispZ.toFixed(1);
        if (valX) valX.innerText = dispX.toFixed(1);
        if (valS) {
            if (type === "thread") valS.innerText = dispS.toFixed(2);
            else valS.innerText = dispS.toFixed(1);
        }
    },

    setRelativeZero(axis) {
        const st = window.LS2_State;
        st.zeroRef[axis] = st.realPos[axis];
        if (axis === "z") st.step1.zZero = true;
        this.updateDRO();
    },

    // ハンドルの物理的な回転描画
    drawWheel(axis) {
        const st = window.LS2_State;
        const wheel = document.getElementById(`wheel-${axis}`);
        if (!wheel) return;

        // 軸ごとのスナップ単位 (0.1mm または 0.05mm)
        let mmPerStep = 0.1;
        let revRatio = 22; // デフォルトはZの22mm/rev
        if (axis === "x") { mmPerStep = 0.05; revRatio = 2.5; } // Xは1周で直径5mm(半径2.5mm)
        if (axis === "s") { mmPerStep = 0.1; revRatio = 3; }

        const degPerStep = 360 / (revRatio / mmPerStep);
        const snappedAngle = Math.round(st.angles[axis].current / degPerStep) * degPerStep;
        wheel.style.transform = `rotate(${snappedAngle}deg)`;
    },

    // 角度の変化を座標に反映
    updatePhysicalPos(axis, deltaAngle) {
        const st = window.LS2_State;
        const type = document.getElementById("toolSelect").value;

        let revRatio = 22;
        if (axis === "x") revRatio = 2.5;
        if (axis === "s") revRatio = 3;

        const deltaMm = (deltaAngle / 360) * revRatio;
        const deltaPx = deltaMm * st.mmToPx;

        if (axis === "z") {
            if (st.isHalfNutOn) return;
            st.realPos.z += deltaPx;
        } else if (axis === "x") {
            if (type.toLowerCase().includes("drill")) return;
            st.realPos.x -= deltaPx; // 半径減＝中心方向
        } else if (axis === "s") {
            st.realPos.s -= deltaPx;
        }

        window.LS2_Cut.simulate();
        this.updateDRO();
        window.LS2_Render.draw();
    },

    getEventAngle(e, element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
    },

    initWork() {
        const st = window.LS2_State;
        const val = document.getElementById("workSelect").value;
        if (val === "60") st.work = { d: 60, out: 46, grab: 12 };
        else if (val === "50") st.work = { d: 50, out: 65, grab: 25 };
        else if (val === "50t") st.work = { d: 50, out: 45, grab: 45 };

        const rPx = (st.work.d / 2) * 5;
        st.workpieceProfile.fill(rPx);
        st.innerProfile.fill(0);

        st.realPos.z = 450;
        st.realPos.s = 0;
        st.realPos.x = rPx + 20;

        st.prevPos.z = st.realPos.z;
        st.prevPos.s = st.realPos.s;

        this.setRelativeZero("x");
        this.setRelativeZero("z");
        this.setRelativeZero("s");
        window.LS2_Render.draw();
    }
};
