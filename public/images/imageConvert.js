
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. 이미지 폴더: 현재 스크립트 위치의 heroes 폴더
const imageDir = path.join(__dirname, 'heroes');
// 2. 결과 파일: 프로젝트 루트 (public/images/에서 두 단계 위)
const outputFile = path.join(__dirname, '../../imageAssets.ts');

if (!fs.existsSync(imageDir)) {
  console.error(`❌ 폴더를 찾을 수 없습니다: ${imageDir}`);
  process.exit(1);
}

const files = fs.readdirSync(imageDir);
const assets = {};

files.forEach(file => {
  if (file.toLowerCase().endsWith('.png')) {
    const filePath = path.join(imageDir, file);
    const bitmap = fs.readFileSync(filePath);
    const base64 = bitmap.toString('base64');
    
    const key = path.parse(file).name.toLowerCase(); // 키값을 소문자로 통일
    assets[key] = `data:image/png;base64,${base64}`;
    console.log(`+ 변환 완료: ${file}`);
  }
});

const content = `// 이 파일은 imageConvert.js에 의해 자동 생성되었습니다.
export const IMAGE_ASSETS: Record<string, string> = ${JSON.stringify(assets, null, 2)};
`;

fs.writeFileSync(outputFile, content);
console.log('\n✅ imageAssets.ts 업데이트 완료!');
