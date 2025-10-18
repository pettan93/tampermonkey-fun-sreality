// ==UserScript==
// @name         Sreality Helper
// @namespace    https://github.com/pettan/tampermonkey_sreality_proximity
// @version      0.2.0
// @description  Sreality Helper - enhance
// @author       Pettan93
// @match        https://www.sreality.cz/*
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @connect      pub-4815130969814954ab7abc487142322a.r2.dev
// ==/UserScript==

(function () {
    'use strict';

    const DEFAULT_REMOTE_URL = 'https://pub-4815130969814954ab7abc487142322a.r2.dev/sreality-enhance-remote.js';
    const LOG_PREFIX = '[Sreality Helper]';

    const override = localStorage.getItem('sreality_proximity_remote_url');
    const remoteUrl = typeof override === 'string' && override.trim() ? override.trim() : DEFAULT_REMOTE_URL;

    if (!/^https?:\/\//i.test(remoteUrl)) {
        console.error(`${LOG_PREFIX} Invalid remote script URL: ${remoteUrl}`);
        return;
    }

    function executeRemote(code) {
        try {
            const runner = new Function(code);
            runner();
        } catch (error) {
            console.error(`${LOG_PREFIX} Failed executing remote script`, error);
        }
    }

    function handleError(context, detail) {
        console.error(`${LOG_PREFIX} ${context}`, detail);
    }

    GM_xmlhttpRequest({
        method: 'GET',
        url: remoteUrl,
        onload(response) {
            if (response.status >= 200 && response.status < 400) {
                executeRemote(response.responseText);
            } else {
                handleError(`Remote fetch returned status ${response.status}`, response.responseText?.slice?.(0, 200));
            }
        },
        onerror(error) {
            handleError('Remote fetch errored', error);
        },
        ontimeout() {
            handleError('Remote fetch timed out', null);
        },
    });
})();
