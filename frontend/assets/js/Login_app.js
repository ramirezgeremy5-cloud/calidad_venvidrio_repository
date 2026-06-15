/* =============================================
   Venvidrio — Sistema de Control de Calidad
   app.js
   ============================================= */

(function () {
  'use strict';

  /* ------ Referencias al DOM ------ */
  const usernameInput  = document.getElementById('username');
  const passwordInput  = document.getElementById('password');
  const roleSelect     = document.getElementById('role');
  const pwToggleBtn    = document.getElementById('pwToggle');
  const pwIcon         = document.getElementById('pwIcon');
  const submitBtn      = document.getElementById('submitBtn');
  const successOverlay = document.getElementById('successOverlay');

  /* ------ Toggle mostrar / ocultar contraseña ------ */
  pwToggleBtn.addEventListener('click', () => {
    const isHidden = passwordInput.type === 'password';
    passwordInput.type = isHidden ? 'text' : 'password';
    pwIcon.className   = isHidden ? 'ti ti-eye-off' : 'ti ti-eye';
    pwToggleBtn.setAttribute('aria-label', isHidden ? 'Ocultar contraseña' : 'Mostrar contraseña');
  });

  /* ------ Limpieza de error al escribir ------ */
  [usernameInput, passwordInput, roleSelect].forEach(el => {
    el.addEventListener('input',  () => el.classList.remove('error'));
    el.addEventListener('change', () => el.classList.remove('error'));
  });

  /* ------ Validación básica ------ */
  function validate() {
    let valid = true;

    [usernameInput, passwordInput, roleSelect].forEach(el => {
      el.classList.remove('error');
      if (!el.value.trim()) {
        /* Forzar reflow para que la animación se dispare aunque ya tenga la clase */
        void el.offsetWidth;
        el.classList.add('error');
        valid = false;
      }
    });

    return valid;
  }

  /* ------ Mostrar estado de carga ------ */
  function setLoading(state) {
    if (state) {
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
    } else {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  }

  /* ------ Mostrar overlay de éxito ------ */
  function showSuccess(duration = 2800) {
    successOverlay.classList.add('show');
    setTimeout(() => successOverlay.classList.remove('show'), duration);
  }

  /* ------ Lógica de login ------ */
  function handleLogin() {
    if (!validate()) return;

    setLoading(true);

    /*
     * Aquí iría la llamada real a tu API, por ejemplo:
     *
     * fetch('/api/auth/login', {
     *   method: 'POST',
     *   headers: { 'Content-Type': 'application/json' },
     *   body: JSON.stringify({
     *     username: usernameInput.value.trim(),
     *     password: passwordInput.value,
     *     role:     roleSelect.value,
     *   }),
     * })
     * .then(res => res.json())
     * .then(data => {
     *   setLoading(false);
     *   if (data.success) {
     *     showSuccess();
     *     // window.location.href = '/dashboard';
     *   } else {
     *     alert('Credenciales incorrectas');
     *   }
     * })
     * .catch(err => {
     *   setLoading(false);
     *   console.error('Error de autenticación:', err);
     * });
     *
     * Por ahora simulamos un retardo de 1.8 s:
     */
    setTimeout(() => {
      setLoading(false);
      showSuccess();
      /* Descomentar la siguiente línea para redirigir tras el login:
         window.location.href = '/dashboard'; */
    }, 1800);
  }

  /* ------ Evento del botón ------ */
  submitBtn.addEventListener('click', handleLogin);

  /* ------ Permitir envío con Enter ------ */
  [usernameInput, passwordInput, roleSelect].forEach(el => {
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter') handleLogin();
    });
  });

})();
