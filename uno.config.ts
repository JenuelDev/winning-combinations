import { defineConfig } from 'unocss'
import presetMini from '@unocss/preset-mini'

// Web fonts preset removed: the UI now uses a native system font stack
// (see main.scss) so there is no render-blocking external font request.
export default defineConfig({
    presets: [
        presetMini(),
    ],
})