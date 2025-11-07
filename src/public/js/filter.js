const form = document.getElementById('filtersForm');
const selects = form.querySelectorAll('select');

selects.forEach(select => {
select.addEventListener('change', () => {
    const params = new URLSearchParams(window.location.search);
    const category = document.getElementById('category').value;
    const status = document.getElementById('status').value;
    const date = document.getElementById('date').value;

    // Atualiza os parâmetros
    if (category) params.set('category', category); else params.delete('category');
    if (status) params.set('status', status); else params.delete('status');
    if (date) params.set('date', date); else params.delete('date');

    // Recarrega a página com os novos filtros
    window.location.search = params.toString();
});
});