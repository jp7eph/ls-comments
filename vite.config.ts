import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx, defineManifest } from '@crxjs/vite-plugin';
import packageJson from './package.json';

const manifest = defineManifest({
    manifest_version: 3,
    name: 'ls comments',
    description: packageJson.description,
    version: packageJson.version,
    permissions: [
        'activeTab',
    ],
    action: { default_popup: 'index.html' },
    content_scripts: [
        {
            matches: ['<all_urls>'],
            js: ['src/content-script.ts'],
            run_at: 'document_end',
            all_frames: true,
        },
    ],
    background: {
        service_worker: 'src/background.ts'
    },
    icons: {
        '16': 'icons/icon_16.png',
        '32': 'icons/icon_32.png',
        '48': 'icons/icon_48.png',
        '128': 'icons/icon_128.png',
        '256': 'icons/icon_256.png',
    }
});

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), crx({ manifest })],
});
