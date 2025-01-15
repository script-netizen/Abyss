document.addEventListener('DOMContentLoaded', async () => {
  // Password verification constants
  const CORRECT_HASH = '4c8a6c67b48975bcf14e1a4180dcb8ffb8b2d53109dbad357d81604ad1fe0a9a';
  const SALT = '5a9c91f5e9e5a6b0c7d8e3f2a1b4c7d8';

  // Password overlay elements
  const passwordOverlay = document.getElementById('password-overlay');
  const passwordInput = document.getElementById('password-input');
  const submitButton = document.getElementById('submit-password');
  const errorMessage = document.getElementById('password-error');

  // Signup overlay elements
  const signupOverlay = document.getElementById('signup-overlay');
  const usernameInput = document.getElementById('username-input');
  const submitUsername = document.getElementById('submit-username');
  const usernameError = document.getElementById('username-error');
  const profileUsername = document.getElementById('profile-username');

  // Profile image upload handling
  const avatar = document.getElementById('avatar');
  const avatarUpload = document.getElementById('avatar-upload');
  const changeUsernameBtn = document.getElementById('change-username');

  async function verifyPassword(input) {
    const derivedKey = await CryptoUtils.deriveKey(input, SALT);
    const inputHash = await CryptoUtils.sha256(derivedKey);
    console.log('Generated hash:', inputHash);
    return inputHash === CORRECT_HASH;
  }

  function showError(element, message) {
    element.textContent = message;
    element.classList.add('active');
    const input = element === errorMessage ? passwordInput : usernameInput;
    input.classList.add('shake');
    setTimeout(() => {
      input.classList.remove('shake');
    }, 500);
  }

  function checkExistingUser() {
    const username = localStorage.getItem('username');
    if (username) {
      profileUsername.textContent = username;
      return true;
    }
    return false;
  }

  submitButton.addEventListener('click', async () => {
    const password = passwordInput.value;
    
    if (!password) {
      showError(errorMessage, 'Please enter an access code');
      return;
    }

    try {
      const isCorrect = await verifyPassword(password);
      
      if (isCorrect) {
        passwordOverlay.classList.remove('active');
        sessionStorage.setItem('authenticated', 'true');
        
        // Show signup if user hasn't registered
        if (!checkExistingUser()) {
          signupOverlay.classList.add('active');
        }
      } else {
        showError(errorMessage, 'Invalid access code');
        passwordInput.value = '';
      }
    } catch (error) {
      showError(errorMessage, 'An error occurred. Please try again.');
      console.error('Password verification error:', error);
    }
  });

  submitUsername.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    
    if (!username) {
      showError(usernameError, 'Please enter a username');
      return;
    }

    if (username.length < 3) {
      showError(usernameError, 'Username must be at least 3 characters');
      return;
    }

    localStorage.setItem('username', username);
    profileUsername.textContent = username;
    signupOverlay.classList.remove('active');
  });

  // Handle Enter key for both inputs
  passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      submitButton.click();
    }
  });

  usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      submitUsername.click();
    }
  });

  // Check if already authenticated
  if (sessionStorage.getItem('authenticated') === 'true') {
    passwordOverlay.classList.remove('active');
    if (!checkExistingUser()) {
      signupOverlay.classList.add('active');
    }
  }

  avatarUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          // Store image in localStorage
          localStorage.setItem('profileImage', event.target.result);
          updateProfileImage();
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please upload an image file');
      }
    }
  });

  function updateProfileImage() {
    const storedImage = localStorage.getItem('profileImage');
    if (storedImage) {
      const img = document.createElement('img');
      img.src = storedImage;
      
      // Remove any existing image
      const existingImg = avatar.querySelector('img');
      if (existingImg) {
        existingImg.remove();
      }
      
      avatar.insertBefore(img, avatar.firstChild);
    }
  }

  // Change username functionality
  changeUsernameBtn.addEventListener('click', () => {
    const currentUsername = localStorage.getItem('username') || 'Guest';
    const newUsername = prompt('Enter new username:', currentUsername);
    
    if (newUsername) {
      if (newUsername.trim().length < 3) {
        alert('Username must be at least 3 characters long');
        return;
      }
      
      localStorage.setItem('username', newUsername.trim());
      profileUsername.textContent = newUsername.trim();
    }
  });

  // Initialize profile image if exists
  updateProfileImage();

  // Remove all secret menu related code and replace with simple remove access functionality
  const removeAccess = document.getElementById('remove-access');
  
  removeAccess.addEventListener('click', () => {
    sessionStorage.removeItem('authenticated');
    location.reload();
  });

  // Remove secret menu event listeners and related code
  const logo = document.querySelector('.logo:not(#password-overlay .logo)');
  logo.style.cursor = 'default';
  logo.style.pointerEvents = 'none';

  // Tab switching and game card code
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  function switchTab(tabId) {
    // Remove active class from all tabs and contents
    tabBtns.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    // Add active class to selected tab and content
    const selectedBtn = document.querySelector(`[data-tab="${tabId}"]`);
    const selectedContent = document.getElementById(tabId);
    
    if (selectedBtn && selectedContent) {
      selectedBtn.classList.add('active');
      selectedContent.classList.add('active');
    }
  }

  // Add click event listeners to tab buttons
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      switchTab(tabId);
    });
  });

  // Add hover effects for game cards
  const gameCards = document.querySelectorAll('.game-card');
  gameCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
  });

  // Game page handling
  const mario64Btn = document.getElementById('mario64-btn');
  const perchanceBtn = document.getElementById('perchance-btn');
  const mario64Page = document.getElementById('mario64-page');
  const perchancePage = document.getElementById('perchance-page');
  const backBtns = document.querySelectorAll('.back-btn');

  mario64Btn.addEventListener('click', () => {
    mario64Page.classList.add('active');
    if (!window.EJS_mario64_initialized) {
      window.EJS_player = '#game';
      window.EJS_gameUrl = 'SM64Shotgun.z64';
      window.EJS_core = 'mupen64plus2';
      
      const script = document.createElement('script');
      script.src = 'https://www.emulatorjs.com/loader.js';
      document.body.appendChild(script);
      
      window.EJS_mario64_initialized = true;
    }
  });

  perchanceBtn.addEventListener('click', () => {
    perchancePage.classList.add('active');
    if (!window.EJS_perchance_initialized) {
      window.EJS_player = '#perchance-game';
      window.EJS_gameUrl = 'Perchance.smc';
      window.EJS_core = 'snes';
      
      const script = document.createElement('script');
      script.src = 'https://www.emulatorjs.com/loader.js';
      document.body.appendChild(script);
      
      window.EJS_perchance_initialized = true;
    }
  });

  // Add EaglerCraft handling
  const eaglercraftBtn = document.getElementById('eaglercraft-btn');
  const eaglercraftPage = document.getElementById('eaglercraft-page');
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  const eaglercraftFrame = document.getElementById('eaglercraft-frame');

  eaglercraftBtn.addEventListener('click', () => {
    eaglercraftPage.classList.add('active');
  });

  fullscreenBtn.addEventListener('click', () => {
    if (eaglercraftFrame.requestFullscreen) {
      eaglercraftFrame.requestFullscreen();
    } else if (eaglercraftFrame.webkitRequestFullscreen) {
      eaglercraftFrame.webkitRequestFullscreen();
    } else if (eaglercraftFrame.msRequestFullscreen) {
      eaglercraftFrame.msRequestFullscreen();
    }
  });

  backBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      mario64Page.classList.remove('active');
      perchancePage.classList.remove('active');
      eaglercraftPage.classList.remove('active');
    });
  });
});