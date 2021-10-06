import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import PurgeIcons from 'vite-plugin-purge-icons'

export default defineConfig({
    plugins: [reactRefresh(), PurgeIcons()]
})
