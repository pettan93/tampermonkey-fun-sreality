import { resolveDistance } from './distance.js';

(function () {
    'use strict';

    if (!location.hostname.endsWith('sreality.cz')) {
        return;
    }

    const processedElements = new WeakMap();
    let scheduled = false;

    const anchorSelector = 'a[href^="/detail/"], a[href^="https://www.sreality.cz/detail/"]';

    function ensureOriginalText(element) {
        if (!element.dataset.tmOriginalLocation) {
            element.dataset.tmOriginalLocation = element.textContent.trim();
        }
        return element.dataset.tmOriginalLocation;
    }

    function annotateElement(element, distance) {
        const value = typeof distance === 'number' ? `${Math.round(distance)}km` : 'n/a';
        let badge = element.querySelector('.tm-enhance');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'tm-enhance';
            badge.style.whiteSpace = 'nowrap';
            badge.style.fontWeight = 'normal';
            badge.style.marginLeft = '0.25em';
            badge.style.fontSize = 'inherit';
            element.appendChild(document.createTextNode(' '));
            element.appendChild(badge);
        }
        badge.textContent = `(${value})`;
    }

    function detectLocationElement(card) {
        const paragraphs = Array.from(card.querySelectorAll('p'));
        if (!paragraphs.length) {
            return null;
        }

        const candidates = paragraphs.length > 1 ? paragraphs.slice(1) : paragraphs;
        for (const paragraph of candidates) {
            const original = ensureOriginalText(paragraph);
            if (!original) {
                continue;
            }
            const lower = original.toLowerCase();
            if (lower.includes('kč') || lower.includes('eur') || lower.includes('€')) {
                continue;
            }
            return paragraph;
        }

        return null;
    }

    function processCard(card) {
        const locationElement = detectLocationElement(card);
        if (!locationElement) {
            return;
        }

        const originalText = ensureOriginalText(locationElement);
        if (!originalText) {
            return;
        }

        const { distance } = resolveDistance(originalText);
        const key = `${originalText}|${distance === undefined ? 'na' : Math.round(distance)}`;
        if (processedElements.get(locationElement) === key) {
            return;
        }

        annotateElement(locationElement, distance);
        processedElements.set(locationElement, key);
    }

    function scan() {
        const cards = document.querySelectorAll(anchorSelector);
        cards.forEach(processCard);
    }

    function scheduleScan() {
        if (scheduled) {
            return;
        }
        scheduled = true;
        requestAnimationFrame(() => {
            scheduled = false;
            scan();
        });
    }

    function initObservers() {
        const observer = new MutationObserver(scheduleScan);
        observer.observe(document.body, { childList: true, subtree: true });

        const originalPushState = history.pushState;
        history.pushState = function pushStatePatched(...args) {
            const result = originalPushState.apply(this, args);
            scheduleScan();
            return result;
        };

        const originalReplaceState = history.replaceState;
        history.replaceState = function replaceStatePatched(...args) {
            const result = originalReplaceState.apply(this, args);
            scheduleScan();
            return result;
        };

        window.addEventListener('popstate', scheduleScan);
    }

    function init() {
        if (!document.body) {
            requestAnimationFrame(init);
            return;
        }
        scan();
        initObservers();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
