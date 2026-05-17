const ffmpeg = require('ffmpeg-static');
const { execSync } = require('child_process');
const fs = require('fs');

const dir = 'public/frames2';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

console.log("Extrayendo frames del video hero2.mp4 con ffmpeg...");
try {
  execSync(`"${ffmpeg}" -i public/hero2.mp4 -vf "fps=30,scale=1920:-1" -q:v 3 public/frames2/frame_%04d.jpg`, { stdio: 'inherit' });
  console.log("¡Extracción completada con éxito!");
} catch (error) {
  console.error("Hubo un error al extraer los frames:", error);
  process.exit(1);
}
