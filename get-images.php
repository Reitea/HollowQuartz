<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// imagesディレクトリのパス
$imageDir = __DIR__ . '/images/';

// 対応する画像ファイル拡張子
$allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];

$images = [];

try {
    // imagesディレクトリが存在するかチェック
    if (!is_dir($imageDir)) {
        throw new Exception('Images directory not found');
    }

    // ディレクトリ内のファイルを取得
    $files = scandir($imageDir);
    
    foreach ($files as $file) {
        // '.'と'..'をスキップ
        if ($file === '.' || $file === '..') {
            continue;
        }
        
        $filePath = $imageDir . $file;
        
        // ファイルかどうかチェック
        if (!is_file($filePath)) {
            continue;
        }
        
        // 拡張子を取得
        $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        
        // 対応する画像拡張子かチェック
        if (in_array($extension, $allowedExtensions)) {
            $images[] = [
                'filename' => $file,
                'name' => pathinfo($file, PATHINFO_FILENAME),
                'extension' => $extension,
                'path' => 'images/' . $file,
                'size' => filesize($filePath),
                'modified' => filemtime($filePath)
            ];
        }
    }
    
    // ファイル名でソート
    usort($images, function($a, $b) {
        return strcmp($a['filename'], $b['filename']);
    });
    
    echo json_encode([
        'success' => true,
        'images' => $images,
        'count' => count($images)
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'images' => [],
        'count' => 0
    ]);
}
?>