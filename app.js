document.addEventListener('DOMContentLoaded', function() {
    const menuIcon = document.getElementById('menu-icon');
    const menu = document.getElementById('menu');

    menuIcon.addEventListener('click', function() {
        menuIcon.classList.toggle('open');
        menu.classList.toggle('open');
    });

    const form = document.getElementById('contact-form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        let valid = true;

        // Validación del nombre
        if (!name) {
            document.getElementById('name-error').textContent = 'El nombre es requerido';
            valid = false;
        } else {
            document.getElementById('name-error').textContent = '';
        }

        // Validación del correo electrónico
        if (!email) {
            document.getElementById('email-error').textContent = 'El correo electrónico es requerido';
            valid = false;
        } else {
            document.getElementById('email-error').textContent = '';
        }

        // Validación del mensaje
        if (!message) {
            document.getElementById('message-error').textContent = 'El mensaje es requerido';
            valid = false;
        } else {
            document.getElementById('message-error').textContent = '';
        }

        // Si todos los campos son válidos
        if (valid) {
            document.getElementById('form-feedback').textContent = 'Formulario enviado con éxito';
            document.getElementById('form-feedback').style.color = '#4caf50'; // Verde claro
            form.reset();
        }
    });
});
