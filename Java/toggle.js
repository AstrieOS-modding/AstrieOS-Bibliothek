// Zeigt den volligen info von Repo
function Modsinfo() {document.querySelector('.Modsinfo-overlay').classList.toggle('active'); }
document.getElementById('modsinfo-overlay').addEventListener('click', (e) => { if (e.target == document.getElementById('modsinfo-overlay')) Modsinfo(); });

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