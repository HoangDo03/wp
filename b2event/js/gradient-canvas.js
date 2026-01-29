const canvas = document.getElementById("gradientCanvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

let t = 0;
const noiseImg = new Image();
noiseImg.src = "assets/noise.png";

function draw() {
  t += 0.003;

  // GRADIENT
  const g = ctx.createRadialGradient(
    canvas.width * 0.7,
    canvas.height * (0.3 + Math.sin(t) * 0.05),
    100,
    canvas.width * 0.4,
    canvas.height * 0.6,
    canvas.width
  );

  g.addColorStop(0, "#16254b");
  g.addColorStop(0.35, "#23418a");
  g.addColorStop(0.6, "#aadfd9");
  g.addColorStop(1, "#e64f0f");

  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // NOISE
  ctx.globalAlpha = 0.08;
  ctx.drawImage(noiseImg, 0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 1;

  requestAnimationFrame(draw);
}

noiseImg.onload = draw;
