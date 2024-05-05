import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx, defineManifest } from "@crxjs/vite-plugin";
import packageJson from "./package.json";

const manifest = defineManifest({
    manifest_version: 3,
    name: "ls comments",
    version: packageJson.version,
    permissions: [
        "tabs",
    ],
    action: { default_popup: "index.html" },
    content_scripts: [
        {
            matches: ['<all_urls>'],
            js: ["src/content-script.ts"],
            run_at: "document_end",
            all_frames: true,
        },
    ],
    background: {
        service_worker: 'src/background.ts'
    },
});

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), crx({ manifest })],
});
