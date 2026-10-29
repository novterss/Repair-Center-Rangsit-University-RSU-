/* ==========================================================================
   ระบบแจ้งซ่อมและบำรุงรักษา (Repair & Maintenance Management System)
   App Shell Logic - Sidebar, Topbar, Mobile Drawer, User switcher, Toast
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initAppShell();
  initUserDropdown();
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
}

function initUserDropdown() {
  const dropdownTrigger = document.getElementById('userProfileDropdown');
  if (!dropdownTrigger) return;

  const users = DB.getUsers();
  const currentUser = DB.getCurrentUser();

  // Create a modal or quick popup to switch users for easy demo testing
  const menuContainer = document.getElementById('userProfileMenuOptions');
  if (menuContainer) {
    menuContainer.innerHTML = `
      <div class="p-2 border-bottom text-muted small">สลับบทบาทผู้ใช้ (สำหรับทดสอบ)</div>
      ${users.map(u => `
        <li>
          <a class="dropdown-item d-flex align-items-center gap-2 py-2 ${u.user_id === currentUser.user_id ? 'bg-light font-weight-bold' : ''}" 
             href="javascript:void(0)" onclick="switchUserRole(${u.user_id})">
            <span class="user-avatar-initials" style="width: 28px; height: 28px; font-size: 11px;">${u.avatar}</span>
            <div>
              <div class="fw-semibold text-dark">${u.full_name}</div>
              <div class="small text-muted">${u.role} (${u.department})</div>
            </div>
            ${u.user_id === currentUser.user_id ? '<i class="bi bi-check text-primary ms-auto fs-5"></i>' : ''}
          </a>
        </li>
      `).join('')}
      <li><hr class="dropdown-divider"></li>
      <li><a class="dropdown-item text-danger d-flex align-items-center gap-2" href="login.html"><i class="bi bi-box-arrow-left"></i> ออกจากระบบ</a></li>
    `;
  }
}

window.switchUserRole = function(userId) {
  const newUser = DB.setCurrentUser(userId);
  if (newUser) {
    showToast(`สลับผู้ใช้เป็น: ${newUser.full_name} (${newUser.role})`, 'success');
    updateTopbarUser();
    setTimeout(() => {
      // Reload current page to refresh user-specific data
      window.location.reload();
    }, 400);
  }
};

function highlightActiveMenu() {
  const currentPath = window.location.pathname;
  const pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';

  const navLinks = document.querySelectorAll('.sidebar-nav-item a, .mobile-nav-item');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === pageName || (pageName === '' && href === 'index.html')) {
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
        <span>${message}</span>
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 4000);
};

// Global dummy export
window.dummyExportData = function(filename) {
  showToast(`กำลังเตรียมไฟล์ส่งออก: ${filename}...`, 'info');
  setTimeout(() => {
    showToast(`ส่งออกข้อมูลสำเร็จ! ไฟล์บันทึกแล้ว`, 'success');
  }, 800);
};

