import os
import re
import glob

vault_dir = r"D:\iruma_mielka"
target_dirs = ["10_Notes", "20_External_Links"]
roots = ["index.md", "note.md", "open_iruma.md"]

def get_links(content):
    # [[Link]] or [[Link|Alias]] or [[Link#Heading]]
    links = []
    matches = re.findall(r'\[\[(.*?)\]\]', content)
    for m in matches:
        link = m.split('|')[0].split('#')[0].strip()
        links.append(link)
    return links

def find_file(link_name):
    for d in target_dirs:
        p = os.path.join(vault_dir, d, link_name + ".md")
        if os.path.exists(p):
            return os.path.abspath(p)
    return None

visited = set()
queue = []

for r in roots:
    p = os.path.abspath(os.path.join(vault_dir, r))
    if os.path.exists(p):
        visited.add(p)
        queue.append(p)

# BFSでリンクを辿る
while queue:
    current = queue.pop(0)
    try:
        with open(current, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        continue
    
    links = get_links(content)
    for link in links:
        file_path = find_file(link)
        if file_path and file_path not in visited:
            visited.add(file_path)
            queue.append(file_path)

all_files = []
for d in target_dirs:
    search_path = os.path.join(vault_dir, d, "**", "*.md")
    for f in glob.glob(search_path, recursive=True):
        all_files.append(os.path.abspath(f))

def update_frontmatter(file_path, should_be_draft):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception:
        return
    
    fm_match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    new_content = content
    modified = False
    
    if fm_match:
        fm_text = fm_match.group(1)
        has_draft = re.search(r'^draft:\s*(true|false)', fm_text, re.MULTILINE | re.IGNORECASE)
        
        if should_be_draft:
            if has_draft:
                if has_draft.group(1).lower() != 'true':
                    new_fm = re.sub(r'^draft:.*', 'draft: true', fm_text, flags=re.MULTILINE | re.IGNORECASE)
                    new_content = content[:fm_match.start(1)] + new_fm + content[fm_match.end(1):]
                    modified = True
            else:
                new_fm = fm_text.rstrip() + "\ndraft: true\n"
                new_content = content[:fm_match.start(1)] + new_fm + content[fm_match.end(1):]
                modified = True
        else: # 公開対象
            if has_draft:
                if has_draft.group(1).lower() == 'true':
                    new_fm = re.sub(r'^draft:.*\n?', '', fm_text, flags=re.MULTILINE | re.IGNORECASE)
                    new_content = content[:fm_match.start(1)] + new_fm + content[fm_match.end(1):]
                    modified = True
    else:
        if should_be_draft:
            new_content = "---\ndraft: true\n---\n" + content
            modified = True
            
    if modified:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)

draft_count = 0
public_count = 0

for f in all_files:
    should_be_draft = f not in visited
    update_frontmatter(f, should_be_draft)
    if should_be_draft:
        draft_count += 1
    else:
        public_count += 1

print(f"処理完了: 公開対象(リンクあり) {public_count} 件 / 下書き(リンクなし) {draft_count} 件")
