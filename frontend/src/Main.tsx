import '@assets/css/index.css';
import { normalizePath } from '@utils/path.util';
import App from 'App';
import { createRoot } from 'react-dom/client';

const rootEl = document.getElementById('root');
const normalizedPath = normalizePath(window.location.pathname) || '/';

if (window.location.pathname !== normalizedPath) {
    window.history.replaceState(null, '', normalizedPath);
}

if (!rootEl) {
    throw new Error('Root element not found');
}

createRoot(rootEl)
    .render(
        <App />
    );