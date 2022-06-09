import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import VueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
    plugins: [Vue(), VueJsx(), Icons()],
    optimizeDeps: {
        disabled: true
    },
    test: {
        clearMocks: true,
        environment: 'jsdom',
        setupFiles: ['./vitest.setup.ts'],
        transformMode: {
            web: [/\.[jt]sx$/],
        }
    }
})