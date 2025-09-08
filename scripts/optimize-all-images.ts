// scripts/optimize-all-images.ts
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

interface OptimizeOptions {
    quality?: number;
    width?: number;
    height?: number;
}

const optimizeImagesInFolder = async (folderPath: string, options: OptimizeOptions = {}) => {
    const { quality = 85, width, height } = options;

    if (!fs.existsSync(folderPath)) {
        console.log(`⚠️ Carpeta no encontrada: ${folderPath}`);
        return 0;
    }

    // Obtener todos los archivos PNG
    const files = fs.readdirSync(folderPath)
        .filter(file => file.toLowerCase().endsWith('.png'));

    if (files.length === 0) {
        console.log(`⚠️ No se encontraron archivos PNG en ${folderPath}`);
        return 0;
    }

    console.log(`\n📁 Optimizando ${files.length} imágenes en ${path.basename(folderPath)}...`);

    let successCount = 0;

    for (const file of files) {
        const inputPath = path.join(folderPath, file);
        const outputPath = path.join(folderPath, file.replace(/\.png$/i, '.webp'));

        try {
            let sharpInstance = sharp(inputPath);

            // Redimensionar si se especifica
            if (width || height) {
                sharpInstance = sharpInstance.resize(width, height, {
                    fit: 'cover',
                    position: 'center'
                });
            }

            // Convertir a WebP
            await sharpInstance
                .webp({ quality })
                .toFile(outputPath);

            // Obtener tamaños para mostrar estadísticas
            const originalStats = fs.statSync(inputPath);
            const optimizedStats = fs.statSync(outputPath);
            const reduction = Math.round(
                ((originalStats.size - optimizedStats.size) / originalStats.size) * 100
            );

            console.log(`  ✅ ${file} → ${file.replace('.png', '.webp')} (${reduction}% menor)`);
            successCount++;

        } catch (error) {
            console.error(`  ❌ Error procesando ${file}:`, error);
        }
    }

    return successCount;
};

const optimizeAllImages = async () => {
    const baseDir = './public/assets';

    // Definir todas las carpetas de imágenes
    const folders = [
        'perros',
        'hamburguesas',
        'bebidas',
        'salchipapas' // Asumo que era "salchipapas" en lugar de "sanchpapas"
    ];

    try {
        console.log('🚀 Iniciando optimización masiva de imágenes...\n');

        let totalOptimized = 0;

        for (const folder of folders) {
            const folderPath = path.join(baseDir, folder);
            const optimizedCount = await optimizeImagesInFolder(folderPath, {
                quality: 85,
                width: 400,
                height: 300
            });
            totalOptimized += optimizedCount;
        }

        console.log('\n' + '='.repeat(50));
        console.log(`🎉 ¡Optimización completada!`);
        console.log(`📊 Total de imágenes optimizadas: ${totalOptimized}`);
        console.log('\n📋 Próximos pasos:');
        console.log('1. Actualiza las rutas en TODOS tus archivos de productos (.png → .webp)');
        console.log('2. Archivos a actualizar:');
        console.log('   - src/data/perros.ts');
        console.log('   - src/data/hamburguesas.ts');
        console.log('   - src/data/bebidas.ts');
        console.log('   - src/data/salchipapas.ts');
        console.log('3. Haz commit y redespliega tu aplicación');
        console.log('='.repeat(50));

    } catch (error) {
        console.error('❌ Error general:', error);
    }
};

// Ejecutar el script
optimizeAllImages();