// jardatein.js - Holt Release .zip von GitHub/GitLab und laedt sie als .jar herunter
const JarDatein = {
    async getGitHubRelease(owner, repo) {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`);
        if (!response.ok) throw new Error('Kein GitHub Release gefunden');
        return await response.json();
    },

    async getGitLabRelease(projectId) {
        const response = await fetch(`https://gitlab.com/api/v4/projects/${encodeURIComponent(projectId)}/releases/latest`);
        if (!response.ok) throw new Error('Kein GitLab Release gefunden');
        return await response.json();
    },

    findZipAsset(assets) {
        if (!assets || !assets.length) return null;
        return assets.find(a => a.name && a.name.endsWith('.zip'));
    },

    async downloadAsJar(url, fileName) {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Download fehlgeschlagen');
        const blob = await response.blob();
        const jarName = fileName.replace(/\.zip$/i, '') + '.jar';
        const jarBlob = new Blob([blob], { type: 'application/java-archive' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(jarBlob);
        a.download = jarName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
    },

    async downloadFromGitHub(owner, repo) {
        const release = await this.getGitHubRelease(owner, repo);
        const asset = this.findZipAsset(release.assets);
        if (!asset) throw new Error('Keine .zip Datei im Release gefunden');
        await this.downloadAsJar(asset.browser_download_url, asset.name);
    },

    async downloadFromGitLab(projectId) {
        const release = await this.getGitLabRelease(projectId);
        const asset = this.findZipAsset(release.assets);
        if (!asset) throw new Error('Keine .zip Datei im Release gefunden');
        await this.downloadAsJar(asset.browser_download_url, asset.name);
    },

    async download(platform, ownerOrId, repo) {
        try {
            if (platform === 'github') {
                await this.downloadFromGitHub(ownerOrId, repo);
            } else if (platform === 'gitlab') {
                await this.downloadFromGitLab(ownerOrId);
            }
        } catch (err) {
            console.error('Download Fehler:', err);
            alert('Herunterladen fehlgeschlagen: ' + err.message);
        }
    }
};
