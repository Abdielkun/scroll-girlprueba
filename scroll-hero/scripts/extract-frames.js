const ffmpeg = require('ffmpeg-static');
const { execSync } = require('child_process');
const fs = require('fs');

const dir = 'public/frames';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

console.log("Extrayendo frames del video con ffmpeg...");
try {
  execSync(`"${ffmpeg}" -i public/hero.mp4 -vf "fps=30,scale=1920:-1" -q:v 3 public/frames/frame_%04d.jpg`, { stdio: 'inherit' });
  console.log("¡Extracción completada con éxito!");
} catch (error) {
  console.error("Hubo un error al extraer los frames:", error);
  process.exit(1);
}
