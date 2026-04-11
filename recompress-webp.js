const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const thresholdArg = process.argv.find(arg => arg.startsWith('--threshold='));
const qualityArg = process.argv.find(arg => arg.startsWith('--quality='));
const minQualityArg = process.argv.find(arg => arg.startsWith('--min-quality='));
const dryRun = process.argv.includes('--dry-run');

const threshold = thresholdArg ? Math.max(1, Number(thresholdArg.split('=')[1])) : 1024 * 1024;
const maxQuality = qualityArg ? Math.min(100, Math.max(1, Number(qualityArg.split('=')[1]))) : 82;
const minQuality = minQualityArg ? Math.min(100, Math.max(1, Number(minQualityArg.split('=')[1]))) : 30;

const normalizedMinQuality = Math.min(minQuality, maxQuality);
const qualitySteps = [];

for (let current = maxQuality; current >= normalizedMinQuality; current -= 4) {
    qualitySteps.push(current);
}

if (qualitySteps[qualitySteps.length - 1] !== normalizedMinQuality) {
    qualitySteps.push(normalizedMinQuality);
}

const imageDir = path.join(__dirname, 'images');
const imagesListPath = path.join(__dirname, 'images-list.json');

function loadImagesList() {
    if (!fs.existsSync(imagesListPath)) {
        return null;
    }

    try {
        const parsed = JSON.parse(fs.readFileSync(imagesListPath, 'utf8'));
        if (parsed && Array.isArray(parsed.images)) {
            return parsed;
        }
    } catch (error) {
        console.warn(`WARN images-list.json could not be read: ${error.message}`);
    }

    return null;
}

function refreshImagesListMetadata() {
    const current = loadImagesList();
    if (!current) {
        return false;
    }

    const updatedImages = current.images.map(image => {
        const filePath = path.join(__dirname, image.path);

        if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
            return image;
        }

        const stat = fs.statSync(filePath);
        return {
            ...image,
            size: stat.size,
            modified: stat.mtime.toISOString()
        };
    });

    const result = {
        ...current,
        images: updatedImages,
        count: updatedImages.length,
        lastUpdated: new Date().toISOString(),
        generatedBy: 'recompress-webp.js'
    };

    fs.writeFileSync(imagesListPath, JSON.stringify(result, null, 2), 'utf8');
    return true;
}

async function recompress() {
    if (!fs.existsSync(imageDir)) {
        throw new Error('images directory not found');
    }

    const files = fs.readdirSync(imageDir);
    const oversizedWebpFiles = files
        .map(file => path.join(imageDir, file))
        .filter(filePath => fs.existsSync(filePath) && fs.statSync(filePath).isFile())
        .filter(filePath => path.extname(filePath).toLowerCase() === '.webp')
        .map(filePath => ({
            filePath,
            fileName: path.basename(filePath),
            size: fs.statSync(filePath).size
        }))
        .filter(file => file.size > threshold)
        .sort((a, b) => b.size - a.size);

    let processed = 0;
    let updated = 0;
    let skipped = 0;
    let failed = 0;

    console.log(`Found ${oversizedWebpFiles.length} WebP file(s) over ${threshold} bytes`);

    for (const file of oversizedWebpFiles) {
        processed += 1;

        const originalSize = file.size;
        const filePath = file.filePath;
        const fileName = file.fileName;

        let bestBuffer = null;
        let bestQuality = null;

        for (const currentQuality of qualitySteps) {
            const buffer = await sharp(filePath)
                .webp({ quality: currentQuality })
                .toBuffer();

            if (!bestBuffer || buffer.length < bestBuffer.length) {
                bestBuffer = buffer;
                bestQuality = currentQuality;
            }

            if (buffer.length <= threshold) {
                bestBuffer = buffer;
                bestQuality = currentQuality;
                break;
            }
        }

        if (!bestBuffer) {
            failed += 1;
            console.error(`FAIL ${fileName} (encoding produced no output)`);
            continue;
        }

        if (bestBuffer.length >= originalSize) {
            skipped += 1;
            console.log(`KEEP ${fileName} (original ${originalSize}, best ${bestBuffer.length} at q${bestQuality})`);
            continue;
        }

        if (dryRun) {
            updated += 1;
            console.log(`DRY ${fileName} (${originalSize} -> ${bestBuffer.length}, q${bestQuality})`);
            continue;
        }

        const backupPath = `${filePath}.bak`;
        if (fs.existsSync(backupPath)) {
            fs.unlinkSync(backupPath);
        }

        fs.renameSync(filePath, backupPath);

        try {
            fs.writeFileSync(filePath, bestBuffer);
            fs.unlinkSync(backupPath);
            updated += 1;
            console.log(`OK ${fileName} (${originalSize} -> ${bestBuffer.length}, q${bestQuality})`);
        } catch (error) {
            if (fs.existsSync(backupPath)) {
                fs.renameSync(backupPath, filePath);
            }
            failed += 1;
            console.error(`FAIL ${fileName} (${error.message})`);
        }
    }

    if (!dryRun) {
        refreshImagesListMetadata();
    }

    console.log(`Done. processed=${processed} updated=${updated} skipped=${skipped} failed=${failed}`);

    if (failed > 0) {
        process.exitCode = 1;
    }
}

recompress().catch(error => {
    console.error(error.message);
    process.exitCode = 1;
});