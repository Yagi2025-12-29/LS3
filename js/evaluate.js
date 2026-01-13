// evaluate.js
import { machineState } from "./state.js";

// steps.json を読み込む
let steps = [];
fetch("./steps.json")
    .then(res => res.json())
    .then(json => {
        steps = json;
        loadStep(1); // 最初のステップを読み込む
    });

// ================================
// ステップ読み込み
// ================================
export function loadStep(stepId) {
    const step = steps.find(s => s.id === stepId);
    if (!step) return;

    machineState.currentStep = stepId;

    // ミッション文を表示
    const msg = document.getElementById("mission-text");
    msg.innerHTML = `【STEP${stepId}】${step.title}<br>${step.description}`;
}

// ================================
// 条件チェック
// ================================
export function evaluateStep() {
    const stepId = machineState.currentStep;
    const step = steps.find(s => s.id === stepId);
    if (!step) return;

    const cond = step.conditions;

    // ----------------------------
    // 条件1：工具
    // ----------------------------
    if (cond.toolId && machineState.toolId !== cond.toolId) {
        return showHint(step);
    }

    // ----------------------------
    // 条件2：Zゼロ設定
    // ----------------------------
    if (cond.zZero && !machineState.step1.zZero) {
        return showHint(step);
    }

    // ----------------------------
    // 条件3：端面切削
    // ----------------------------
    if (cond.faceCut && !machineState.step1.faceCut) {
        return showHint(step);
    }

    // ----------------------------
    // 条件4：外径（X位置）
    // ----------------------------
    if (cond.targetDiameter) {
        const currentDia = (machineState.realPos.x - machineState.zeroRef.x) * -2 / 5;
        if (currentDia > cond.targetDiameter + 0.2) {
            return showHint(step);
        }
    }

    // ----------------------------
    // 条件5：回転数
    // ----------------------------
    if (cond.rpmRange) {
        const rpm = parseInt(document.getElementById("rpmSelect").value);
        const [min, max] = cond.rpmRange;
        if (rpm < min || rpm > max) {
            return showHint(step);
        }
    }

    // ----------------------------
    // 条件6：面取り完了
    // ----------------------------
    if (cond.chamferDone && !machineState.step1.chamferDone) {
        return showHint(step);
    }

    // ----------------------------
    // 条件7：ネジ切り完了
    // ----------------------------
    if (cond.threadDone && !machineState.step1.threadDone) {
        return showHint(step);
    }

    // ----------------------------
    // すべての条件を満たした → 次へ
    // ----------------------------
    goNextStep(step);
}

// ================================
// 不正解 → ヒント表示
// ================================
function showHint(step) {
    const msg = document.getElementById("mission-text");
    msg.innerHTML = `
        【STEP${step.id}】${step.title}<br>
        ${step.description}<br>
        <span style="color:#ff4444;">ヒント：${step.onWrong.hint}</span>
    `;
}

// ================================
// 正解 → 次のステップへ
// ================================
function goNextStep(step) {
    if (step.onCorrect === "finish") {
        const msg = document.getElementById("mission-text");
        msg.innerHTML = `
            🎉 <b>全STEPクリア！</b><br>
            お疲れさまでした！
        `;
        return;
    }

    loadStep(step.onCorrect);
}
