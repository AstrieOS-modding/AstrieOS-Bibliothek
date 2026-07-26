// Zeigt den volligen info von Repo
let currentRepoIndex = null;

function Modsinfo(index) {
    currentRepoIndex = index;
    document.querySelector('.Modsinfo-overlay').classList.toggle('active');
}

document.getElementById('modsinfo-overlay').addEventListener('click', (e) => {
    if (e.target == document.getElementById('modsinfo-overlay')) Modsinfo();
});

function Ds_filter() {
    const dropdown = document.getElementById('filtermenu');
    if (dropdown) dropdown.classList.toggle('open');
}

function Ds_modandaddons() {
    const dropdown = document.getElementById('Mods-und-addons');
    if (dropdown) dropdown.classList.toggle('open');
}

function Ds_grid() {
    const dropdown = document.getElementById('Grid-oder-list');
    if (dropdown) dropdown.classList.toggle('open');
}

function Herunterladen() {
    if (currentRepoIndex === null) return;
    const repo = Tools.repos[currentRepoIndex];
    if (!repo) return;
    JarDatein.download(repo.platform, repo.ownerOrId, repo.repo);
}