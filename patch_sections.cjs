const fs = require('fs');
const path = require('path');

const sectionsDir = path.join(__dirname, 'src/components/editor/sections');
const files = fs.readdirSync(sectionsDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(sectionsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace `props.something || 'default'` with `props.something ?? 'default'`
  content = content.replace(/props\.([a-zA-Z0-9_]+)\s*\|\|\s*(['"`][^'"`]*['"`])/g, 'props.$1 ?? $2');
  
  // Also arrays: `props.items || []`
  content = content.replace(/props\.([a-zA-Z0-9_]+)\s*\|\|\s*\[\]/g, 'props.$1 ?? []');
  
  // Handle numbers/booleans if any: `props.someNum || 10`
  content = content.replace(/props\.([a-zA-Z0-9_]+)\s*\|\|\s*([0-9]+)/g, 'props.$1 ?? $2');

  fs.writeFileSync(filePath, content);
}
console.log("Patched section files");
