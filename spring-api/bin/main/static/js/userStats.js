document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const hamburger = document.getElementById('hamburgerMenu');
    
    let isCollapsed = false;

    document.addEventListener('mousemove', (event) => {
        const sidebarRect = sidebar.getBoundingClientRect();
        if (event.clientX < sidebarRect.width + 50 && isCollapsed) {
            sidebar.classList.remove('collapsed');
            if (mainContent) mainContent.style.marginLeft = 'var(--sidebar-width)';
            isCollapsed = false;
        } else if (event.clientX >= sidebarRect.width + 50 && !isCollapsed) {
            sidebar.classList.add('collapsed');
            if (mainContent) mainContent.style.marginLeft = 'var(--sidebar-width-collapsed)';
            isCollapsed = true;
        }
    });


 // Responsive hamburger menu toggle
    hamburger.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 900 && sidebar.classList.contains('active')) {
            if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });
});