const fs = require('fs');
const path = require('path');

// 対応する画像ファイル拡張子
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];

// imagesディレクトリのパス
const imagesDir = path.join(__dirname, 'images');

// 画像一覧を生成する関数
function generateImageList() {
    try {
        // imagesディレクトリが存在するかチェック
        if (!fs.existsSync(imagesDir)) {
            throw new Error('images ディレクトリが見つかりません');
        }

        // 既存の images-list.json を読み込み、既存メタデータを保持する
        const outputPath = path.join(__dirname, 'images-list.json');
        let existingImages = [];
        if (fs.existsSync(outputPath)) {
            try {
                const existing = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
                if (existing.success && Array.isArray(existing.images)) {
                    existingImages = existing.images;
                }
            } catch (e) {
                console.warn('⚠️  既存の images-list.json の読み込みに失敗しました。新規作成します。');
            }
        }
        const existingImageMap = new Map(
            existingImages
                .filter(img => img && typeof img.filename === 'string')
                .map(img => [img.filename, img])
        );

        // ディレクトリ内のファイルを読み取り、実在するものだけを採用する
        const files = fs.readdirSync(imagesDir);
        const currentImageFiles = [];
        const newImageFiles = [];
        const removedImageFiles = [];
        const currentFilenames = new Set();

        files.forEach(file => {
            const filePath = path.join(imagesDir, file);
            const stat = fs.statSync(filePath);

            // ファイル（ディレクトリではない）かつ、対応する拡張子の場合
            if (stat.isFile()) {
                const ext = path.extname(file).toLowerCase();
                if (allowedExtensions.includes(ext)) {
                    const fileName = path.basename(file, ext);
                    currentFilenames.add(file);

                    const existingImage = existingImageMap.get(file);
                    const imageEntry = {
                        filename: file,
                        name: fileName,
                        path: `images/${file}`,
                        extension: ext.slice(1), // ドットを除去
                        size: stat.size,
                        modified: stat.mtime.toISOString(),
                        created: existingImage && existingImage.created
                            ? existingImage.created
                            : stat.birthtime.toISOString()
                    };

                    currentImageFiles.push(imageEntry);

                    if (!existingImage) {
                        newImageFiles.push(imageEntry);
                    }
                }
            }
        });

        for (const existingImage of existingImages) {
            if (existingImage && typeof existingImage.filename === 'string' && !currentFilenames.has(existingImage.filename)) {
                removedImageFiles.push(existingImage);
            }
        }

        // 実在するファイルだけをファイル名でソート
        currentImageFiles.sort((a, b) => a.filename.localeCompare(b.filename, 'ja'));

        // 結果オブジェクトを作成
        const result = {
            success: true,
            images: currentImageFiles,
            count: currentImageFiles.length,
            lastUpdated: new Date().toISOString(),
            generatedBy: 'generate-image-list.js'
        };

        // JSONファイルに書き出し
        fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');

        console.log(`✅ 合計 ${currentImageFiles.length}個の画像ファイルが登録されています`);
        console.log(`🆕 新規追加: ${newImageFiles.length}個 / 削除済みを除外: ${removedImageFiles.length}個`);
        console.log(`📄 images-list.json を更新しました`);

        if (newImageFiles.length > 0) {
            console.log('\n📋 新規追加された画像ファイル:');
            newImageFiles.forEach((file, index) => {
                console.log(`${String(index + 1).padStart(3, ' ')}. ${file.filename}`);
            });
        } else {
            console.log('\n✨ 新規追加された画像ファイルはありません');
        }

        return result;

    } catch (error) {
        console.error('❌ エラーが発生しました:', error.message);

        // エラー用のJSONファイルを作成
        const errorResult = {
            success: false,
            error: error.message,
            images: [],
            count: 0,
            lastUpdated: new Date().toISOString(),
            generatedBy: 'generate-image-list.js'
        };

        const outputPath = path.join(__dirname, 'images-list.json');
        fs.writeFileSync(outputPath, JSON.stringify(errorResult, null, 2), 'utf8');

        return errorResult;
    }
}

// スクリプトが直接実行された場合
if (require.main === module) {
    console.log('🖼️  画像リスト生成スクリプトを開始...');
    const result = generateImageList();

    if (result.success) {
        console.log('\n🎉 画像リストの生成が完了しました！');
        process.exit(0);
    } else {
        console.log('\n💥 画像リストの生成に失敗しました');
        process.exit(1);
    }
}

module.exports = { generateImageList };