import sharp from 'sharp';
import { glob } from 'glob';
import path from 'path';
import fs from 'fs';

const FULLS_DIR = 'assets/images/fulls';
const THUMBS_DIR = 'assets/images/thumbs';
const THUMB_WIDTH = 512;

async function resizeImages() {
    // Find all images in fulls directory
    const images = await glob(`${FULLS_DIR}/**/*.{jpg,JPG,jpeg,JPEG,png,PNG,gif,GIF}`);

    console.log(`Found ${images.length} images to process...`);

    let processed = 0;
    let skipped = 0;

    for (const imagePath of images) {
        // Get relative path from fulls directory
        const relativePath = path.relative(FULLS_DIR, imagePath);
        const thumbPath = path.join(THUMBS_DIR, relativePath);
        const thumbDir = path.dirname(thumbPath);

        // Create thumbnail directory if it doesn't exist
        if (!fs.existsSync(thumbDir)) {
            fs.mkdirSync(thumbDir, { recursive: true });
        }

        // Skip if thumbnail already exists and is newer than source
        if (fs.existsSync(thumbPath)) {
            const srcStat = fs.statSync(imagePath);
            const thumbStat = fs.statSync(thumbPath);
            if (thumbStat.mtime >= srcStat.mtime) {
                skipped++;
                continue;
            }
        }

        try {
            await sharp(imagePath)
                .resize(THUMB_WIDTH, null, { withoutEnlargement: true })
                .toFile(thumbPath);
            processed++;
            console.log(`✓ ${relativePath}`);
        } catch (err) {
            console.error(`✗ ${relativePath}: ${err.message}`);
        }
    }

    console.log(`\nDone! Processed: ${processed}, Skipped: ${skipped}`);
}

resizeImages().catch(console.error);
