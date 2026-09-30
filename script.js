/* ==========================================================================
   script.js — share, toast, fallback avatar
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- 1. Fallback avatar bila gambar gagal dimuat ---------- */
  var avatar = document.querySelector('.avatar');
  if (avatar) {
    var markFailed = function () {
      var wrapper = avatar.closest('.avatar-wrapper');
      if (!wrapper || wrapper.classList.contains('avatar-failed')) return;

      wrapper.classList.add('avatar-failed');
      wrapper.setAttribute('role', 'img');
      wrapper.setAttribute('aria-label', 'Logo HorizonX');
    };

    avatar.addEventListener('error', markFailed);

    /* Gambar mungkin sudah gagal sebelum listener terpasang */
    if (avatar.complete && avatar.naturalWidth === 0) markFailed();
  }

  /* ---------- 2. Toast ---------- */
  var toastEl = document.getElementById('toast');
  var toastTimer = null;

  function showToast(message) {
    if (!toastEl) return;

    toastEl.textContent = message;
    toastEl.classList.add('is-visible');

    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toastEl.classList.remove('is-visible');
      toastEl.textContent = '';
    }, 2000);
  }

  /* ---------- 3. Salin cara lama (textarea + execCommand) ---------- */
  function legacyCopy(text) {
    var area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.top = '-1000px';
    area.style.opacity = '0';

    document.body.appendChild(area);
    area.select();
    area.setSelectionRange(0, area.value.length);

    var ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (e) {
      ok = false;
    }

    document.body.removeChild(area);
    return ok;
  }

  /* ---------- 4. Salin link (clipboard API -> fallback) ---------- */
  function copyLink(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        showToast('Link disalin');
      }).catch(function () {
        showToast(legacyCopy(text) ? 'Link disalin' : 'Gagal menyalin link');
      });
      return;
    }

    showToast(legacyCopy(text) ? 'Link disalin' : 'Gagal menyalin link');
  }

  /* ---------- 5. Tombol share ---------- */
  var shareBtn = document.getElementById('shareBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', function () {
      var url = window.location.href;

      if (navigator.share) {
        navigator.share({
          title: document.title,
          text: 'm1sb1sm4n',
          url: url
        }).catch(function (err) {
          /* Pengguna menutup dialog share -> abaikan */
          if (err && err.name === 'AbortError') return;
          copyLink(url);
        });
        return;
      }

      copyLink(url);
    });
  }
})();
