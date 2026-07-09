# Formato recomendado para marcas de imagen

Esta base usa marcadores AR.js de tipo pattern (.patt).

## Flujo recomendado
1. Diseñar imagen fuente en formato PNG cuadrado.
2. Generar el archivo .patt desde esa imagen.
3. Guardar el .patt en public/assets/markers/.
4. Guardar la imagen fuente en public/images/marcadores/ para referencia de impresion.

## Especificacion de imagen fuente
- Formato: PNG
- Tamano recomendado: 512x512 o 1024x1024
- Forma: cuadrada
- Contraste: alto (fondo claro, figura oscura o viceversa)
- Borde negro grueso: recomendado
- Evitar degradados finos y detalles muy pequenos

## Nombre de archivos sugerido
- public/images/marcadores/marcador-1.png
- public/images/marcadores/marcador-2.png
- public/assets/markers/pattern-marcador-1.patt
- public/assets/markers/pattern-marcador-2.patt

## Nota tecnica
AR.js no consume PNG directo en a-marker pattern.
Necesita el .patt generado a partir de la imagen.
