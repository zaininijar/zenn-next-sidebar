import fs from 'fs';
import path from 'path';
export function getSidebarRoutes(baseDir = process.cwd()) {
    const routeDir = detectNextJsRouteDir(baseDir);
    return walkRoutes(routeDir, routeDir);
}
function detectNextJsRouteDir(baseDir) {
    const defaultDirs = ['pages', 'app', 'src/pages', 'src/app'];
    for (const dir of defaultDirs) {
        const fullPath = path.join(baseDir, dir);
        if (fs.existsSync(fullPath))
            return fullPath;
    }
    throw new Error('No valid Next.js route directory found (pages or app).');
}
function walkRoutes(currentDir, baseDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    const routes = [];
    for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        if (entry.name.startsWith('_') ||
            entry.name === 'api' ||
            entry.name.startsWith('.') ||
            entry.name.endsWith('.test.ts') ||
            entry.name.endsWith('.spec.tsx'))
            continue;
        if (entry.isDirectory()) {
            routes.push(...walkRoutes(fullPath, baseDir));
        }
        else if (entry.isFile() && /\.(js|jsx|ts|tsx|mdx)$/.test(entry.name)) {
            let relativePath = fullPath
                .replace(baseDir, '')
                .replace(/\.(js|jsx|ts|tsx|mdx)$/, '')
                .replace(/\\/g, '/');
            if (relativePath === '/page')
                relativePath = '/';
            if (relativePath.endsWith('/page')) {
                relativePath = relativePath.replace(/\/page$/, '');
            }
            if (relativePath === '/index')
                relativePath = '/';
            routes.push({
                name: getNameFromRoute(relativePath),
                path: relativePath,
            });
        }
    }
    return routes;
}
function getNameFromRoute(route) {
    if (route === '/')
        return 'Home';
    const parts = route.split('/');
    const name = parts[parts.length - 1];
    return name.charAt(0).toUpperCase() + name.slice(1);
}
