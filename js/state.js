// [v1.5-TH-FINAL] (ネジ切り基準面ロック機能)
// state.js
window.LS2_State = {
  mmToPx: 5,
  work: { d: 60, out: 46, grab: 12 },
  workpieceProfile: new Array(800).fill(150),
  innerProfile: new Array(800).fill(0),

  // ネジ切り専用の基準面スナップショット
  threadBaseProfile: new Array(800).fill(150),

  realPos: { z: 450, x: 170, s: 0 },
  prevPos: { z: 450, x: 170, s: 0 },
  zeroRef: { z: 0, x: 0, s: 0 },

  isFeedOn: false,
  isHalfNutOn: false,
  threadMoveDir: 0,
  isContact: false,

  accelValue: 0,
  holdTimer: null,
  holdInterval: null,

  step1: { zZero: false, faceCut: false },

  // ホイール（ハンドル）の状態
  angles: {
    z: { current: 0, lastInput: 0 },
    x: { current: 0, lastInput: 0 },
    s: { current: 0, lastInput: 0 }
  }
};
