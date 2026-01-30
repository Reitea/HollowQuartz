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

        // ディレクトリ内のファイルを読み取り
        const files = fs.readdirSync(imagesDir);
        const imageFiles = [];

        files.forEach(file => {
            const filePath = path.join(imagesDir, file);
            const stat = fs.statSync(filePath);

            // ファイル（ディレクトリではない）かつ、対応する拡張子の場合
            if (stat.isFile()) {
                const ext = path.extname(file).toLowerCase();
                if (allowedExtensions.includes(ext)) {
                    const fileName = path.basename(file, ext);
                    
                    imageFiles.push({
                        filename: file,
                        name: fileName,
                        path: `images/${file}`,
                        extension: ext.slice(1), // ドットを除去
                        size: stat.size,
                        modified: stat.mtime.toISOString(),
                        created: stat.birthtime.toISOString()
                    });
                }
            }
        });

        // ファイル名でソート
        imageFiles.sort((a, b) => a.filename.localeCompare(b.filename, 'ja'));

        // 結果オブジェクトを作成
        const result = {
            success: true,
            images: imageFiles,
            count: imageFiles.length,
            lastUpdated: new Date().toISOString(),
            generatedBy: 'generate-image-list.js'
        };

        // JSONファイルに書き出し
        const outputPath = path.join(__dirname, 'images-list.json');
        fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');

        console.log(`✅ ${imageFiles.length}個の画像ファイルを検出しました`);
        console.log(`📄 images-list.json を生成しました`);
        
        // ファイル名の一覧を表示
        console.log('\n📋 検出された画像ファイル:');
        imageFiles.forEach((file, index) => {
            console.log(`${String(index + 1).padStart(3, ' ')}. ${file.filename}`);
        });

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