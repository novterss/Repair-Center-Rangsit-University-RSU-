/* ==========================================================================
   ระบบแจ้งซ่อมและบำรุงรักษา (Repair & Maintenance Management System)
   App Shell Logic - Auth/Role Guard, Sidebar, Topbar, Mobile Drawer, Toast, Pager, Export
   ========================================================================== */

// Roles allowed to open each page (pages not listed are open to every logged-in user)
const PAGE_ROLES = {
  'assigned-tasks': [ROLE_TECH, ROLE_ADMIN],
  'maintenance-plans': [ROLE_TECH, ROLE_ADMIN]
};

// Page key from the URL, works for both "assets.html" and clean URLs like "/assets" (Vercel)
function getPageKey(path) {
  const clean = String(path || '').split(/[?#]/)[0].replace(/\/+$/, '');
  const last = clean.substring(clean.lastIndexOf('/') + 1).replace(/\.html$/, '');
  if (last === '' || last === 'dashboard') return 'index';
  return last;
}

function canAccessPage(pageKey, user) {
  const roles = PAGE_ROLES[pageKey];
  return !roles || (!!user && roles.includes(user.role));
}

function getHomePageFor(user) {
  return user && user.role === ROLE_TECH ? 'assigned-tasks.html' : 'index.html';
}

// Auth Guard: not logged in -> login page; logged in without permission -> home page of that role
(function checkAuthGuard() {
  const pageKey = getPageKey(window.location.pathname);
  if (pageKey === 'login') return;
  let target = null;
  if (!DB.isLoggedIn()) {
    target = 'login.html';
  } else if (!canAccessPage(pageKey, DB.getCurrentUser())) {
    target = getHomePageFor(DB.getCurrentUser());
  }
  if (target) {
    // Hide the page so its content does not flash before the redirect
    document.documentElement.style.visibility = 'hidden';
    window.location.replace(target);
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  initAppShell();
  initUserDropdown();
  applyRoleVisibility();
  highlightActiveMenu();
});

function initAppShell() {
  // Mobile Hamburger Toggle
  const mobileToggleBtn = document.getElementById('mobileMenuToggle');
  const sidebar = document.getElementById('appSidebar');
  const backdrop = document.getElementById('sidebarBackdrop');

  if (mobileToggleBtn && sidebar) {
    mobileToggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('show');
      if (backdrop) backdrop.classList.toggle('show');
    });
  }

  if (backdrop && sidebar) {
    backdrop.addEventListener('click', () => {
      sidebar.classList.remove('show');
      backdrop.classList.remove('show');
    });
  }

  // Intercept Sidebar Logout Links
  document.querySelectorAll('.sidebar-logout a').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      DB.logout();
    });
  });

  // Update Topbar User Information from DB
  updateTopbarUser();
}

function updateTopbarUser() {
  const currentUser = DB.getCurrentUser();
  if (!currentUser) return;

  const avatarEl = document.getElementById('topbarUserAvatar');
  const nameEl = document.getElementById('topbarUserName');
  const roleEl = document.getElementById('topbarUserRole');

  if (avatarEl) avatarEl.textContent = currentUser.avatar || currentUser.full_name.substring(0, 2);
  if (nameEl) nameEl.textContent = currentUser.full_name;
  if (roleEl) roleEl.textContent = currentUser.role;

  const todayEl = document.getElementById('topbarTodayDate');
  if (todayEl) {
    const d = new Date();
    todayEl.textContent = `${d.getDate()} ${THAI_MONTHS_FULL[d.getMonth()]} ${d.getFullYear() + 543}`;
  }
}

// Profile menu: shows the logged-in user and a logout action (no role switching)
function initUserDropdown() {
  const menuContainer = document.getElementById('userProfileMenuOptions');
  const currentUser = DB.getCurrentUser();
  if (!menuContainer || !currentUser) return;

  menuContainer.innerHTML = `
    <li class="px-3 py-2 border-bottom">
      <div class="fw-semibold text-dark">${escapeHtml(currentUser.full_name)}</div>
      <div class="small text-muted">${escapeHtml(currentUser.email)}</div>
      <div class="small text-muted d-flex align-items-center gap-1 mt-1">
        ${currentUser.student_id ? `<span class="badge bg-secondary-subtle text-secondary px-1 border" style="font-size: 10.5px;">${escapeHtml(currentUser.student_id)}</span>` : ''}
        <span>${escapeHtml(currentUser.role)}</span>
      </div>
    </li>
    <li><a class="dropdown-item text-danger d-flex align-items-center gap-2" href="javascript:void(0)" onclick="DB.logout()"><i class="bi bi-box-arrow-left"></i> ออกจากระบบ</a></li>
  `;
}

// Hide menu links to pages the current role cannot open, and elements marked data-roles="..."
function applyRoleVisibility() {
  const user = DB.getCurrentUser();
  document.querySelectorAll('.sidebar-nav-item a, .mobile-nav-item').forEach(link => {
    const key = getPageKey(link.getAttribute('href'));
    if (!canAccessPage(key, user)) {
      const target = link.closest('.sidebar-nav-item') || link;
      target.style.display = 'none';
    }
  });
  document.querySelectorAll('[data-roles]').forEach(el => {
    const roles = el.getAttribute('data-roles').split(',').map(r => r.trim());
    if (!user || !roles.includes(user.role)) el.style.display = 'none';
  });
}

function highlightActiveMenu() {
  const pageKey = getPageKey(window.location.pathname);

  const navLinks = document.querySelectorAll('.sidebar-nav-item a, .mobile-nav-item');
  navLinks.forEach(link => {
    if (getPageKey(link.getAttribute('href')) === pageKey) {
      const parentLi = link.closest('.sidebar-nav-item');
      if (parentLi) {
        document.querySelectorAll('.sidebar-nav-item').forEach(li => li.classList.remove('active'));
        parentLi.classList.add('active');
      }
      if (link.classList.contains('mobile-nav-item')) {
        document.querySelectorAll('.mobile-nav-item').forEach(m => m.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}

// Global Toast helper
window.showToast = function(message, type = 'info') {
  let toastContainer = document.getElementById('appToastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'appToastContainer';
    toastContainer.style.position = 'fixed';
    toastContainer.style.top = '20px';
    toastContainer.style.right = '20px';
    toastContainer.style.zIndex = '9999';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  const bgClass = type === 'success' ? 'bg-success text-white' : type === 'danger' ? 'bg-danger text-white' : 'bg-dark text-white';

  toast.className = `toast align-items-center ${bgClass} border-0 show mb-2 shadow`;
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body d-flex align-items-center gap-2">
        <i class="bi ${type === 'success' ? 'bi-check-circle-fill' : type === 'danger' ? 'bi-exclamation-triangle-fill' : 'bi-info-circle-fill'}"></i>
        <span>${escapeHtml(message)}</span>
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;
  toast.querySelector('.btn-close').addEventListener('click', () => toast.remove());

  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 4000);
};

// Pagination footer: fills the info text and the sibling .pagination-controls buttons
window.renderPager = function(infoElId, total, page, pageSize, unit, onPage) {
  const infoEl = document.getElementById(infoElId);
  if (!infoEl) return;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = total === 0 ? 0 : (current - 1) * pageSize + 1;
  const end = Math.min(total, current * pageSize);
  infoEl.textContent = `แสดง ${start}-${end} จาก ${total} ${unit}`;

  const controls = infoEl.parentElement.querySelector('.pagination-controls');
  if (!controls) return;
  controls.innerHTML = '';
  const addBtn = (html, targetPage, { disabled = false, active = false } = {}) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `page-btn${active ? ' active' : ''}`;
    btn.innerHTML = html;
    btn.disabled = disabled;
    btn.addEventListener('click', () => onPage(targetPage));
    controls.appendChild(btn);
  };
  addBtn('<i class="bi bi-chevron-left"></i>', current - 1, { disabled: current === 1 });
  for (let p = 1; p <= totalPages; p++) addBtn(String(p), p, { active: p === current });
  addBtn('<i class="bi bi-chevron-right"></i>', current + 1, { disabled: current === totalPages });
};

// Slice of a list for the given page (page is clamped to a valid range)
window.paginate = function(list, page, pageSize) {
  const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
  const current = Math.min(Math.max(1, page), totalPages);
  return { page: current, items: list.slice((current - 1) * pageSize, current * pageSize) };
};

// Download rows as a CSV file (UTF-8 with BOM so Excel shows Thai text correctly)
window.exportCSV = function(filename, headers, rows) {
  const cell = v => `"${String(v === null || v === undefined ? '' : v).replace(/"/g, '""')}"`;
  const csv = [headers, ...rows].map(r => r.map(cell).join(',')).join('\r\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast(`ส่งออกข้อมูล ${rows.length} รายการ เป็นไฟล์ ${filename} แล้ว`, 'success');
};
