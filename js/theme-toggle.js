/* =============================================
   Pizzon — Theme Toggle JS  (external file)
   Place in: js/theme-toggle.js
   Load at bottom of <body> after other scripts
============================================= */
(function () {
  var KEY  = 'pizzon_theme';
  var body = document.body;
  var btn  = document.getElementById('theme-toggle');

  function applyTheme(theme) {
    if (theme === 'dark') {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }
  }

  /* Apply saved preference OR system preference on page load */
  var saved = localStorage.getItem(KEY);
  if (saved) {
    applyTheme(saved);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  }

  /* Toggle on button click */
  if (btn) {
    btn.addEventListener('click', function () {
      var isDark = body.classList.contains('dark-mode');
      var next   = isDark ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem(KEY, next);
    });
  }
})();
