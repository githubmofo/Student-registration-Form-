// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const navAuth = document.getElementById('nav-auth');
const profileMenu = document.getElementById('profileMenu');
const profileBtn = document.getElementById('profileBtn');
const profileName = document.getElementById('profileName');
const profileDropdown = document.getElementById('profileDropdown');
const authModal = document.getElementById('authModal');
const closeModal = document.getElementById('closeModal');
const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginFormElement = document.getElementById('loginFormElement');
const registerFormElement = document.getElementById('registerFormElement');
const signOutBtn = document.getElementById('signOutBtn');
const getStartedBtn = document.getElementById('getStartedBtn');
const messageContainer = document.getElementById('messageContainer');
const messageIcon = document.getElementById('messageIcon');
const messageText = document.getElementById('messageText');

// Upload Modal Functionality
const uploadModal = document.getElementById('uploadModal');
const closeUploadModal = document.getElementById('closeUploadModal');
const dragDropArea = document.getElementById('dragDropArea');
const fileInput = document.getElementById('fileInput');
const chooseFileBtn = document.getElementById('chooseFileBtn');
const selectedFile = document.getElementById('selectedFile');
const fileName = document.getElementById('fileName');
const removeFile = document.getElementById('removeFile');
const documentTitle = document.getElementById('documentTitle');
const uploadBtn = document.getElementById('uploadBtn');
const backToLogin = document.getElementById('backToLogin');
const uploadDocsBtn = document.getElementById('uploadDocsBtn');
const viewDocsBtn = document.getElementById('viewDocsBtn');
const editProfileBtn = document.getElementById('editProfileBtn');
const viewDocsModal = document.getElementById('viewDocsModal');
const closeViewDocsModal = document.getElementById('closeViewDocsModal');
const documentsList = document.getElementById('documentsList');
const emptyState = document.getElementById('emptyState');
// Edit profile elements
const editEmail = document.getElementById('editEmail');
const editName = document.getElementById('editName');
const saveNameBtn = document.getElementById('saveNameBtn');
const currentPasswordInput = document.getElementById('currentPassword');
const newPasswordInput = document.getElementById('newPassword');
const confirmNewPasswordInput = document.getElementById('confirmNewPassword');
const changePasswordBtn = document.getElementById('changePasswordBtn');

// Mobile nav elements
const mobileMenuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const navAuthMobile = document.getElementById('nav-auth-mobile');
const loginBtnMobile = document.getElementById('loginBtnMobile');
const profileMenuMobile = document.getElementById('profileMenuMobile');
const profileNameMobile = document.getElementById('profileNameMobile');
const viewDocsBtnMobile = document.getElementById('viewDocsBtnMobile');
const uploadDocsBtnMobile = document.getElementById('uploadDocsBtnMobile');
const editProfileBtnMobile = document.getElementById('editProfileBtnMobile');
const signOutBtnMobile = document.getElementById('signOutBtnMobile');

// User data storage
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Add Firestore reference after firebase-config.js is loaded
// const firestore = firebase.firestore();

// Show message function
function showMessage(message, type = 'success') {
    messageText.textContent = message;
    
    // Set appropriate icon based on message type
    switch(type) {
        case 'error':
            messageIcon.textContent = '❌';
            break;
        case 'info':
            messageIcon.textContent = 'ℹ️';
            break;
        case 'success':
        default:
            messageIcon.textContent = '✅';
            break;
    }
    
    messageContainer.classList.remove('hidden');
    
    setTimeout(() => {
        messageContainer.classList.add('hidden');
    }, 3000);
}

// Modal management
function openModal(modal) {
    modal.classList.remove('hidden');
}

function closeModalFunc(modal) {
    modal.classList.add('hidden');
}

// Tab switching
function switchTab(tabName) {
    if (tabName === 'login') {
        loginTab.classList.add('text-purple-600', 'border-b-2', 'border-purple-600');
        loginTab.classList.remove('text-gray-500');
        registerTab.classList.add('text-gray-500');
        registerTab.classList.remove('text-purple-600', 'border-b-2', 'border-purple-600');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    } else {
        registerTab.classList.add('text-purple-600', 'border-b-2', 'border-purple-600');
        registerTab.classList.remove('text-gray-500');
        loginTab.classList.add('text-gray-500');
        loginTab.classList.remove('text-purple-600', 'border-b-2', 'border-purple-600');
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    }
}

// Profile dropdown toggle
function toggleProfileDropdown() {
    // If using Bootstrap nav, show/hide dropdown menu via hidden class to keep existing logic
    profileDropdown.classList.toggle('hidden');
}

// Update UI for logged in user
function updateUIForLoggedInUser(user) {
    navAuth.classList.add('hidden');
    profileMenu.classList.remove('hidden');
    profileName.textContent = capitalizeFirstLetter(user.name);
    // Mobile state
    if (navAuthMobile) navAuthMobile.classList.add('hidden');
    if (profileMenuMobile) profileMenuMobile.classList.remove('hidden');
    if (profileNameMobile) profileNameMobile.textContent = capitalizeFirstLetter(user.name);
    // Pre-fill edit profile inputs if present
    if (editEmail) editEmail.value = user.email || '';
    if (editName) editName.value = user.name || '';
}

// Update UI for logged out user
function updateUIForLoggedOutUser() {
    navAuth.classList.remove('hidden');
    profileMenu.classList.add('hidden');
    profileDropdown.classList.add('hidden');
    // Mobile state
    if (navAuthMobile) navAuthMobile.classList.remove('hidden');
    if (profileMenuMobile) profileMenuMobile.classList.add('hidden');
}

// Show section and hide others
function showSection(sectionId) {
    // Hide all sections
    const sections = ['home', 'about', 'services', 'viewdocs', 'uploaddocs', 'editprofile'];
    sections.forEach(id => {
        const section = document.getElementById(id);
        if (section) {
            section.classList.add('hidden');
        }
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
}

// On page load, check Firebase Auth state
function checkAuthStatus() {
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            try {
                // Use Realtime Database for user profile
                const snapshot = await database.ref('users/' + user.uid).once('value');
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    currentUser = { ...userData, email: user.email, uid: user.uid };
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    updateUIForLoggedInUser(currentUser);
                } else {
                    updateUIForLoggedOutUser();
                }
            } catch (error) {
                showMessage(error.message, 'error');
                updateUIForLoggedOutUser();
            }
        } else {
            currentUser = null;
            localStorage.removeItem('currentUser');
            updateUIForLoggedOutUser();
        }
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Immediate UI sync based on cached session to avoid flicker
    if (currentUser && currentUser.name) {
        updateUIForLoggedInUser(currentUser);
    } else {
        updateUIForLoggedOutUser();
    }

    // Check authentication status on page load (authoritative)
    checkAuthStatus();
    
    // Show home section by default
    showSection('home');

    // Login button click
    loginBtn?.addEventListener('click', () => {
        openModal(authModal);
        switchTab('login');
    });

    // Mobile menu toggle
    mobileMenuBtn?.addEventListener('click', () => {
        mobileMenu?.classList.toggle('hidden');
    });

    // Mobile login button
    loginBtnMobile?.addEventListener('click', () => {
        openModal(authModal);
        switchTab('login');
        mobileMenu?.classList.add('hidden');
    });

    // Get Started button click
    getStartedBtn?.addEventListener('click', () => {
        openModal(authModal);
        switchTab('register');
    });

    // Close modal
    closeModal?.addEventListener('click', () => {
        closeModalFunc(authModal);
    });

    // Tab switching
    loginTab?.addEventListener('click', () => switchTab('login'));
    registerTab?.addEventListener('click', () => switchTab('register'));

    // Profile button click
    profileBtn?.addEventListener('click', toggleProfileDropdown);

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!profileMenu?.contains(e.target)) {
            profileDropdown.classList.add('hidden');
        }
        // Close mobile menu when clicking outside
        if (mobileMenu && mobileMenuBtn && !mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            mobileMenu.classList.add('hidden');
        }
    });

    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target === authModal) {
            closeModalFunc(authModal);
        }
    });

    // Handle Login Form
    loginFormElement?.addEventListener('submit', async function(e) {
        e.preventDefault();
        if (!navigator.onLine) {
            showMessage('You appear to be offline. Please check your internet connection.', 'error');
            return;
        }
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            // Fetch user info from Realtime Database
            const snapshot = await database.ref('users/' + user.uid).once('value');
            if (!snapshot.exists()) {
                showMessage('User profile not found in database.', 'error');
                return;
            }
            const userData = snapshot.val();
            userData.name = capitalizeFirstLetter(userData.name);
            currentUser = { ...userData, email: user.email, uid: user.uid };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showMessage('Login successful!');
            closeModalFunc(authModal);
            updateUIForLoggedInUser(currentUser);
            loginFormElement.reset();
        } catch (error) {
            if (error.message && error.message.toLowerCase().includes('network')) {
                showMessage('Network error: Please check your internet connection.', 'error');
            } else {
                showMessage(error.message, 'error');
            }
        }
    });

    // Handle Register Form
    registerFormElement?.addEventListener('submit', async function(e) {
        e.preventDefault();
        if (!navigator.onLine) {
            showMessage('You appear to be offline. Please check your internet connection.', 'error');
            return;
        }
        let name = document.getElementById('registerName').value;
        name = capitalizeFirstLetter(name.trim());
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const role = document.getElementById('registerRole').value;
        
        if (!role) {
            showMessage('Please select a role', 'error');
            return;
        }
        
        try {
            // Create user in Firebase Auth
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            // Store additional info in Realtime Database
            await database.ref('users/' + user.uid).set({
                name,
                email,
                role
            });
            // Store current user info in session
            currentUser = { name, email, role, uid: user.uid };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showMessage('Registration successful! You are now logged in.');
            closeModalFunc(authModal);
            updateUIForLoggedInUser(currentUser);
            registerFormElement.reset();
        } catch (error) {
            if (error.message && error.message.toLowerCase().includes('network')) {
                showMessage('Network error: Please check your internet connection.', 'error');
            } else {
                showMessage(error.message, 'error');
            }
        }
    });

    // Sign Out
    signOutBtn?.addEventListener('click', async () => {
        try {
            await auth.signOut();
        } catch (e) {}
        currentUser = null;
        localStorage.removeItem('currentUser');
        
                        showMessage('Signed out successfully!');
                        updateUIForLoggedOutUser();
        showSection('home');
    });

    // Mobile: Sign Out
    signOutBtnMobile?.addEventListener('click', async () => {
        try {
            await auth.signOut();
        } catch (e) {}
        currentUser = null;
        localStorage.removeItem('currentUser');
        showMessage('Signed out successfully!');
        updateUIForLoggedOutUser();
        showSection('home');
        mobileMenu?.classList.add('hidden');
    });

    // Navigation links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            showSection(sectionId);
            
            // Close profile dropdown if open
            profileDropdown.classList.add('hidden');
            // Close mobile menu if open
            mobileMenu?.classList.add('hidden');
        });
    });

    // Profile dropdown links
    document.querySelectorAll('#profileDropdown a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            showSection(sectionId);
            
            // Close profile dropdown
            profileDropdown.classList.add('hidden');
        });
    });

    // Open upload modal from profile dropdown
    uploadDocsBtn.addEventListener('click', function() {
      uploadModal.classList.remove('hidden');
      // Close profile dropdown
      profileDropdown.classList.add('hidden');
    });

    // Mobile: Upload Docs
    uploadDocsBtnMobile?.addEventListener('click', function() {
      uploadModal.classList.remove('hidden');
      mobileMenu?.classList.add('hidden');
    });

    // View Docs functionality
    viewDocsBtn.addEventListener('click', function() {
      viewDocsModal.classList.remove('hidden');
      loadDocuments();
      profileDropdown.classList.add('hidden');
    });

    // Mobile: View Docs
    viewDocsBtnMobile?.addEventListener('click', function() {
      viewDocsModal.classList.remove('hidden');
      loadDocuments();
      mobileMenu?.classList.add('hidden');
    });

    // Edit Profile functionality
    editProfileBtn?.addEventListener('click', function() {
      showSection('editprofile');
      profileDropdown.classList.add('hidden');
    });

    // Mobile: Edit Profile
    editProfileBtnMobile?.addEventListener('click', function() {
      showSection('editprofile');
      mobileMenu?.classList.add('hidden');
    });

    // Close View Docs modal
    closeViewDocsModal.addEventListener('click', function() {
      viewDocsModal.classList.add('hidden');
    });

    // Close View Docs modal when clicking outside
    viewDocsModal.addEventListener('click', function(e) {
      if (e.target === viewDocsModal) {
        viewDocsModal.classList.add('hidden');
      }
    });

    // Close upload modal
    closeUploadModal.addEventListener('click', function() {
      uploadModal.classList.add('hidden');
      resetUploadForm();
    });

    // Close upload modal when clicking outside
    uploadModal.addEventListener('click', function(e) {
      if (e.target === uploadModal) {
        uploadModal.classList.add('hidden');
        resetUploadForm();
      }
    });

    // Choose file button
    chooseFileBtn.addEventListener('click', function() {
      fileInput.click();
    });

    // File input change
    fileInput.addEventListener('change', function(e) {
      if (e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
      }
    });

    // Drag and drop functionality
    dragDropArea.addEventListener('dragover', function(e) {
      e.preventDefault();
      dragDropArea.classList.add('border-blue-500', 'bg-blue-50');
    });

    dragDropArea.addEventListener('dragleave', function(e) {
      e.preventDefault();
      dragDropArea.classList.remove('border-blue-500', 'bg-blue-50');
    });

    dragDropArea.addEventListener('drop', function(e) {
      e.preventDefault();
      dragDropArea.classList.remove('border-blue-500', 'bg-blue-50');
      
      if (e.dataTransfer.files.length > 0) {
        handleFileSelect(e.dataTransfer.files[0]);
      }
    });

    // Handle file selection
    function handleFileSelect(file) {
      fileName.textContent = file.name;
      selectedFile.classList.remove('hidden');
      dragDropArea.classList.add('hidden');
      
      // Auto-fill document title if empty
      if (!documentTitle.value) {
        const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
        documentTitle.value = nameWithoutExtension;
      }
    }

    // Remove file
    removeFile.addEventListener('click', function() {
      resetUploadForm();
    });

    // Upload button
    uploadBtn.addEventListener('click', function() {
        if (!fileInput.files[0]) {
        showMessage('Please select a file to upload', 'error');
            return;
        }
        
      if (!documentTitle.value.trim()) {
        showMessage('Please enter a document title', 'error');
            return;
        }
        
      // Simulate upload process
        uploadBtn.disabled = true;
        uploadBtn.textContent = 'Uploading...';
        
      setTimeout(() => {
        // Read file as DataURL
        const reader = new FileReader();
        reader.onload = function(e) {
          // Store the uploaded document with fileData
          const uploadedDoc = {
            id: Date.now(),
            title: documentTitle.value.trim(),
            fileName: fileInput.files[0].name,
            fileSize: fileInput.files[0].size,
            uploadDate: new Date().toLocaleDateString(),
            fileType: fileInput.files[0].type,
            fileData: e.target.result // DataURL
          };
          uploadDocumentToFirebase(uploadedDoc, () => {
            uploadModal.classList.add('hidden');
            resetUploadForm();
          });
        };
        reader.readAsDataURL(fileInput.files[0]);
      }, 2000);
    });

    // Back to login
    backToLogin.addEventListener('click', function(e) {
      e.preventDefault();
      uploadModal.classList.add('hidden');
      resetUploadForm();
      // Open login modal
      authModal.classList.remove('hidden');
      switchTab('login');
    });

    // Reset upload form
    function resetUploadForm() {
      fileInput.value = '';
      documentTitle.value = '';
      selectedFile.classList.add('hidden');
      dragDropArea.classList.remove('hidden');
      uploadBtn.disabled = false;
      uploadBtn.textContent = 'Upload';
    }

    // Save name
    saveNameBtn?.addEventListener('click', async () => {
      if (!currentUser || !currentUser.uid) {
        showMessage('You must be logged in to update your name.', 'error');
        return;
      }
      const newName = (editName?.value || '').trim();
      if (!newName) {
        showMessage('Name cannot be empty.', 'error');
        return;
      }
      try {
        await database.ref('users/' + currentUser.uid).update({ name: newName });
        currentUser = { ...currentUser, name: newName };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateUIForLoggedInUser(currentUser);
        showMessage('Name updated successfully!', 'success');
      } catch (e) {
        showMessage('Failed to update name: ' + (e.message || e), 'error');
      }
    });

    // Change password
    changePasswordBtn?.addEventListener('click', async () => {
      if (!currentUser || !currentUser.uid) {
        showMessage('You must be logged in to change your password.', 'error');
        return;
      }
      const currentPassword = currentPasswordInput?.value || '';
      const newPassword = newPasswordInput?.value || '';
      const confirmPassword = confirmNewPasswordInput?.value || '';
      if (!currentPassword || !newPassword || !confirmPassword) {
        showMessage('Please fill in all password fields.', 'error');
        return;
      }
      if (newPassword.length < 6) {
        showMessage('New password must be at least 6 characters.', 'error');
        return;
      }
      if (newPassword !== confirmPassword) {
        showMessage('New passwords do not match.', 'error');
        return;
      }
      try {
        const credential = firebase.auth.EmailAuthProvider.credential(currentUser.email, currentPassword);
        await auth.currentUser.reauthenticateWithCredential(credential);
        await auth.currentUser.updatePassword(newPassword);
        currentPasswordInput.value = '';
        newPasswordInput.value = '';
        confirmNewPasswordInput.value = '';
        showMessage('Password updated successfully!', 'success');
      } catch (e) {
        let msg = e.message || 'Failed to change password.';
        if (typeof e.code === 'string' && e.code.includes('wrong-password')) {
          msg = 'Current password is incorrect.';
        }
        showMessage(msg, 'error');
      }
    });
});

// Load and display documents from Firebase
function loadDocuments() {
  if (!currentUser || !currentUser.uid) {
    showMessage('You must be logged in to view documents.', 'error');
    return;
  }
  const userDocsRef = database.ref('documents/' + currentUser.uid);
  userDocsRef.once('value', (snapshot) => {
    const docsObj = snapshot.val() || {};
    const documents = Object.values(docsObj);
    if (documents.length === 0) {
      documentsList.classList.add('hidden');
      emptyState.classList.remove('hidden');
      return;
    }
    documentsList.classList.remove('hidden');
    emptyState.classList.add('hidden');
    documentsList.innerHTML = '';
    documents.sort((a, b) => b.id - a.id);
    documents.forEach(doc => {
      const docCard = createDocumentCard(doc);
      documentsList.appendChild(docCard);
    });
  }, (error) => {
    showMessage('Failed to load documents: ' + error.message, 'error');
  });
}

// Create document card
function createDocumentCard(doc) {
        const card = document.createElement('div');
  card.className = 'bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer';
  
  const fileSize = formatFileSize(doc.fileSize);
  const fileType = getFileTypeIcon(doc.fileType);
        
        card.innerHTML = `
    <div class="flex items-start justify-between">
      <div class="flex items-start space-x-4">
        <div class="flex-shrink-0">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <span class="text-2xl">${getFileTypeIcon(doc.fileType)}</span>
                </div>
            </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-semibold text-gray-900 mb-1">${doc.title}</h3>
          <p class="text-sm text-gray-500 mb-2">${doc.fileName}</p>
          <div class="flex items-center space-x-4 text-xs text-gray-400">
                <span>Size: ${formatFileSize(doc.fileSize)}</span>
            <span>Uploaded: ${doc.uploadDate}</span>
            <span>Type: ${doc.fileType || 'Unknown'}</span>
          </div>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <button onclick="downloadDocument(${doc.id})" class="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors" title="Download">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </button>
        <button onclick="deleteDocument(${doc.id})" class="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors" title="Delete">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </button>
      </div>
            </div>
        `;
        
        // Add double-click to preview
        card.ondblclick = function() {
          if (doc.fileData) {
            const win = window.open();
            win.document.write('<iframe src="' + doc.fileData + '" frameborder="0" style="width:100vw;height:100vh;"></iframe>');
          } else {
            showMessage('No preview available for this file. Please re-upload.', 'info');
          }
        };
        return card;
    }

    // Format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

// Get file type icon
function getFileTypeIcon(fileType) {
  if (fileType.includes('pdf')) return '📄';
  if (fileType.includes('word') || fileType.includes('document')) return '📝';
  if (fileType.includes('image')) return '🖼️';
  if (fileType.includes('text')) return '📄';
  return '📁';
}

// Upload document (Firebase Realtime Database)
function uploadDocumentToFirebase(doc, callback) {
  if (!currentUser || !currentUser.uid) {
    showMessage('You must be logged in to upload documents.', 'error');
    return;
  }
  const userDocsRef = database.ref('documents/' + currentUser.uid);
  const newDocRef = userDocsRef.push();
  newDocRef.set(doc, (error) => {
    if (error) {
      showMessage('Failed to upload document: ' + error.message, 'error');
    } else {
      showMessage('Document uploaded successfully!', 'success');
      if (callback) callback();
    }
  });
}

// Download document from Firebase
function downloadDocument(docId) {
  if (!currentUser || !currentUser.uid) {
    showMessage('You must be logged in to download documents.', 'error');
    return;
  }
  const userDocsRef = database.ref('documents/' + currentUser.uid);
  userDocsRef.orderByChild('id').equalTo(docId).once('value', (snapshot) => {
    const docsObj = snapshot.val();
    if (!docsObj) {
      showMessage('File data not found for download.', 'error');
      return;
    }
    const doc = Object.values(docsObj)[0];
    if (!doc.fileData) {
      showMessage('File data not found for download.', 'error');
      return;
    }
    const a = document.createElement('a');
    a.href = doc.fileData;
    a.download = doc.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showMessage('Download started...', 'info');
  }, (error) => {
    showMessage('Failed to download document: ' + error.message, 'error');
  });
}

// Delete document from Firebase
function deleteDocument(docId) {
  if (!currentUser || !currentUser.uid) {
    showMessage('You must be logged in to delete documents.', 'error');
    return;
  }
  if (confirm('Are you sure you want to delete this document?')) {
    const userDocsRef = database.ref('documents/' + currentUser.uid);
    userDocsRef.orderByChild('id').equalTo(docId).once('value', (snapshot) => {
      const docsObj = snapshot.val();
      if (!docsObj) {
        showMessage('Document not found.', 'error');
        return;
      }
      const key = Object.keys(docsObj)[0];
      userDocsRef.child(key).remove((error) => {
        if (error) {
          showMessage('Failed to delete document: ' + error.message, 'error');
        } else {
          showMessage('Document deleted successfully!', 'success');
          loadDocuments();
        }
      });
    });
  }
}

// Make functions global for onclick handlers
window.downloadDocument = downloadDocument;
window.deleteDocument = deleteDocument;

// Utility to capitalize first letter
function capitalizeFirstLetter(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}