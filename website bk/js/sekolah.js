/**
 * PORTAL KEDINASAN RI - DATA & DIREKTORI SEKOLAH
 * Mengambil data/sekolah.json, melakukan filter pencarian, kategori bidang,
 * merender kartu sekolah, dan mengelola modal dialog interaktif.
 */

let sekolahData = [];
let activeCategory = 'all';
let searchQuery = '';
let onlyIkatanDinas = false;

document.addEventListener('DOMContentLoaded', () => {
  loadSekolahData();
  setupFilterEvents();
  setupModalEvents();
});

/**
 * 1. Muat data dari data/sekolah.json
 */
async function loadSekolahData() {
  const container = document.getElementById('schools-container');
  if (!container) return;

  try {
    const response = await fetch('data/sekolah.json');
    if (!response.ok) {
      throw new Error(`Gagal memuat data: ${response.status}`);
    }
    sekolahData = await response.json();
    renderSchools();
    checkUrlHashForModal();
  } catch (error) {
    console.error('Kesalahan saat memuat data sekolah:', error);
    container.innerHTML = `
      <div class="empty-state">
        <svg class="empty-state-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <h3>Gagal Memuat Data Sekolah</h3>
        <p>Terjadi kendala saat membaca file data institusi. Silakan muat ulang peramban Anda.</p>
        <button class="btn btn-primary btn-sm" onclick="location.reload()">Muat Ulang</button>
      </div>
    `;
  }
}

/**
 * 2. Event Listener untuk Pencarian & Filter
 */
function setupFilterEvents() {
  const searchInput = document.getElementById('school-search-input');
  const clearBtn = document.getElementById('search-clear-btn');
  const chips = document.querySelectorAll('.chip[data-category]');
  const ikatanToggle = document.getElementById('toggle-ikatan-dinas');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      if (clearBtn) {
        clearBtn.style.display = searchQuery.length > 0 ? 'block' : 'none';
      }
      renderSchools();
    });
  }

  if (clearBtn && searchInput) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      clearBtn.style.display = 'none';
      searchInput.focus();
      renderSchools();
    });
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      activeCategory = chip.getAttribute('data-category');
      renderSchools();
    });
  });

  if (ikatanToggle) {
    ikatanToggle.addEventListener('change', (e) => {
      onlyIkatanDinas = e.target.checked;
      renderSchools();
    });
  }
}

/**
 * 3. Render Kartu Sekolah ke DOM
 */
function renderSchools() {
  const container = document.getElementById('schools-container');
  const counterEl = document.getElementById('schools-count');
  if (!container) return;

  const filtered = sekolahData.filter((item) => {
    // Filter Kategori Bidang
    const matchCategory = activeCategory === 'all' || item.bidang === activeCategory;

    // Filter Status Ikatan Dinas
    const matchIkatan = !onlyIkatanDinas || item.ikatan_dinas === true;

    // Filter Kata Kunci (Pencarian)
    const query = searchQuery;
    const matchSearch =
      !query ||
      item.nama.toLowerCase().includes(query) ||
      item.singkatan.toLowerCase().includes(query) ||
      item.kementerian.toLowerCase().includes(query) ||
      item.bidang_label.toLowerCase().includes(query) ||
      item.lokasi.toLowerCase().includes(query) ||
      (item.tags && item.tags.some((t) => t.toLowerCase().includes(query))) ||
      (item.prodi && item.prodi.some((p) => p.nama.toLowerCase().includes(query)));

    return matchCategory && matchIkatan && matchSearch;
  });

  // Update Penghitung
  if (counterEl) {
    counterEl.textContent = `Menampilkan ${filtered.length} dari ${sekolahData.length} institusi kedinasan`;
  }

  // Jika Kosong
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg class="empty-state-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
        <h3>Tidak Ditemukan Sekolah yang Sesuai</h3>
        <p>Tidak ada sekolah yang cocok dengan kriteria kata kunci "${escapeHtml(searchQuery)}" atau filter yang dipilih.</p>
        <button class="btn btn-outline btn-sm" onclick="resetFilters()">Reset Filter & Cari Ulang</button>
      </div>
    `;
    return;
  }

  // Render Kartu
  container.innerHTML = filtered
    .map((school) => {
      const prodiPreviews = (school.prodi || []).slice(0, 3);
      const isIkatan = school.ikatan_dinas;
      const statusBadge = isIkatan
        ? `<span class="badge badge-success">Ikatan Dinas ASN</span>`
        : `<span class="badge badge-neutral">Reguler / Polbit</span>`;

      return `
        <article class="school-card" id="card-${school.id}">
          <div class="school-card-top">
            <div class="school-badge-row">
              <span class="badge badge-gold">${escapeHtml(school.bidang_label)}</span>
              ${statusBadge}
            </div>
            <div class="school-acronym">${escapeHtml(school.singkatan)}</div>
            <h2 class="school-name">${escapeHtml(school.nama)}</h2>
          </div>

          <div class="school-card-body">
            <div class="school-info-row">
              <svg class="school-info-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21h18"></path><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path><path d="M9 9h1"></path><path d="M9 13h1"></path><path d="M9 17h1"></path><path d="M14 9h1"></path><path d="M14 13h1"></path><path d="M14 17h1"></path></svg>
              <span>${escapeHtml(school.kementerian)}</span>
            </div>

            <div class="school-info-row">
              <svg class="school-info-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>${escapeHtml(school.lokasi)}</span>
            </div>

            <p class="school-desc">${escapeHtml(school.deskripsi_singkat)}</p>

            <div class="school-prodi-preview">
              <span>Program Studi Pilihan:</span>
              <div class="prodi-tag-list">
                ${prodiPreviews
                  .map((p) => `<span class="prodi-tag">${escapeHtml(p.jenjang)} ${escapeHtml(p.nama)}</span>`)
                  .join('')}
                ${
                  (school.prodi || []).length > 3
                    ? `<span class="prodi-tag">+${(school.prodi || []).length - 3} lainnya</span>`
                    : ''
                }
              </div>
            </div>
          </div>

          <div class="school-card-footer">
            <span style="font-size: 0.75rem; color: var(--color-text-muted);">
              ${escapeHtml(school.biaya_pendidikan || 'Biaya ditanggung')}
            </span>
            <button 
              type="button" 
              class="btn btn-primary btn-sm" 
              onclick="openSchoolModal('${school.id}')"
              aria-label="Lihat detail lengkap ${escapeHtml(school.singkatan)}"
            >
              Detail Lengkap
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        </article>
      `;
    })
    .join('');
}

/**
 * 4. Buka Modal Dialog Detail Sekolah
 */
window.openSchoolModal = function (schoolId) {
  const school = sekolahData.find((s) => s.id === schoolId);
  if (!school) return;

  const modalBackdrop = document.getElementById('school-modal');
  const modalContent = document.getElementById('modal-dynamic-content');
  if (!modalBackdrop || !modalContent) return;

  const prodiItemsHtml = (school.prodi || [])
    .map(
      (p) => `
        <div class="prodi-item">
          <strong>${escapeHtml(p.nama)}</strong>
          <span class="badge badge-navy">${escapeHtml(p.jenjang)}</span>
        </div>
      `
    )
    .join('');

  const placementHtml = (school.penempatan_instansi || [])
    .map((item) => `<li class="career-bullet-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-600)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg><span>${escapeHtml(item)}</span></li>`)
    .join('');

  const jabatanHtml = (school.contoh_jabatan || [])
    .map((item) => `<li class="career-bullet-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-navy-700)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg><span>${escapeHtml(item)}</span></li>`)
    .join('');

  modalContent.innerHTML = `
    <div class="modal-header">
      <span class="kicker kicker-light">${escapeHtml(school.bidang_label)} • ${escapeHtml(school.singkatan)}</span>
      <h2 id="modal-title">${escapeHtml(school.nama)}</h2>
      <p class="sub-ministry">${escapeHtml(school.kementerian)}</p>
      <button 
        type="button" 
        class="modal-close-btn" 
        onclick="closeSchoolModal()" 
        aria-label="Tutup jendela rincian sekolah"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>

    <div class="modal-body">
      <!-- Grid Fakta Kunci -->
      <div class="modal-info-grid">
        <div class="modal-info-item">
          <div class="label">Status Ikatan Dinas</div>
          <div class="value">${school.ikatan_dinas ? 'Ikatan Dinas (Prospek Pengangkatan CPNS)' : 'Program Pola Pembibitan / Mandiri'}</div>
        </div>
        <div class="modal-info-item">
          <div class="label">Biaya Pendidikan</div>
          <div class="value">${escapeHtml(school.biaya_pendidikan || 'Sesuai Ketentuan')}</div>
        </div>
        <div class="modal-info-item">
          <div class="label">Lokasi Kampus</div>
          <div class="value">${escapeHtml(school.lokasi)}</div>
        </div>
        <div class="modal-info-item">
          <div class="label">Pola Pembinaan</div>
          <div class="value">${school.id === 'ipdn' ? 'Kedinasan Semi-Militer / Asrama Penuh' : 'Vokasi Terapan Kedinasan'}</div>
        </div>
      </div>

      <!-- Profil & Deskripsi -->
      <div>
        <h3 class="modal-section-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
          Profil Singkat & Karakteristik
        </h3>
        <p style="font-size: 0.9375rem; line-height: 1.65; color: var(--color-text-body);">
          ${escapeHtml(school.deskripsi_lengkap || school.deskripsi_singkat)}
        </p>
      </div>

      <!-- Program Studi -->
      <div>
        <h3 class="modal-section-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
          Daftar Program Studi / Jurusan
        </h3>
        <div class="prodi-list-detailed">
          ${prodiItemsHtml}
        </div>
      </div>

      <!-- Penempatan & Prospek Karier -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4);">
        <div>
          <h3 class="modal-section-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
            Instansi Penempatan
          </h3>
          <ul class="career-bullets" style="grid-template-columns: 1fr;">
            ${placementHtml}
          </ul>
        </div>
        <div>
          <h3 class="modal-section-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            Contoh Jabatan Karier
          </h3>
          <ul class="career-bullets" style="grid-template-columns: 1fr;">
            ${jabatanHtml}
          </ul>
        </div>
      </div>

      <!-- Persyaratan Khusus & Catatan -->
      <div style="background-color: var(--color-surface-bone); border: 1px solid var(--color-border-subtle); padding: var(--space-4); border-radius: var(--radius-sm);">
        <h3 class="modal-section-title" style="color: var(--color-navy-900);">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          Ketentuan Khusus & Catatan Seleksi
        </h3>
        <p style="font-size: 0.875rem; color: var(--color-text-body); margin-bottom: var(--space-2);">
          ${escapeHtml(school.persyaratan_khusus || 'Memenuhi standar kesehatan, kesamaptaan fisik, dan persyaratan akademis instansi terkait.')}
        </p>
        <p style="font-size: 0.75rem; color: var(--color-text-muted); font-style: italic;">
          * Catatan: ${escapeHtml(school.catatan || 'Persyaratan usia, kuota formasi, dan tanggal pendaftaran berubah setiap tahun. Pastikan memeriksa portal resmi.')}
        </p>
      </div>
    </div>

    <div class="modal-footer">
      <button type="button" class="btn btn-outline btn-sm" onclick="closeSchoolModal()">Tutup</button>
      <div style="display: flex; gap: var(--space-2); flex-wrap: wrap;">
        ${
          school.website
            ? `<a href="${school.website}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
                Web Resmi Kampus
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </a>`
            : ''
        }
        ${
          school.portal_pendaftaran
            ? `<a href="${school.portal_pendaftaran}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
                Portal Penerimaan
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </a>`
            : ''
        }
      </div>
    </div>
  `;

  modalBackdrop.classList.add('is-visible');
  document.body.classList.add('modal-open');
  modalBackdrop.setAttribute('aria-hidden', 'false');

  // Fokus ke tombol tutup untuk aksesibilitas
  setTimeout(() => {
    const closeBtn = modalContent.querySelector('.modal-close-btn');
    if (closeBtn) closeBtn.focus();
  }, 100);

  // Update hash URL tanpa reload
  history.replaceState(null, '', `#${school.id}`);
};

/**
 * 5. Tutup Modal
 */
window.closeSchoolModal = function () {
  const modalBackdrop = document.getElementById('school-modal');
  if (!modalBackdrop) return;

  modalBackdrop.classList.remove('is-visible');
  document.body.classList.remove('modal-open');
  modalBackdrop.setAttribute('aria-hidden', 'true');

  // Bersihkan hash dari URL
  if (window.location.hash) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
};

/**
 * 6. Setup Event Modal (Klik Backdrop & Keyboard Escape)
 */
function setupModalEvents() {
  const modalBackdrop = document.getElementById('school-modal');
  if (!modalBackdrop) return;

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeSchoolModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('is-visible')) {
      closeSchoolModal();
    }
  });
}

/**
 * 7. Reset Filter
 */
window.resetFilters = function () {
  searchQuery = '';
  activeCategory = 'all';
  onlyIkatanDinas = false;

  const searchInput = document.getElementById('school-search-input');
  if (searchInput) searchInput.value = '';

  const clearBtn = document.getElementById('search-clear-btn');
  if (clearBtn) clearBtn.style.display = 'none';

  const chips = document.querySelectorAll('.chip[data-category]');
  chips.forEach((c) => {
    if (c.getAttribute('data-category') === 'all') {
      c.classList.add('active');
    } else {
      c.classList.remove('active');
    }
  });

  const ikatanToggle = document.getElementById('toggle-ikatan-dinas');
  if (ikatanToggle) ikatanToggle.checked = false;

  renderSchools();
};

/**
 * 8. Buka Modal jika URL mengandung hash ID sekolah
 */
function checkUrlHashForModal() {
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    const exists = sekolahData.some((s) => s.id === hash);
    if (exists) {
      openSchoolModal(hash);
    }
  }
}

/**
 * Utilitas escape HTML untuk keamanan XSS
 */
function escapeHtml(string) {
  if (string === null || string === undefined) return '';
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
