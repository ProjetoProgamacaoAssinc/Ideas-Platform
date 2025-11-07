document.addEventListener('DOMContentLoaded', function () {
const categorySelect = document.getElementById('category');
if (categorySelect) {
    categorySelect.addEventListener('change', function () {
    this.form.submit();
    });
}
});
