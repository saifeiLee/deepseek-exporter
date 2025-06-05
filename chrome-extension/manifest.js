import fs from 'node:fs'

const packageJson = JSON.parse(fs.readFileSync('../package.json'))

/**
 * After changing, please reload the extension at `chrome://extensions`
 * @type {chrome.runtime.ManifestV3s}
 */
const manifest = {
    manifest_version: 3,
    default_locale: 'en',
    name: 'Deepseek Exporter',
    version: packageJson.version,
    description: '__MSG_extensionDescription__',
    permissions: ['activeTab'],
    host_permissions: ['https://chat.deepseek.com/*'],
    "icons": {
        "16": "icons/icon16.png",
        "48": "icons/icon48.png",
        "128": "icons/icon128.png"
    },
    "action": {
        "default_popup": "popup.html",
        "default_icon": {
            "16": "icons/icon16.png",
            "48": "icons/icon48.png",
            "128": "icons/icon128.png"
        }
    },
    "content_security_policy": {
        "extension_pages": "script-src 'self'; object-src 'self'"
    },
    "content_scripts": [
        {
            "matches": ["https://chat.deepseek.com/*"],
            "js": ["content.js"],
            "css": ["content.css"]
        }
    ]
}

export default manifest