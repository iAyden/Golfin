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




    // INICIO DE LA SECCION DEL CODIGO QUE MANIPULA EL MODAL DE SIGN IN y LOG IN
    document.getElementById("btn__iniciar-sesion").addEventListener("click", iniciarSesion);
    document.getElementById("btn__registrarse").addEventListener("click", register);
    window.addEventListener("resize", anchoPage);

    var formulario_login = document.querySelector(".login_form");
    var formulario_register = document.querySelector(".sign_in_form");
    var contenedor_login_register = document.querySelector(".login_container-register");
    var caja_trasera_login = document.querySelector(".back_box-login");
    var caja_trasera_register = document.querySelector(".back_box-register");

    function anchoPage() {
        if (window.innerWidth > 850) {
            caja_trasera_register.style.display = "block";
            caja_trasera_login.style.display = "block";
        } else {
            caja_trasera_register.style.display = "block";
            caja_trasera_register.style.opacity = "1";
            caja_trasera_login.style.display = "none";
            formulario_login.style.display = "block";
            contenedor_login_register.style.left = "0px";
            formulario_register.style.display = "none";
        }
    }

    anchoPage();

    function iniciarSesion() {
        if (window.innerWidth > 850) {
            formulario_login.style.display = "block";
            contenedor_login_register.style.left = "10px";
            formulario_register.style.display = "none";
            caja_trasera_register.style.opacity = "1";
            caja_trasera_login.style.opacity = "0";
        } else {
            formulario_login.style.display = "block";
            contenedor_login_register.style.left = "0px";
            formulario_register.style.display = "none";
            caja_trasera_register.style.display = "block";
            caja_trasera_login.style.display = "none";
        }
    }

    function register() {
        if (window.innerWidth > 850) {
            formulario_register.style.display = "block";
            contenedor_login_register.style.left = "410px";
            formulario_login.style.display = "none";
            caja_trasera_register.style.opacity = "0";
            caja_trasera_login.style.opacity = "1";
        } else {
            formulario_register.style.display = "block";
            contenedor_login_register.style.left = "0px";
            formulario_login.style.display = "none";
            caja_trasera_register.style.display = "none";
            caja_trasera_login.style.display = "block";
            caja_trasera_login.style.opacity = "1";
        }
    }

    // FIN DE LA SECCION DE CODIGO QUE MANIPULA EL MODAL DE SIGN IN y LOG IN

    // IF screen small, convert to burger menu
    // Hamburger menu for mobile sidebar
    const hamburger = document.getElementById('hamburgerMenu');
    hamburger.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Optional: Hide sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 900 && sidebar.classList.contains('active')) {
            if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });
});