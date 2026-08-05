const STORAGE_KEY = 'theme';
const root = document.documentElement;

function effectiveTheme() {
    const explicit = root.getAttribute('data-theme');
    if (explicit) return explicit;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function updateIcon() {
    const button = document.getElementById('theme-toggle');
    if (!button) return;
    button.setAttribute('aria-checked', String(effectiveTheme() === 'dark'));
}

function apply(theme) {
    root.setAttribute('data-theme', theme);
    updateIcon();
}

document.addEventListener('DOMContentLoaded', () => {
    updateIcon();

    const button = document.getElementById('theme-toggle');
    if (button) {
        button.addEventListener('click', () => {
            const next = effectiveTheme() === 'dark' ? 'light' : 'dark';
            try {
                localStorage.setItem(STORAGE_KEY, next);
            } catch (e) {
                // localStorage unavailable (private browsing etc) - toggle for this load only
            }
            apply(next);
        });
    }

    // If the visitor has never made an explicit choice, keep following the OS
    // setting live (e.g. a scheduled sunset dark mode) instead of only
    // picking it up on the next full page load.
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (!root.getAttribute('data-theme')) updateIcon();
    });
});
