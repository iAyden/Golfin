// This right here makes the side nav bar expand and contract boii
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    let isCollapsed = false;

    sidebar.classList.add('collapsed');
    mainContent.style.marginLeft = 'var(--sidebar-width-collapsed)';

    document.addEventListener('mousemove', (event) => {
        const sidebarRect = sidebar.getBoundingClientRect();

        if (event.clientX < sidebarRect.width + 50 && isCollapsed) {
            sidebar.classList.remove('collapsed');
            mainContent.style.marginLeft = 'var(--sidebar-width)';
            isCollapsed = false;
        } else if (event.clientX >= sidebarRect.width + 50 && !isCollapsed) {
            sidebar.classList.add('collapsed');
            mainContent.style.marginLeft = 'var(--sidebar-width-collapsed)';
            isCollapsed = true;
        }
    });
});
// FIN DE LA SECCION DE CODIGO QUE MANIPULA EL MODAL DE SIGN IN y LOG IN