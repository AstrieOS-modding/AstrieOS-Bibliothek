// Repoinfo.js - Holt Repo-Informationen von GitHub und Gitlab
const Repoinfo = {
    github: {
        async getRepo(owner, repo) {
            const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
            if (!response.ok) throw new Error('GitHub API Fehler');
            return await response.json();
        },
        async getReadme(owner, repo) {
            const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
                headers: { 'Accept': 'application/vnd.github.v3.raw' }
            });
            if (!response.ok) return null;
            return await response.text();
        },
        async searchRepos(query) {
            const response = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc`);
            if (!response.ok) throw new Error('GitHub Suche fehlgeschlagen');
            return await response.json();
        }
    },
    gitlab: {
        async getRepo(projectId) {
            const response = await fetch(`https://gitlab.com/api/v4/projects/${encodeURIComponent(projectId)}`);
            if (!response.ok) throw new Error('Gitlab API Fehler');
            return await response.json();
        },
        async getReadme(projectId) {
            const response = await fetch(`https://gitlab.com/api/v4/projects/${encodeURIComponent(projectId)}/repository/files/README.md/raw`);
            if (!response.ok) return null;
            return await response.text();
        },
        async searchRepos(query) {
            const response = await fetch(`https://gitlab.com/api/v4/projects?search=${encodeURIComponent(query)}&order_by=stars&sort=desc`);
            if (!response.ok) throw new Error('Gitlab Suche fehlgeschlagen');
            return await response.json();
        }
    },
    // Erkennt ob ein Repo ein Banner/Cover-Bild hat
    getBanner(repo) {
        // GitHub: open_graph_image oder social_preview
        if (repo.open_graph_image_url) return repo.open_graph_image_url;
        if (repo.social_preview?.image_url) return repo.social_preview.image_url;
        // Gitlab: avatar_url oder CI/CD
        if (repo.avatar_url) return repo.avatar_url;
        return null;
    },
    // Filtert Repos nach Stichworten
    filterByKeywords(repos, keywords) {
        const pattern = new RegExp(keywords.join('|'), 'i');
        return repos.filter(repo => 
            pattern.test(repo.name) || 
            pattern.test(repo.description || '') ||
            pattern.test(repo.topics?.join(' ') || '')
        );
    },
    // Erkennt AstrieOS-bezogene Stichwörter
    astrieosKeywords: ['astrieos', 'astrieos mod', 'astrieos mods', 'astrieos addon', 'astrieos addons'],
    // Zeigt erkannte Stichwörter an
    detectKeywords(repo) {
        const text = `${repo.name} ${repo.description || ''} ${(repo.topics || []).join(' ')}`.toLowerCase();
        return this.astrieosKeywords.filter(kw => text.includes(kw));
    },
    // Erstellt ein Repo-Objekt mit allen benötigten Informationen
    async getFullRepoInfo(platform, ownerOrId, repo) {
        let repoData, readme, banner, keywords;
        if (platform === 'github') {
            repoData = await this.github.getRepo(ownerOrId, repo);
            readme = await this.github.getReadme(ownerOrId, repo);
        } else if (platform === 'gitlab') {
            repoData = await this.gitlab.getRepo(ownerOrId);
            readme = await this.gitlab.getReadme(ownerOrId);
        }
        banner = this.getBanner(repoData);
        keywords = this.detectKeywords(repoData);
        return { repoData, readme, banner, keywords };
    }
};