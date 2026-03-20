const Router = {
    routes: {},
    currentRoute: null,

    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    },

    register(path, handler) {
        this.routes[path] = handler;
    },

    navigate(path) {
        window.location.hash = path;
    },

    handleRoute() {
        const fullHash = window.location.hash.slice(1) || '/evaluations';
        const [hash, queryString] = fullHash.split('?');
        const query = this.parseQuery(queryString || '');
        let handler = null;
        let params = {};

        for (const path in this.routes) {
            const match = this.matchRoute(path, hash);
            if (match) {
                handler = this.routes[path];
                params = match.params;
                break;
            }
        }

        if (handler) {
            this.currentRoute = { path: hash, params, query };
            handler(params, query);
        } else {
            this.navigate('/evaluations');
        }
    },

    matchRoute(pattern, path) {
        const patternParts = pattern.split('/');
        const pathParts = path.split('/');

        if (patternParts.length !== pathParts.length) {
            return null;
        }

        const params = {};
        for (let i = 0; i < patternParts.length; i++) {
            if (patternParts[i].startsWith(':')) {
                params[patternParts[i].slice(1)] = pathParts[i];
            } else if (patternParts[i] !== pathParts[i]) {
                return null;
            }
        }

        return { params };
    }
    ,

    parseQuery(queryString) {
        const out = {};
        const raw = String(queryString || '').trim();
        if (!raw) return out;
        raw.split('&').forEach(part => {
            if (!part) return;
            const [k, v] = part.split('=');
            const key = decodeURIComponent(String(k || '').trim());
            if (!key) return;
            out[key] = decodeURIComponent(String(v || '').trim());
        });
        return out;
    }
};
