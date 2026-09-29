import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Quartz 4 はプロジェクトルートが実行ディレクトリになる
const targetFile = path.resolve('content/index.md');
const notesDir = path.resolve('content/10_Notes');

const START_MARKER_PROJECT = '<!-- DATAVIEW_PROJECT_START -->';
const END_MARKER_PROJECT = '<!-- DATAVIEW_PROJECT_END -->';

const START_MARKER_ARCHIVE = '<!-- DATAVIEW_ARCHIVE_START -->';
const END_MARKER_ARCHIVE = '<!-- DATAVIEW_ARCHIVE_END -->';

async function main() {
  try {
    if (!fs.existsSync(targetFile)) {
      console.warn(`[WARN] Target file not found: ${targetFile}`);
      return; // フェイルセーフ（クラッシュさせない）
    }

    let indexContent = fs.readFileSync(targetFile, 'utf8');

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
    const archives = [];

    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        // gray-matterによる堅牢な解析
        const parsed = matter(content);
        const fm = parsed.data;

        // タグの標準化
        let tags = fm.tags || [];
        if (typeof tags === 'string') {
            tags = tags.split(',').map(t => t.trim());
        }
        
        const isNotDraft = fm.draft !== true && fm.draft !== 'true';

        // 1. プロジェクト用 (WHERE type = "project" AND status = "調査中" AND draft != true)
        if (
            fm.type === 'project' && 
            fm.status === '調査中' && 
            isNotDraft
        ) {
          projects.push({
            title: fm.title || path.basename(file, '.md'),
            description: fm.description || '',
            mtime: fm.modified || fm.date || fs.statSync(file).mtime,
            slug: path.basename(file, '.md')
          });
        }

        // 2. アーカイブ用 (WHERE status = "完了" AND draft != true)
        const status = fm.status || '';
        if (
            status === '完了' &&
            isNotDraft
        ) {
          archives.push({
            title: fm.title || path.basename(file, '.md'),
            description: fm.description || '',
            date: fm.date || fm.modified || fs.statSync(file).mtime,
            slug: path.basename(file, '.md')
          });
        }

        // --- Web公開用にローカルのDataviewコールアウトを削除 ---
        // Obsidian上では表示させつつ、Web上では不要なコードブロックを隠すための処理
        const dataviewRegex = /(?m)^> \[\!info\]- 紐づく検証ノート[^\n]*\r?\n(?:^>.*\r?\n)*/g;
        if (content.match(dataviewRegex)) {
            const strippedContent = content.replace(dataviewRegex, '');
            fs.writeFileSync(file, strippedContent, 'utf8');
        }
      } catch (err) {
        console.warn(`[WARN] Failed to parse ${file}: ${err.message}`);
      }
    }

    // --- プロジェクトの置換処理 ---
    const startIndexProj = indexContent.indexOf(START_MARKER_PROJECT);
    const endIndexProj = indexContent.indexOf(END_MARKER_PROJECT);

    if (startIndexProj !== -1 && endIndexProj !== -1) {
      // 新しい順にソート
      projects.sort((a, b) => new Date(b.mtime) - new Date(a.mtime));

      let tableContent = '\n';
      if (projects.length === 0) {
        tableContent += '*現在、対象のプロジェクトはありません。*\n';
      } else {
        tableContent += '| プロジェクト | 概要 |\n|---|---|\n';
        for (const p of projects) {
          const safeDesc = p.description ? String(p.description).replace(/\r?\n/g, ' ') : '';
          tableContent += `| [[${p.slug}|${p.title}]] | ${safeDesc} |\n`;
        }
      }
      tableContent += '\n';

      const before = indexContent.slice(0, startIndexProj + START_MARKER_PROJECT.length);
      const after = indexContent.slice(endIndexProj);
      indexContent = `${before}${tableContent}${after}`;
      console.log(`[INFO] Replaced Project Dataview with ${projects.length} projects.`);
    } else {
      console.warn(`[WARN] Project Markers not found in ${targetFile}`);
    }

    // --- アーカイブの置換処理 ---
    const startIndexArch = indexContent.indexOf(START_MARKER_ARCHIVE);
    const endIndexArch = indexContent.indexOf(END_MARKER_ARCHIVE);

    if (startIndexArch !== -1 && endIndexArch !== -1) {
      // 新しい順にソート
      archives.sort((a, b) => new Date(b.date) - new Date(a.date));

      let tableContent = '\n';
      if (archives.length === 0) {
        tableContent += '*現在、対象のアーカイブはありません。*\n';
      } else {
        tableContent += '| レポート名 | 概要 |\n|---|---|\n';
        for (const a of archives) {
          const safeDesc = a.description ? String(a.description).replace(/\r?\n/g, ' ') : '';
          tableContent += `| [[${a.slug}|${a.title}]] | ${safeDesc} |\n`;
        }
      }
      tableContent += '\n';

      const before = indexContent.slice(0, startIndexArch + START_MARKER_ARCHIVE.length);
      const after = indexContent.slice(endIndexArch);
      indexContent = `${before}${tableContent}${after}`;
      console.log(`[INFO] Replaced Archive Dataview with ${archives.length} archives.`);
    } else {
      console.warn(`[WARN] Archive Markers not found in ${targetFile}`);
    }

    // 最終的に書き込み
    fs.writeFileSync(targetFile, indexContent, 'utf8');

  } catch (err) {
    console.warn(`[WARN] build_dataview.mjs failed with error: ${err.message}`);
    // プロセスは正常終了させる (exit 0 相当)
  }
}

main();
