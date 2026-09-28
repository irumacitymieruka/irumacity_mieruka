import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Quartz 4 はプロジェクトルートが実行ディレクトリになる
const targetFile = path.resolve('content/index.md');
const notesDir = path.resolve('content/10_Notes');

const START_MARKER = '<!-- DATAVIEW_PROJECT_START -->';
const END_MARKER = '<!-- DATAVIEW_PROJECT_END -->';

async function main() {
  try {
    if (!fs.existsSync(targetFile)) {
      console.warn(`[WARN] Target file not found: ${targetFile}`);
      return; // フェイルセーフ（クラッシュさせない）
    }

    const indexContent = fs.readFileSync(targetFile, 'utf8');
    const startIndex = indexContent.indexOf(START_MARKER);
    const endIndex = indexContent.indexOf(END_MARKER);

    if (startIndex === -1 || endIndex === -1) {
      console.warn(`[WARN] Markers not found in ${targetFile}`);
      return;
    }

    const files = [];
    function scanDir(dir) {
      if (!fs.existsSync(dir)) return;
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        if (fs.statSync(fullPath).isDirectory()) {
          scanDir(fullPath);
        } else if (fullPath.endsWith('.md')) {
          files.push(fullPath);
        }
      }
    }

    scanDir(notesDir);

    const projects = [];
    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        // gray-matterによる堅牢な解析
        const parsed = matter(content);
        const fm = parsed.data;

        // WHERE type = "project" AND contains(tags, "進捗/2_調査中") AND draft != true
        let tags = fm.tags || [];
        if (typeof tags === 'string') {
            // カンマ区切りのタグ等にも対応させる
            tags = tags.split(',').map(t => t.trim());
        }

        if (
            fm.type === 'project' && 
            tags.includes('進捗/2_調査中') && 
            fm.draft !== true && fm.draft !== 'true'
        ) {
          projects.push({
            title: fm.title || path.basename(file, '.md'),
            description: fm.description || '',
            mtime: fm.modified || fm.date || fs.statSync(file).mtime,
            slug: path.basename(file, '.md')
          });
        }
      } catch (err) {
        console.warn(`[WARN] Failed to parse ${file}: ${err.message}`);
      }
    }

    // SORT file.mtime DESC (新しい順)
    projects.sort((a, b) => new Date(b.mtime) - new Date(a.mtime));

    let tableContent = '\n';
    if (projects.length === 0) {
      tableContent += '*現在、対象のプロジェクトはありません。*\n';
      console.warn(`[INFO] No projects found matching the criteria.`);
    } else {
      tableContent += '| プロジェクト | 概要 |\n|---|---|\n';
      for (const p of projects) {
        // descriptionの改行をエスケープ
        const safeDesc = p.description ? String(p.description).replace(/\r?\n/g, ' ') : '';
        // [[リンク]] で記載すればQuartzが自動解決する
        tableContent += `| [[${p.slug}|${p.title}]] | ${safeDesc} |\n`;
      }
    }
    tableContent += '\n';

    const before = indexContent.slice(0, startIndex + START_MARKER.length);
    const after = indexContent.slice(endIndex);
    
    const newContent = `${before}${tableContent}${after}`;

    fs.writeFileSync(targetFile, newContent, 'utf8');
    console.log(`[INFO] Successfully replaced Dataview in ${targetFile} with ${projects.length} projects.`);

  } catch (err) {
    console.warn(`[WARN] build_dataview.mjs failed with error: ${err.message}`);
    // プロセスは正常終了させる (exit 0 相当)
  }
}

main();
