// ============================================
// 1. БАЗОВІ ЗМІННІ ТА ІНІЦІАЛІЗАЦІЯ
// ============================================
const header = document.getElementById('navbar');
const sections = document.querySelectorAll('section');
const callBtn = document.getElementById('callButton');
let lastScroll = 0;

// ============================================
// 2. ХЕДЕР І АНІМАЦІЇ
// ============================================
window.addEventListener('load', () => {
  setTimeout(() => { 
    if (header) header.classList.add('visible'); 
  }, 300);
});

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  
  if (currentScroll > lastScroll && currentScroll > 100) {
    header.style.top = "-100px";
  } else {
    header.style.top = currentScroll > 50 ? "10px" : "20px";
    header.classList.toggle('scrolled', currentScroll > 50);
  }
  lastScroll = currentScroll;

  sections.forEach(sec => {
    const rect = sec.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8) {
      sec.classList.add('show');
    }
  });
});

// ============================================
// 3. МОДАЛЬНЕ ВІКНО ЗВ'ЯЗКУ
// ============================================
function openContact() {
  const bar = document.getElementById("contactBar");
  const overlay = document.getElementById("contactOverlay");
  const horizontal = document.getElementById("horizontalContact");
  if (bar) bar.classList.add("active");
  if (overlay) overlay.classList.add("active");
  if (horizontal) horizontal.style.opacity = "0";
}

function closeContact() {
  const bar = document.getElementById("contactBar");
  const overlay = document.getElementById("contactOverlay");
  const horizontal = document.getElementById("horizontalContact");
  if (bar) bar.classList.remove("active");
  if (overlay) overlay.classList.remove("active");
  setTimeout(() => { 
    if (horizontal) horizontal.style.opacity = "1"; 
  }, 400);
}

function sendMail() {
  const poshta = "forma3d.info.ua@gmail.com";
  const polePovidomlennya = document.getElementById("message");
  if (!polePovidomlennya) return;
  
  const tekstPovidomlennya = polePovidomlennya.value.trim();
  
  if (!tekstPovidomlennya) { 
    polePovidomlennya.classList.add("pomylka");
    polePovidomlennya.placeholder = "Введіть ваше повідомлення...";
    setTimeout(() => {
      polePovidomlennya.classList.remove("pomylka");
    }, 1500);
    return; 
  }

  const temaLista = encodeURIComponent("Замовлення Forma3D");
  const tekstEncoded = encodeURIComponent(tekstPovidomlennya);
  const tseWindows = navigator.platform.toLowerCase().indexOf('win') !== -1;

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${poshta}&su=${temaLista}&body=${tekstEncoded}`;
  const mailtoUrl = `mailto:${poshta}?subject=${temaLista}&body=${tekstEncoded}`;

  if (tseWindows) {
    window.open(gmailUrl, '_blank');
  } else {
    window.location.href = mailtoUrl;
  }
  closeContact();
}

function sendMailDirect(email, subjectText = "Питання щодо Forma3D") {
  const temaLista = encodeURIComponent(subjectText);
  const tekstEncoded = encodeURIComponent("Вітаю! У мене є питання щодо...");
  const tseWindows = navigator.platform.toLowerCase().indexOf('win') !== -1;

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${temaLista}&body=${tekstEncoded}`;
  const mailtoUrl = `mailto:${email}?subject=${temaLista}&body=${tekstEncoded}`;

  if (tseWindows) {
    window.open(gmailUrl, '_blank');
  } else {
    window.location.href = mailtoUrl;
  }
}

// ============================================
// 4. COOKIE БАНЕР
// ============================================
const COOKIE_VERSION = "1.1"; 

document.addEventListener('DOMContentLoaded', () => {
  const banner = document.getElementById('cookieBanner');
  const savedVersion = localStorage.getItem('cookiesAcceptedVersion');

  if (banner && savedVersion !== COOKIE_VERSION) {
    setTimeout(() => {
      banner.classList.add('active');
      if (callBtn) callBtn.classList.add('shifted');
    }, 1500);
  }
});

function acceptCookies() {
  const banner = document.getElementById('cookieBanner');
  if (banner) {
    banner.classList.remove('active');
    if (callBtn) callBtn.classList.remove('shifted');
    localStorage.setItem('cookiesAcceptedVersion', COOKIE_VERSION);
  }
}

// ============================================
// 5. iOS СПОВІЩЕННЯ
// ============================================
function showNotification(title, message, icon = '✔', duration = 3000) {
  const notification = document.getElementById('iosNotification');
  const titleEl = document.getElementById('notificationTitle');
  const messageEl = document.getElementById('notificationMessage');
  const iconEl = document.getElementById('notificationIcon');
  
  if (!notification || !titleEl || !messageEl || !iconEl) return;
  
  titleEl.textContent = title;
  messageEl.textContent = message;
  iconEl.textContent = icon;
  
  notification.classList.add('active');
  
  clearTimeout(notification._timeout);
  notification._timeout = setTimeout(() => {
    notification.classList.remove('active');
  }, duration);
  
  notification.onclick = function() {
    this.classList.remove('active');
    clearTimeout(this._timeout);
  };
}

// ============================================
// 6. ПРОФІЛЬ - ГОЛОВНА ЛОГІКА
// ============================================
let currentUser = null;
let verificationCode = null;
let tempEmail = null;
let tempPassword = null;
let isVerifyingForReset = false;

document.addEventListener('DOMContentLoaded', function() {
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    try {
      currentUser = JSON.parse(savedUser);
      updateProfileUI();
    } catch(e) {
      console.log('Помилка парсингу користувача');
    }
  }
  
  const profileIcon = document.getElementById('profileIcon');
  if (profileIcon) {
    profileIcon.addEventListener('click', function(e) {
      e.stopPropagation();
      handleProfileClick();
    });
  }
});

function handleProfileClick() {
  if (currentUser) {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('userPanel').style.display = 'block';
    document.getElementById('changePasswordForm').style.display = 'none';
    document.getElementById('userEmailDisplay').textContent = currentUser.email;
  } else {
    resetProfileForms();
  }
  openProfile();
}

function openProfile() {
  const overlay = document.getElementById('profileOverlay');
  const modal = document.getElementById('profileModal');
  if (overlay) overlay.classList.add('active');
  if (modal) modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProfile() {
  const overlay = document.getElementById('profileOverlay');
  const modal = document.getElementById('profileModal');
  if (overlay) overlay.classList.remove('active');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = 'auto';
  resetProfileForms();
}

function resetProfileForms() {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const userPanel = document.getElementById('userPanel');
  const changePasswordForm = document.getElementById('changePasswordForm');
  const forgotPasswordForm = document.getElementById('forgotPasswordForm');
  const verificationForm = document.getElementById('verificationForm');
  
  if (loginForm) loginForm.style.display = 'block';
  if (registerForm) registerForm.style.display = 'none';
  if (userPanel) userPanel.style.display = 'none';
  if (changePasswordForm) changePasswordForm.style.display = 'none';
  if (forgotPasswordForm) forgotPasswordForm.style.display = 'none';
  if (verificationForm) verificationForm.style.display = 'none';
}

function showRegisterForm() {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  if (loginForm) loginForm.style.display = 'none';
  if (registerForm) registerForm.style.display = 'block';
}

function showLoginForm() {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  if (loginForm) loginForm.style.display = 'block';
  if (registerForm) registerForm.style.display = 'none';
}

// ============================================
// 7. ЛОГІН ТА РЕЄСТРАЦІЯ
// ============================================
function loginUser() {
  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');
  
  if (!emailInput || !passwordInput) return;
  
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    showNotification('Помилка', 'Будь ласка, заповніть всі поля', '✕');
    return;
  }

  if (!email.includes('@')) {
    showNotification('Помилка', 'Введіть коректну email адресу', '✕');
    return;
  }

  const users = JSON.parse(localStorage.getItem('users') || '{}');
  
  if (users[email] && users[email].password === password) {
    currentUser = { email, password };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateProfileUI();
    closeProfile();
    showNotification('Вітаємо!', 'Вхід виконано успішно', '✔');
  } else {
    showNotification('Помилка', 'Невірний email або пароль', '✕');
  }
}

function registerUser() {
  const emailInput = document.getElementById('registerEmail');
  const passwordInput = document.getElementById('registerPassword');
  const confirmInput = document.getElementById('registerPasswordConfirm');
  
  if (!emailInput || !passwordInput || !confirmInput) return;
  
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const confirm = confirmInput.value.trim();

  if (!email || !password || !confirm) {
    showNotification('Помилка', 'Будь ласка, заповніть всі поля', '✕');
    return;
  }

  if (!email.includes('@')) {
    showNotification('Помилка', 'Введіть коректну email адресу', '✕');
    return;
  }

  if (password.length < 8) {
    showNotification('Помилка', 'Пароль має містити мінімум 8 символів', '✕');
    return;
  }

  if (password !== confirm) {
    showNotification('Помилка', 'Паролі не співпадають', '✕');
    return;
  }

  const users = JSON.parse(localStorage.getItem('users') || '{}');
  
  if (users[email]) {
    showNotification('Помилка', 'Користувач з таким email вже існує', '✕');
    return;
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  verificationCode = code;
  tempEmail = email;
  tempPassword = password;
  isVerifyingForReset = false;

  const subject = encodeURIComponent('Код підтвердження Forma3D');
  const body = encodeURIComponent(`Ваш код підтвердження: ${code}`);
  window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`, '_blank');

  const registerForm = document.getElementById('registerForm');
  const verificationForm = document.getElementById('verificationForm');
  const verificationMessage = document.getElementById('verificationMessage');
  
  if (registerForm) registerForm.style.display = 'none';
  if (verificationForm) verificationForm.style.display = 'block';
  if (verificationMessage) verificationMessage.textContent = `Код надіслано на ${email}`;
  
  showNotification('Код надіслано!', `Перевірте пошту ${email}`, '✉︎');
}

// ============================================
// 8. ПІДТВЕРДЖЕННЯ КОДУ
// ============================================
function verifyCode() {
  const codeInput = document.getElementById('verificationCode');
  if (!codeInput) return;
  
  const code = codeInput.value.trim();
  
  if (code === verificationCode) {
    if (isVerifyingForReset) {
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      if (tempEmail && users[tempEmail]) {
        const verificationForm = document.getElementById('verificationForm');
        const forgotForm = document.getElementById('forgotPasswordForm');
        
        if (verificationForm) verificationForm.style.display = 'none';
        if (forgotForm) {
          forgotForm.style.display = 'block';
          forgotForm.innerHTML = `
            <label style="font-size: 12px; color: var(--text-gray);">Новий пароль (мін. 8 символів)</label>
            <input type="password" id="resetNewPassword" placeholder="Введіть новий пароль" style="width:100%; background: #1a1a1c; border: 1px solid var(--border); border-radius: 12px; padding: 14px; color: white; margin-bottom: 15px; outline: none; font-size: 16px;">
            <label style="font-size: 12px; color: var(--text-gray);">Підтвердіть пароль</label>
            <input type="password" id="resetConfirmPassword" placeholder="Підтвердіть пароль" style="width:100%; background: #1a1a1c; border: 1px solid var(--border); border-radius: 12px; padding: 14px; color: white; margin-bottom: 15px; outline: none; font-size: 16px;">
            <button onclick="saveResetPassword()" style="width:100%; padding: 16px; background: white; color: black; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; margin-bottom: 10px; user-select: none;">Зберегти новий пароль</button>
            <button onclick="cancelForgotPassword()" style="width:100%; padding: 14px; background: rgba(255,255,255,0.05); color: var(--text-gray); border: 1px solid var(--border); border-radius: 12px; font-weight: 600; cursor: pointer; user-select: none;">Назад</button>
          `;
        }
        showNotification('Код підтверджено!', 'Введіть новий пароль', '✔');
      }
    } else {
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      users[tempEmail] = { password: tempPassword };
      localStorage.setItem('users', JSON.stringify(users));
      
      currentUser = { email: tempEmail, password: tempPassword };
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      
      updateProfileUI();
      closeProfile();
      showNotification('Вітаємо!', 'Ваш акаунт створено успішно!', '✔');
      
      tempEmail = null;
      tempPassword = null;
      verificationCode = null;
    }
  } else {
    showNotification('Помилка', 'Невірний код! Спробуйте ще раз', '✕');
  }
}

// ============================================
// 9. ЗМІНА ТА ВІДНОВЛЕННЯ ПАРОЛЯ
// ============================================
function saveResetPassword() {
  const newPassInput = document.getElementById('resetNewPassword');
  const confirmPassInput = document.getElementById('resetConfirmPassword');
  
  if (!newPassInput || !confirmPassInput) return;
  
  const newPass = newPassInput.value.trim();
  const confirmPass = confirmPassInput.value.trim();
  
  if (!newPass || !confirmPass) {
    showNotification('Помилка', 'Заповніть всі поля', '✕');
    return;
  }
  
  if (newPass.length < 8) {
    showNotification('Помилка', 'Пароль має містити мінімум 8 символів', '✕');
    return;
  }
  
  if (newPass !== confirmPass) {
    showNotification('Помилка', 'Паролі не співпадають', '✕');
    return;
  }
  
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  if (tempEmail && users[tempEmail]) {
    users[tempEmail].password = newPass;
    localStorage.setItem('users', JSON.stringify(users));
    
    if (currentUser && currentUser.email === tempEmail) {
      currentUser.password = newPass;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    
    showNotification('Успішно!', 'Пароль змінено', '✔');
    closeProfile();
    verificationCode = null;
    tempEmail = null;
    isVerifyingForReset = false;
  }
}

function showChangePasswordForm() {
  const userPanel = document.getElementById('userPanel');
  const changeForm = document.getElementById('changePasswordForm');
  if (userPanel) userPanel.style.display = 'none';
  if (changeForm) changeForm.style.display = 'block';
}

function cancelChangePassword() {
  const userPanel = document.getElementById('userPanel');
  const changeForm = document.getElementById('changePasswordForm');
  if (userPanel) userPanel.style.display = 'block';
  if (changeForm) changeForm.style.display = 'none';
}

function saveNewPassword() {
  const newPassInput = document.getElementById('newPassword');
  if (!newPassInput) return;
  
  const newPass = newPassInput.value.trim();
  if (!newPass || newPass.length < 8) {
    showNotification('Помилка', 'Пароль має містити мінімум 8 символів', '✕');
    return;
  }
  
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  if (users[currentUser.email]) {
    users[currentUser.email].password = newPass;
    localStorage.setItem('users', JSON.stringify(users));
    currentUser.password = newPass;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    showNotification('Успішно!', 'Пароль змінено', '✔');
    cancelChangePassword();
    document.getElementById('userPasswordDisplay').textContent = '••••••••';
  }
}

// ============================================
// 10. ЗАБУЛИ ПАРОЛЬ
// ============================================
function showForgotPassword() {
  const loginForm = document.getElementById('loginForm');
  const forgotForm = document.getElementById('forgotPasswordForm');
  if (loginForm) loginForm.style.display = 'none';
  if (forgotForm) forgotForm.style.display = 'block';
}

function sendResetCode() {
  const emailInput = document.getElementById('forgotEmail');
  if (!emailInput) return;
  
  const email = emailInput.value.trim();
  if (!email || !email.includes('@')) {
    showNotification('Помилка', 'Введіть коректну email адресу', '✕');
    return;
  }
  
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  if (!users[email]) {
    showNotification('Помилка', 'Користувача з таким email не знайдено', '✕');
    return;
  }
  
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  verificationCode = code;
  tempEmail = email;
  isVerifyingForReset = true;
  
  const subject = encodeURIComponent('Код відновлення пароля Forma3D');
  const body = encodeURIComponent(`Ваш код для відновлення пароля: ${code}`);
  window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`, '_blank');
  
  const forgotForm = document.getElementById('forgotPasswordForm');
  const verificationForm = document.getElementById('verificationForm');
  const verificationMessage = document.getElementById('verificationMessage');
  
  if (forgotForm) forgotForm.style.display = 'none';
  if (verificationForm) verificationForm.style.display = 'block';
  if (verificationMessage) verificationMessage.textContent = 'Код відновлення надіслано на вашу пошту';
  
  showNotification('Код надіслано!', `Перевірте пошту ${email}`, '✉︎');
}

function cancelForgotPassword() {
  const forgotForm = document.getElementById('forgotPasswordForm');
  const loginForm = document.getElementById('loginForm');
  if (forgotForm) forgotForm.style.display = 'none';
  if (loginForm) loginForm.style.display = 'block';
  isVerifyingForReset = false;
}

function cancelVerification() {
  const verificationForm = document.getElementById('verificationForm');
  if (isVerifyingForReset) {
    const forgotForm = document.getElementById('forgotPasswordForm');
    if (verificationForm) verificationForm.style.display = 'none';
    if (forgotForm) forgotForm.style.display = 'block';
  } else {
    const registerForm = document.getElementById('registerForm');
    if (verificationForm) verificationForm.style.display = 'none';
    if (registerForm) registerForm.style.display = 'block';
    tempEmail = null;
    tempPassword = null;
    verificationCode = null;
  }
}

// ============================================
// 11. ВИХІД ТА ОНОВЛЕННЯ UI
// ============================================
function logout() {
  showNotification('До побачення!', 'Ви вийшли з акаунту', '✕');
  currentUser = null;
  localStorage.removeItem('currentUser');
  updateProfileUI();
  closeProfile();
}

function updateProfileUI() {
  const icon = document.getElementById('profileIcon');
  if (!icon) return;
}

