# Base WebAR con GitHub Pages (main)

Base de proyecto estatico WebAR para movil con:
- Diseno principal estilo museo
- Modulo i18n (es, en, fr)
- Soporte offline (Service Worker)
- PWA (manifest)
- CI/CD a GitHub Pages desde main
- Marcadores de imagen via archivos pattern locales
- Overlays iniciales en 2D (sin modelos 3D, sin R2)

## Estructura
- index.html
- src/js/app.js
- i18n.json
- service-worker.js
- manifest.json
- .github/workflows/deploy.yml
- public/assets/markers/
- public/assets/overlays/
- public/images/

## CI/CD GitHub Pages
Workflow: .github/workflows/deploy.yml

Dispara en:
- push a main
- manual con workflow_dispatch

En tu repo de GitHub, habilita Pages con source GitHub Actions.

## Marcadores de imagen
Este proyecto usa AR.js con a-marker type=pattern.
Los marcadores reales usados por la app son:
- public/assets/markers/pattern-marcador-1.patt
- public/assets/markers/pattern-marcador-2.patt

Guia de formato y convenciones:
- public/images/marcadores/README.md

## Overlays 2D iniciales
- public/assets/overlays/estacion-1.svg
- public/assets/overlays/estacion-2.svg

Puedes reemplazarlos por PNG/SVG finales sin tocar la logica AR.

## Desarrollo local
Usa un servidor estatico (no abrir index.html directo):

python -m http.server 8000

Luego abre:
http://localhost:8000

## Personalizacion rapida
1. Cambia textos en i18n.json.
2. Reemplaza overlays en public/assets/overlays/.
3. Si cambias marcadores, actualiza los .patt en public/assets/markers/.
4. Ajusta nombres y descripciones por marcador en src/js/app.js.
