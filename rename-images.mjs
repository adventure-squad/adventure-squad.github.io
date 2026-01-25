import fs from 'fs';
import path from 'path';

const FULLS_DIR = 'assets/images/fulls';
const THUMBS_DIR = 'assets/images/thumbs';

// Map folders to their trip years (for files without date in name)
const FOLDER_YEARS = {
    'kyrg': '2023',
    'norway': '2024',
    'brielle': '2024',
    'slovenia': '2022',
    'lapalma': '2026',
    'polecamp_nl': '2023'
};

// Track renames for updating markdown files
const renames = [];

function extractYear(filename) {
    // Pattern: starts with 4-digit year (2020-2029)
    if (/^20[2-9]\d/.test(filename)) {
        return filename.substring(0, 4);
    }

    // Pattern: IMG_YYYYMMDD or P_YYYYMMDD
    const match = filename.match(/^(IMG_|P_)(20[2-9]\d)/i);
    if (match) {
        return match[2];
    }

    return null;
}

function getNewFilename(filename, folderYear) {
    const year = extractYear(filename);

    // Already starts with year - no change needed
    if (year && filename.startsWith(year)) {
        return null;
    }

    // Has year embedded (IMG_YYYY... or P_YYYY...)
    if (year) {
        return `${year}_${filename}`;
    }

    // No year found - use folder year
    if (folderYear) {
        return `${folderYear}_${filename}`;
    }

    return null;
}

function processDirectory(dirPath, folderYear, isThumbsDir = false) {
    if (!fs.existsSync(dirPath)) return;

    const items = fs.readdirSync(dirPath);

    for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // Recurse into subdirectories (like kyrg_gallery)
            const subFolderYear = FOLDER_YEARS[item] || folderYear;
            processDirectory(fullPath, subFolderYear, isThumbsDir);
        } else if (stat.isFile()) {
            // Check if it's an image
            const ext = path.extname(item).toLowerCase();
            if (!['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) continue;

            const newName = getNewFilename(item, folderYear);
            if (newName) {
                const newPath = path.join(dirPath, newName);

                // Only process fulls first time to build rename list
                if (!isThumbsDir) {
                    renames.push({
                        folder: path.relative(FULLS_DIR, dirPath),
                        oldName: item,
                        newName: newName
                    });
                }

                // Rename the file
                console.log(`${isThumbsDir ? '[thumbs]' : '[fulls]'} ${item} -> ${newName}`);
                fs.renameSync(fullPath, newPath);
            }
        }
    }
}

function updateMarkdownFiles() {
    const postsDir = '_posts';
    const posts = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

    for (const postFile of posts) {
        const postPath = path.join(postsDir, postFile);
        let content = fs.readFileSync(postPath, 'utf-8');
        let modified = false;

        for (const rename of renames) {
            // Build possible path patterns to replace
            const oldPatterns = [
                `/assets/images/fulls/${rename.folder}/${rename.oldName}`,
                `assets/images/fulls/${rename.folder}/${rename.oldName}`
            ];

            for (const oldPattern of oldPatterns) {
                const newPattern = oldPattern.replace(rename.oldName, rename.newName);
                if (content.includes(oldPattern)) {
                    content = content.split(oldPattern).join(newPattern);
                    modified = true;
                    console.log(`[${postFile}] Updated reference: ${rename.oldName} -> ${rename.newName}`);
                }
            }
        }

        if (modified) {
            fs.writeFileSync(postPath, content);
        }
    }
}

// Main execution
console.log('=== Renaming images in fulls/ ===\n');

// Process each trip folder in fulls
const fullsFolders = fs.readdirSync(FULLS_DIR);
for (const folder of fullsFolders) {
    if (folder === 'banners') continue; // Skip banners

    const folderPath = path.join(FULLS_DIR, folder);
    if (fs.statSync(folderPath).isDirectory()) {
        const folderYear = FOLDER_YEARS[folder];
        console.log(`\nProcessing ${folder}/ (year: ${folderYear || 'unknown'})...`);
        processDirectory(folderPath, folderYear, false);
    }
}

console.log('\n=== Renaming images in thumbs/ ===\n');

// Process thumbs with same renames
if (fs.existsSync(THUMBS_DIR)) {
    const thumbsFolders = fs.readdirSync(THUMBS_DIR);
    for (const folder of thumbsFolders) {
        if (folder === 'banners') continue;

        const folderPath = path.join(THUMBS_DIR, folder);
        if (fs.statSync(folderPath).isDirectory()) {
            const folderYear = FOLDER_YEARS[folder];
            processDirectory(folderPath, folderYear, true);
        }
    }
}

console.log('\n=== Updating markdown files ===\n');
updateMarkdownFiles();

console.log('\n=== Done! ===');
console.log(`Total files renamed: ${renames.length}`);
