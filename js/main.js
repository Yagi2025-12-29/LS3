// [v2.0-HAND-WHEEL] (イベント紐付け)
// main.js
(function initApp() {
    window.setRelativeZero = (axis) => window.LS2_UI.setRelativeZero(axis);
    window.initWork = () => window.LS2_UI.initWork();
    window.toggleFeed = () => window.LS2_Sim.toggleFeed();

    window.checkToolMode = () => {
        const st = window.LS2_State;
        const type = document.getElementById("toolSelect").value;
        st.isHalfNutOn = (type === "thread");

        const wheelZ = document.getElementById("wheel-z");
        if (wheelZ) wheelZ.style.opacity = st.isHalfNutOn ? "0.3" : "1.0";

        if (type.toLowerCase().includes("drill")) {
            st.realPos.x = 0;
            window.LS2_UI.updateDRO();
        }

        if (type === "thread") {
            window.LS2_Cut.lockThreadBase();
        }

        const area = document.getElementById("mode-switch-area");
        if (st.isHalfNutOn) {
            area.innerHTML = `<div class="thread-ctrl-box" style="display:flex; flex-direction:column; gap:4px; height:100%;">
                <button class="btn-thread" onmousedown="LS2_State.threadMoveDir=-1" onmouseup="LS2_State.threadMoveDir=0" style="flex:1; background:#004400; color:#0f0; border:1px solid #0f0; font-size:10px; font-weight:bold; border-radius:5px;">正転 (送り)</button>
                <button class="btn-thread" onmousedown="LS2_State.threadMoveDir=1" onmouseup="LS2_State.threadMoveDir=0" style="flex:1; background:#004400; color:#0f0; border:1px solid #0f0; font-size:10px; font-weight:bold; border-radius:5px;">逆転 (戻り)</button>
            </div>`;
        } else {
            area.innerHTML = `<button id="feed-btn" onclick="toggleFeed()">AUTO FEED<br>ON/OFF</button>`;
        }
        window.LS2_UI.updateDRO();
        window.LS2_Render.draw();
    };

    // ハンドルのイベント紐付け
    function bindWheelEvent(axis) {
        const wheel = document.getElementById(`wheel-${axis}`);
        if (!wheel) return;

        const st = window.LS2_State;
        const ui = window.LS2_UI;
        let isDragging = false;

        const onStart = (e) => {
            isDragging = true;
            st.angles[axis].lastInput = ui.getEventAngle(e, wheel);
            if (e.cancelable) e.preventDefault();
        };

        const onMove = (e) => {
            if (!isDragging) return;
            const currentInput = ui.getEventAngle(e, wheel);
            let delta = currentInput - st.angles[axis].lastInput;

            if (delta > 180) delta -= 360;
            if (delta < -180) delta += 360;

            st.angles[axis].current += delta;
            st.angles[axis].lastInput = currentInput;

            ui.updatePhysicalPos(axis, delta);
            ui.drawWheel(axis);
            if (e.cancelable) e.preventDefault();
        };

        const onEnd = () => { isDragging = false; };

        wheel.addEventListener('mousedown', onStart);
        wheel.addEventListener('touchstart', onStart, { passive: false });
        window.addEventListener('mousemove', onMove);
        window.addEventListener('touchmove', onMove, { passive: false });
        window.addEventListener('mouseup', onEnd);
        window.addEventListener('touchend', onEnd);
    }

    window.onload = () => {
        window.LS2_UI.initWork();

        // 3軸のハンドルを初期化
        bindWheelEvent("z");
        bindWheelEvent("x");
        bindWheelEvent("s");

        window.LS2_Sim.start();
    };
})();
