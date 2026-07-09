const DEFAULT_I18N = {
    es: {
        ui: {
            brand: 'Proyecto Comunitario',
            badge: 'Guia interactiva',
            title: 'Museo AR Base',
            location: 'Santa Elena · Ecuador',
            subtitle: 'Experiencia AR con marcadores de imagen',
            description: 'Escanea las marcas impresas y visualiza laminas 2D sobre el entorno en tiempo real.',
            start: 'Iniciar experiencia WebAR',
            warning: 'Requiere permisos de camara y un entorno bien iluminado',
            back: 'Volver',
            scanner: 'Escaner activo',
            scanPrompt: 'Apunta la camara hacia una marca valida...',
            online: 'En linea',
            offline: 'Modo offline activo',
            detected: 'Detectado'
        },
        markers: {
            'marker-estacion1': {
                title: 'Estacion 1',
                description: 'Lamina 2D mostrada sobre la marca 1.',
                anchorLost: 'Anclado temporalmente',
                hint: 'Vuelve a apuntar a la marca para mayor estabilidad.'
            },
            'marker-estacion2': {
                title: 'Estacion 2',
                description: 'Lamina 2D mostrada sobre la marca 2.',
                anchorLost: 'Anclado temporalmente',
                hint: 'Vuelve a apuntar a la marca para mayor estabilidad.'
            }
        }
    },
    en: {
        ui: {
            brand: 'Community Project',
            badge: 'Interactive guide',
            title: 'AR Museum Base',
            location: 'Santa Elena · Ecuador',
            subtitle: 'AR experience with image markers',
            description: 'Scan printed marks and view 2D overlays on top of the real environment.',
            start: 'Start WebAR experience',
            warning: 'Camera permission and a well-lit environment are required',
            back: 'Back',
            scanner: 'Scanner active',
            scanPrompt: 'Point the camera to a valid marker...',
            online: 'Online',
            offline: 'Offline mode active',
            detected: 'Detected'
        },
        markers: {
            'marker-estacion1': {
                title: 'Station 1',
                description: '2D overlay shown on marker 1.',
                anchorLost: 'Temporarily anchored',
                hint: 'Point back to the marker for better stability.'
            },
            'marker-estacion2': {
                title: 'Station 2',
                description: '2D overlay shown on marker 2.',
                anchorLost: 'Temporarily anchored',
                hint: 'Point back to the marker for better stability.'
            }
        }
    },
    fr: {
        ui: {
            brand: 'Projet communautaire',
            badge: 'Guide interactif',
            title: 'Base Musee AR',
            location: 'Santa Elena · Ecuador',
            subtitle: 'Experience AR avec marqueurs image',
            description: 'Scannez les marques imprimees et affichez des overlays 2D dans l environnement reel.',
            start: 'Demarrer l experience WebAR',
            warning: 'Autorisation camera et environnement bien eclaire requis',
            back: 'Retour',
            scanner: 'Scanner actif',
            scanPrompt: 'Pointez la camera vers un marqueur valide...',
            online: 'En ligne',
            offline: 'Mode hors ligne actif',
            detected: 'Detecte'
        },
        markers: {
            'marker-estacion1': {
                title: 'Station 1',
                description: 'Overlay 2D affiche sur le marqueur 1.',
                anchorLost: 'Ancre temporairement',
                hint: 'Revenez vers le marqueur pour plus de stabilite.'
            },
            'marker-estacion2': {
                title: 'Station 2',
                description: 'Overlay 2D affiche sur le marqueur 2.',
                anchorLost: 'Ancre temporairement',
                hint: 'Revenez vers le marqueur pour plus de stabilite.'
            }
        }
    }
};

const AppState = {
    isARMode: false,
    currentMarker: null,
    lang: 'es',
    i18n: DEFAULT_I18N,
    activeTarget: null
};

function getPreferredLanguage() {
    const savedLang = localStorage.getItem('lang');
    if (savedLang && AppState.i18n[savedLang]) {
        return savedLang;
    }

    const browserLang = (navigator.language || navigator.userLanguage || 'es').slice(0, 2).toLowerCase();
    return AppState.i18n[browserLang] ? browserLang : 'es';
}

function getTranslationBundle(lang) {
    return AppState.i18n[lang] || AppState.i18n.es;
}

function getNestedValue(source, path, fallback = '') {
    return path.split('.').reduce((value, key) => {
        if (value && Object.prototype.hasOwnProperty.call(value, key)) {
            return value[key];
        }
        return undefined;
    }, source) ?? fallback;
}

function applyTranslations(lang) {
    const bundle = getTranslationBundle(lang);
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach((element) => {
        const value = getNestedValue(bundle, element.dataset.i18n, element.textContent.trim());
        element.textContent = value;
    });

    document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
        const value = getNestedValue(bundle, element.dataset.i18nAriaLabel, element.getAttribute('aria-label') || '');
        element.setAttribute('aria-label', value);
    });

    const networkStatus = document.getElementById('network-status');
    if (networkStatus) {
        networkStatus.textContent = navigator.onLine ? bundle.ui.online : bundle.ui.offline;
        networkStatus.classList.toggle('text-emerald-400', navigator.onLine);
        networkStatus.classList.toggle('text-amber-400', !navigator.onLine);
    }
}

async function loadI18n() {
    try {
        const response = await fetch('/i18n.json', { cache: 'no-cache' });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const remoteI18n = await response.json();

        // New format: i18n.json is an index with a sources map per language.
        if (remoteI18n && typeof remoteI18n.sources === 'object') {
            const entries = await Promise.all(
                Object.entries(remoteI18n.sources).map(async ([lang, path]) => {
                    const langResponse = await fetch(path, { cache: 'no-cache' });
                    if (!langResponse.ok) {
                        throw new Error(`No se pudo cargar ${path} (HTTP ${langResponse.status})`);
                    }

                    const data = await langResponse.json();
                    return [lang, data];
                })
            );

            const splitI18n = Object.fromEntries(entries);
            AppState.i18n = { ...DEFAULT_I18N, ...splitI18n };
            return;
        }

        // Backward compatibility: i18n.json contains full language tree.
        AppState.i18n = { ...DEFAULT_I18N, ...remoteI18n };
    } catch (error) {
        console.warn('No se pudo cargar i18n (index o archivo unico), usando fallback local.', error);
        AppState.i18n = DEFAULT_I18N;
    }
}

function setLanguage(lang) {
    if (!AppState.i18n[lang]) {
        return;
    }

    AppState.lang = lang;
    localStorage.setItem('lang', lang);
    applyTranslations(lang);

    document.querySelectorAll('[data-lang-choice]').forEach((button) => {
        const isSelected = button.dataset.langChoice === lang;
        button.classList.toggle('text-amber-400', isSelected);
        button.classList.toggle('text-stone-300', !isSelected);
        button.classList.toggle('bg-stone-950/70', isSelected);
        button.classList.toggle('bg-stone-950/40', !isSelected);
    });
}

function bindLanguageSwitcher() {
    document.querySelectorAll('[data-lang-choice]').forEach((button) => {
        button.addEventListener('click', () => setLanguage(button.dataset.langChoice));
    });
}

function bindNetworkEvents() {
    const updateStatus = () => applyTranslations(AppState.lang);
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
}

async function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
        return;
    }

    try {
        await navigator.serviceWorker.register('/service-worker.js');
    } catch (error) {
        console.warn('No se pudo registrar el service worker.', error);
    }
}

async function requestCameraAccess() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia no esta disponible en este navegador');
    }

    const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false
    });

    stream.getTracks().forEach((track) => track.stop());
}

function setActiveTarget(targetEl) {
    const anchors = document.querySelectorAll('[id^="anchor-estacion"]');

    anchors.forEach((anchor) => {
        const isActive = anchor === targetEl;
        anchor.setAttribute('visible', isActive ? 'true' : 'false');
    });

    AppState.activeTarget = targetEl || null;
}

AFRAME.registerComponent('marker-anchor', {
    schema: {
        target: { type: 'selector' }
    },
    init: function () {
        this.el.addEventListener('markerFound', () => {
            if (this.data.target) {
                setActiveTarget(this.data.target);
            }
        });

        this.el.addEventListener('markerLost', () => {
            // Keep the current overlay visible until another marker is found.
        });
    }
});

async function startARExperience() {
    try {
        await requestCameraAccess();
    } catch (error) {
        console.warn('No se pudo obtener acceso a la camara antes de iniciar AR.', error);
        alert('No fue posible activar la camara. Revisa el permiso del navegador e intenta de nuevo.');
        return;
    }

    AppState.isARMode = true;

    const screenHome = document.getElementById('screen-home');
    const screenARUi = document.getElementById('screen-ar-ui');
    const arScene = document.getElementById('ar-scene');

    if (screenHome) {
        screenHome.classList.add('opacity-0', 'pointer-events-none');
        setTimeout(() => {
            screenHome.classList.add('hidden');
        }, 300);
    }

    if (screenARUi && arScene) {
        screenARUi.classList.remove('hidden');
        arScene.classList.remove('hidden');
        arScene.style.display = 'block';
        arScene.resize();
    }
}

function exitARExperience() {
    window.location.reload();
}

function bindMarkerEvents() {
    const statusText = document.getElementById('scan-status');
    const markerIds = ['marker-estacion1', 'marker-estacion2'];

    markerIds.forEach((markerId) => {
        const markerEl = document.getElementById(markerId);
        if (!markerEl || !statusText) {
            return;
        }

        markerEl.addEventListener('markerFound', () => {
            AppState.currentMarker = markerId;
            const bundle = getTranslationBundle(AppState.lang);
            const data = bundle.markers[markerId];
            statusText.innerHTML = `<strong class="text-green-400">${bundle.ui.detected}</strong> ${data.title}<br><span class="text-[11px] text-stone-400">${data.description}</span>`;
        });

        markerEl.addEventListener('markerLost', () => {
            if (AppState.currentMarker === markerId) {
                const data = getTranslationBundle(AppState.lang).markers[markerId];
                statusText.innerHTML = `<strong class="text-amber-400">${data.anchorLost}</strong> · ${data.title}<br><span class="text-[11px] text-stone-300">${data.hint}</span>`;
            }
        });
    });
}

window.startARExperience = startARExperience;
window.exitARExperience = exitARExperience;

document.addEventListener('DOMContentLoaded', () => {
    loadI18n().then(() => {
        AppState.lang = getPreferredLanguage();
        setLanguage(AppState.lang);
    });

    bindLanguageSwitcher();
    bindNetworkEvents();
    registerServiceWorker();
    bindMarkerEvents();
});
