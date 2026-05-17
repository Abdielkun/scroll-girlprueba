const ffmpeg = require('ffmpeg-static');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const videos = [4, 5, 6];

for (const num of videos) {
  const sourcePath = path.join(__dirname, '..', '..', `hero${num}.mp4`);
  const targetPath = path.join(__dirname, '..', 'public', `hero${num}.mp4`);
  const destDir = path.join(__dirname, '..', 'public', `frames${num}`);

  console.log(`\n===================================`);
  console.log(`Procesando hero${num}.mp4`);
  console.log(`===================================`);

  // 1. Copiar video si existe en la raíz
  if (fs.existsSync(sourcePath)) {
    console.log(`Copiando de ${sourcePath} a ${targetPath}...`);
    try {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`Copiado con éxito.`);
    } catch (err) {
      console.error(`Error al copiar:`, err);
    }
  } else {
    console.log(`Video de origen no encontrado en la raíz, buscando en public...`);
  }

  if (!fs.existsSync(targetPath)) {
    console.error(`Error: No se encontró hero${num}.mp4 en public ni en la raíz.`);
    continue;
  }

  // 2. Crear directorio de destino para los frames
  if (!fs.existsSync(destDir)){
    fs.mkdirSync(destDir, { recursive: true });
    console.log(`Creado directorio: ${destDir}`);
  }

  // 3. Extraer frames
  console.log(`Extrayendo frames a public/frames${num} con ffmpeg...`);
  try {
    const cmd = `"${ffmpeg}" -i public/hero${num}.mp4 -vf "fps=30,scale=1920:-1" -q:v 3 public/frames${num}/frame_%04d.jpg`;
    console.log(`Ejecutando: ${cmd}`);
    execSync(cmd, { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    console.log(`¡Extracción de hero${num}.mp4 completada con éxito!`);
  } catch (error) {
    console.error(`Hubo un error al extraer los frames de hero${num}.mp4:`, error);
  }
}
