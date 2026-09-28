const fs = require('fs');
const path = require('path');

const vaultDir = "D:\\iruma_mielka";
const targetDirs = ["10_Notes", "20_External_Links"];
const roots = ["index.md", "note.md", "open_iruma.md"];

function getLinks(content) {
    const links = [];
    const regex = /\[\[(.*?)\]\]/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        let link = match[1].split('|')[0].split('#')[0].trim();
        links.push(link);
    }
    return links;
}

function findFile(linkName) {
    for (const d of targetDirs) {
        const p = path.join(vaultDir, d, linkName + ".md");
        if (fs.existsSync(p)) {
            return path.resolve(p);
        }
    }
    return null;
}

const visited = new Set();
const queue = [];

for (const r of roots) {
    const p = path.resolve(path.join(vaultDir, r));
    if (fs.existsSync(p)) {
        visited.add(p);
        queue.push(p);
    }
}

while (queue.length > 0) {
    const current = queue.shift();
    try {
        const content = fs.readFileSync(current, 'utf-8');
        const links = getLinks(content);
        for (const link of links) {
            const filePath = findFile(link);
            if (filePath && !visited.has(filePath)) {
                visited.add(filePath);
                queue.push(filePath);
            }
        }
    } catch (e) {
    }
}

function getAllFiles(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const p = path.join(dir, file);
        if (fs.statSync(p).isDirectory()) {
            getAllFiles(p, fileList);
        } else if (p.endsWith('.md')) {
            fileList.push(path.resolve(p));
        }
    }
    return fileList;
}

const allFiles = [];
for (const d of targetDirs) {
    getAllFiles(path.join(vaultDir, d), allFiles);
}

let draftCount = 0;
let publicCount = 0;

for (const filePath of allFiles) {
    const shouldBeDraft = !visited.has(filePath);
    
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const fmRegex = /^---\n([\s\S]*?)\n---/;
        const match = content.match(fmRegex);
        
        let newContent = content;
        let modified = false;
        
        if (match) {
            let fmText = match[1];
            const draftRegex = /^draft:\s*(true|false)/im;
            const draftMatch = fmText.match(draftRegex);
            
            if (shouldBeDraft) {
                if (draftMatch) {
                    if (draftMatch[1].toLowerCase() !== 'true') {
                        fmText = fmText.replace(draftRegex, 'draft: true');
                        newContent = content.substring(0, match.index) + '---\n' + fmText + '\n---' + content.substring(match.index + match[0].length);
                        modified = true;
                    }
                } else {
                    fmText = fmText.trimEnd() + '\ndraft: true';
                    newContent = content.substring(0, match.index) + '---\n' + fmText + '\n---' + content.substring(match.index + match[0].length);
                    modified = true;
                }
            } else {
                if (draftMatch && draftMatch[1].toLowerCase() === 'true') {
                    fmText = fmText.replace(/^draft:.*(?:\r?\n)?/im, '');
                    newContent = content.substring(0, match.index) + '---\n' + fmText + '\n---' + content.substring(match.index + match[0].length);
                    modified = true;
                }
            }
        } else {
            if (shouldBeDraft) {
                newContent = "---\ndraft: true\n---\n" + content;
                modified = true;
            }
        }
        
        if (modified) {
            fs.writeFileSync(filePath, newContent, 'utf-8');
        }
        
        if (shouldBeDraft) {
            draftCount++;
        } else {
            publicCount++;
        }
    } catch (e) {
    }
}

console.log(`処理完了: 公開対象(リンクあり) ${publicCount} 件 / 下書き(リンクなし) ${draftCount} 件`);
