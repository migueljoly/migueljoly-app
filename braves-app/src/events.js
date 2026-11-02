// Pequenos eventos globais: toast, confete e timer de descanso.
// Qualquer tela dispara, e os componentes em App.jsx escutam.

const emit = (name, detail) => window.dispatchEvent(new CustomEvent(name, { detail }));

export const toast = (msg, tipo = "ok") => emit("braves:toast", { msg, tipo });

export const burst = (x, y) =>
  emit("braves:burst", {
    x: x ?? window.innerWidth / 2,
    y: y ?? window.innerHeight * 0.6,
  });

export const startTimer = (seconds, label) => emit("braves:timer", { seconds, label });
