// scripts/optimize-all-images.ts
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

interface OptimizeOptions {
    quality?: number;
    width?: number;
    height?: number;
    preserveOriginal?: boolean;
    outputFormat?: 'webp' | 'jpeg' | 'png';
}

interface OptimizeResult {
    count: number;
    originalSize: number;
    optimizedSize: number;
}

const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const optimizeImagesInFolder = async (folderPath: string, options: OptimizeOptions = {}): Promise<OptimizeResult> => {
    const {
        quality = 85,
        width,
        height,
        preserveOriginal = true,
        outputFormat = 'webp'
    } = options;

    // Verificar si la carpeta existe
    if (!fs.existsSync(folderPath)) {
        console.log(`⚠️ Carpeta no encontrada: ${folderPath}`);
        return { count: 0, originalSize: 0, optimizedSize: 0 };
    }

    // Obtener todos los archivos de imagen soportados
    const supportedExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.tiff', '.gif'];
    const files = fs.readdirSync(folderPath)
        .filter(file => {
            const ext = path.extname(file).toLowerCase();
            return supportedExtensions.includes(ext);
        })
        .filter(file => {
            // Evitar procesar archivos ya optimizados si preservamos originales
            if (preserveOriginal && file.includes('_optimized')) {
                return false;
            }
            return true;
        });

    if (files.length === 0) {
        console.log(`⚠️ No se encontraron archivos de imagen en ${folderPath}`);
        return { count: 0, originalSize: 0, optimizedSize: 0 };
    }

    console.log(`\n📁 Optimizando ${files.length} imágenes en ${path.basename(folderPath)}...`);
    console.log(`   Configuración: Calidad ${quality}%, ${width || 'auto'}x${height || 'auto'}, Formato: ${outputFormat.toUpperCase()}`);

    let successCount = 0;
    let folderOriginalSize = 0;
    let folderOptimizedSize = 0;

    for (const file of files) {
        const inputPath = path.join(folderPath, file);
        const ext = path.extname(file).toLowerCase();
        const nameWithoutExt = path.basename(file, ext);

        // Definir ruta de salida
        let outputPath: string;
        if (preserveOriginal) {
            outputPath = path.join(folderPath, `${nameWithoutExt}_optimized.${outputFormat}`);
        } else {
            outputPath = path.join(folderPath, `${nameWithoutExt}.${outputFormat}`);
        }

        try {
            // Verificar que el archivo de entrada existe y es legible
            if (!fs.existsSync(inputPath)) {
                console.error(`  ❌ Archivo no encontrado: ${file}`);
                continue;
            }

            // Obtener información de la imagen original
            const originalStats = fs.statSync(inputPath);
            let imageInfo: sharp.Metadata;

            try {
                imageInfo = await sharp(inputPath).metadata();
            } catch (metaError) {
                console.error(`  ❌ Error leyendo metadatos de ${file}:`, metaError);
                continue;
            }

            let sharpInstance = sharp(inputPath);

            // Configurar redimensionado si se especifica
            if (width || height) {
                sharpInstance = sharpInstance.resize(width, height, {
                    fit: 'inside', // Mantiene aspect ratio
                    withoutEnlargement: true // No agranda imágenes pequeñas
                });
            }

            // Aplicar optimizaciones según el formato
            switch (outputFormat) {
                case 'webp':
                    await sharpInstance
                        .webp({
                            quality,
                            effort: 6, // Máxima compresión
                            lossless: false
                        })
                        .toFile(outputPath);
                    break;

                case 'jpeg':
                    await sharpInstance
                        .jpeg({
                            quality,
                            progressive: true,
                            mozjpeg: true // Mejor compresión
                        })
                        .toFile(outputPath);
                    break;

                case 'png':
                    await sharpInstance
                        .png({
                            quality,
                            compressionLevel: 9, // Máxima compresión
                            progressive: true
                        })
                        .toFile(outputPath);
                    break;
            }

            // Verificar que el archivo se creó correctamente
            if (!fs.existsSync(outputPath)) {
                console.error(`  ❌ Error: No se pudo crear ${path.basename(outputPath)}`);
                continue;
            }

            // Calcular estadísticas
            const optimizedStats = fs.statSync(outputPath);
            const reduction = Math.round(
                ((originalStats.size - optimizedStats.size) / originalStats.size) * 100
            );

            folderOriginalSize += originalStats.size;
            folderOptimizedSize += optimizedStats.size;

            // Mostrar resultado
            const originalSize = formatBytes(originalStats.size);
            const optimizedSize = formatBytes(optimizedStats.size);
            const reductionText = reduction > 0 ? `${reduction}% menor` : `${Math.abs(reduction)}% mayor`;
            const dimensionsText = imageInfo.width && imageInfo.height ?
                `${imageInfo.width}x${imageInfo.height}` : 'N/A';

            console.log(`  ✅ ${file} → ${path.basename(outputPath)}`);
            console.log(`     📐 ${dimensionsText} | 📦 ${originalSize} → ${optimizedSize} (${reductionText})`);

            successCount++;

        } catch (error) {
            console.error(`  ❌ Error procesando ${file}:`, error instanceof Error ? error.message : error);
        }
    }

    // Mostrar resumen de la carpeta
    if (successCount > 0) {
        const folderReduction = Math.round(
            ((folderOriginalSize - folderOptimizedSize) / folderOriginalSize) * 100
        );
        console.log(`\n  📊 Resumen de ${path.basename(folderPath)}:`);
        console.log(`     ✨ ${successCount} imágenes optimizadas`);
        console.log(`     💾 ${formatBytes(folderOriginalSize)} → ${formatBytes(folderOptimizedSize)}`);
        console.log(`     🎯 Reducción: ${folderReduction}%`);
    }

    return { count: successCount, originalSize: folderOriginalSize, optimizedSize: folderOptimizedSize };
};

const optimizeAllImages = async (): Promise<void> => {
    const baseDir = './public/assets';

    // Verificar que el directorio base existe
    if (!fs.existsSync(baseDir)) {
        console.error(`❌ Directorio base no encontrado: ${baseDir}`);
        console.log('💡 Asegúrate de ejecutar este script desde la raíz del proyecto');
        process.exit(1);
    }

    // Definir todas las carpetas de imágenes
    const folders = [
        'perros',
        'hamburguesas',
        'arepas',
        'bebidas',
        'salchipapas',
        'matador',
        'otros',
        'sandwichs',
        'servicios_mini'
    ];

    try {
        console.log('🚀 Iniciando optimización masiva de imágenes...\n');
        console.log('📝 Formatos soportados: PNG, JPG, JPEG, WEBP, TIFF, GIF → WEBP');
        console.log(`📂 Directorio base: ${path.resolve(baseDir)}\n`);

        let totalOptimized = 0;
        let totalOriginalSize = 0;
        let totalOptimizedSize = 0;

        for (const folder of folders) {
            const folderPath = path.join(baseDir, folder);
            const result = await optimizeImagesInFolder(folderPath, {
                quality: 80,
                width: 800,
                height: 600,
                preserveOriginal: false,
                outputFormat: 'webp'
            });

            totalOptimized += result.count;
            totalOriginalSize += result.originalSize;
            totalOptimizedSize += result.optimizedSize;

            // Pequeña pausa para no sobrecargar el sistema
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        console.log('\n' + '='.repeat(70));
        console.log(`🎉 ¡Optimización completada!`);
        console.log(`📊 Total de imágenes optimizadas: ${totalOptimized}`);

        if (totalOptimized > 0 && totalOriginalSize > 0) {
            const totalReduction = Math.round(
                ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize) * 100
            );
            console.log(`💾 Espacio ahorrado: ${formatBytes(totalOriginalSize)} → ${formatBytes(totalOptimizedSize)}`);
            console.log(`🎯 Reducción total: ${totalReduction}%`);
        }

        if (totalOptimized > 0) {
            console.log('\n📋 Próximos pasos REQUERIDOS:');
            console.log('1. Actualiza las rutas en TODOS tus archivos de productos:');
            console.log('   - Cambia las extensiones a .webp');
            console.log('2. Archivos a actualizar:');
            folders.forEach(folder => {
                console.log(`   - src/data/${folder}.ts`);
            });
            console.log('3. Verifica que todas las imágenes se vean correctamente');
            console.log('4. Considera eliminar las imágenes originales para ahorrar espacio');
            console.log('5. Haz commit y redespliega tu aplicación');
        } else {
            console.log('\n⚠️ No se optimizó ninguna imagen. Verifica:');
            console.log('- Que las carpetas existan');
            console.log('- Que contengan archivos de imagen válidos');
            console.log('- Los permisos de escritura');
        }

        console.log('='.repeat(70));

    } catch (error) {
        console.error('❌ Error general:', error);
        process.exit(1);
    }
};

// Función para limpiar archivos optimizados anteriores (opcional)
const cleanPreviousOptimizations = async (): Promise<void> => {
    const baseDir = './public/assets';
    const folders = [
        'perros', 'hamburguesas', 'arepas', 'bebidas',
        'salchipapas', 'matador', 'otros', 'sandwichs', 'servicios_mini'
    ];

    console.log('🧹 Limpiando optimizaciones anteriores...');

    for (const folder of folders) {
        const folderPath = path.join(baseDir, folder);
        if (fs.existsSync(folderPath)) {
            const files = fs.readdirSync(folderPath)
                .filter(file => file.includes('_optimized'));

            for (const file of files) {
                fs.unlinkSync(path.join(folderPath, file));
            }

            if (files.length > 0) {
                console.log(`  🗑️ Eliminados ${files.length} archivos en ${folder}`);
            }
        }
    }
};

// Ejecutar el script
const main = async (): Promise<void> => {
    const args = process.argv.slice(2);

    if (args.includes('--clean')) {
        await cleanPreviousOptimizations();
    }

    await optimizeAllImages();
};

main().catch(console.error);