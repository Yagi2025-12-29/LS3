// simulate.js
// 周期的な計算（送り・ネジ切り）を担当
window.LS2_Sim = {
    start() {
        setInterval(() => {
            const st = window.LS2_State;
            const rpm = parseInt(document.getElementById("rpmSelect").value);

            if (rpm > 0) {
                if (st.isFeedOn) {
                    const p = parseFloat(document.getElementById("gearSelect").value);
                    if (p > 0) {
                        const deltaPx = -(rpm / 3600) * p * 5;
                        st.realPos.z += deltaPx;
                        // ハンドルの回転を同期 (22mm = 360deg)
                        const deltaDeg = (deltaPx / 5) / 22 * 360;
                        st.angles.z.current += deltaDeg;
                    }
                } else if (st.isHalfNutOn && st.threadMoveDir !== 0) {
                    const deltaPx = (rpm / 3600) * 2.5 * st.threadMoveDir * 5;
                    st.realPos.z += deltaPx;
                    const deltaDeg = (deltaPx / 5) / 22 * 360;
                    st.angles.z.current += deltaDeg;
                }

                window.LS2_Cut.simulate();
            }

            window.LS2_UI.updateDRO();
            window.LS2_UI.drawWheel("z"); // 自動移動でもハンドルを回す
            window.LS2_Render.draw();
        }, 20);
    },

    toggleFeed() {
        const st = window.LS2_State;
        if (st.isHalfNutOn) return;
        st.isFeedOn = !st.isFeedOn;
        const fb = document.getElementById("feed-btn");
        if (fb) fb.classList.toggle("btn-active", st.isFeedOn);
    }
};
