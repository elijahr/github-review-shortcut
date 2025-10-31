
// ==UserScript==
// @name         GitHub PR review keyboard shortcut
// @version      0.6
// @description  Mark file as "viewed" on GitHub PR UI when hovering and pressing 'Escape' key, or unmark with Shift+Escape
// @match        https://github.com/*
// @author       dvdvdmt, nbolton, elijahr
// @source       https://github.com/elijahr/github-review-shortcut
// @namespace    https://github.com/elijahr/github-review-shortcut
// @license      MIT
// ==/UserScript==
(function() {
    'use strict';
    if (window.disposeMarkAsViewedByEscape) {
        window.disposeMarkAsViewedByEscape();
    }
    window.disposeMarkAsViewedByEscape = start();

    function start() {
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown);
    }

    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom > 0 &&
            rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
            rect.right > 0
        );
    }

    function simulateKeyPress(key) {
        const event = new KeyboardEvent('keydown', {
            key: key,
            code: key === 'j' ? 'KeyJ' : 'KeyK',
            keyCode: key === 'j' ? 74 : 75,
            which: key === 'j' ? 74 : 75,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(event);
        console.debug(`Simulated '${key}' keypress`);
    }

    function toggleFileAsViewed() {
        let fileElement = document.querySelector('[class^="Diff-module__diffTargetable--"]:hover');
        let isSingleElement = false;

        if (!fileElement) {
            console.debug("No file element under cursor, checking for alternatives");
            const allDiffElements = document.querySelectorAll('[class^="Diff-module__diffTargetable--"]');

            if (allDiffElements.length === 1) {
                console.debug("Found single diff element, using it");
                fileElement = allDiffElements[0];
                isSingleElement = true;
            } else if (allDiffElements.length > 1) {
                console.debug("Multiple diff elements found, finding first in viewport");
                fileElement = Array.from(allDiffElements).find(el => isElementInViewport(el));
            }
        }
        console.debug("Found", fileElement);

        if (!fileElement){
            console.warn("No file element found");
            return;
        }

        console.debug("File element found, finding buttons");
        const buttons = [...fileElement.querySelectorAll('button')];
        if (buttons.length === 0) {
            console.warn("No buttons found in file element");
            return;
        }
        console.debug("Buttons found, finding checkbox");
        const checkbox = buttons.find(btn => btn.textContent.trim() === 'Viewed');
        if (!checkbox) {
            console.warn("No checkbox found for file element");
            return;
        }

        // Check if checkbox is currently checked
        const isChecked = checkbox.getAttribute('aria-checked') === 'true';

        // Click the checkbox to toggle state
        if (!isChecked) {
            console.debug("Clicking checkbox to mark as viewed");
            checkbox.click();

            // If single element and marking as viewed, simulate 'j' to go to next file
            if (isSingleElement) {
                setTimeout(() => simulateKeyPress('j'), 100);
            }
        } else if (isChecked) {
            console.debug("Clicking checkbox to unmark as viewed");
            checkbox.click();

            // If single element and unmarking as viewed, simulate 'k' to go to previous file
            if (isSingleElement) {
                setTimeout(() => simulateKeyPress('k'), 100);
            }
        }
    }

    function handleKeyDown(event) {
      if (event.key !== 'Escape') {
          return;
      }
        toggleFileAsViewed();
    }
})();
