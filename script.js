<script>
        // Content Management System with Authentication
        class SimpleContentManager {
            constructor() {
                this.contentData = {};
                this.editMode = false;
                this.isAuthenticated = false;
                this.adminPassword = 'aquafresh2024'; // Change this password!
                this.init();
            }

            init() {
                this.loadContent();
                this.createLoginButton();
                this.createLoginModal();
                this.createAdminPanel();
                this.makeElementsEditable();
            }

            createLoginButton() {
                const loginBtn = document.createElement('button');
                loginBtn.innerHTML = '🔐 Admin';
                loginBtn.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10000;
                    background: #64748b;
                    color: white;
                    border: none;
                    padding: 8px 12px;
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 12px;
                    opacity: 0.7;
                    transition: all 0.3s ease;
                `;
                
                loginBtn.addEventListener('click', () => this.showLoginModal());
                loginBtn.addEventListener('mouseenter', () => {
                    loginBtn.style.opacity = '1';
                    loginBtn.style.transform = 'translateY(-1px)';
                });
                loginBtn.addEventListener('mouseleave', () => {
                    loginBtn.style.opacity = '0.7';
                    loginBtn.style.transform = 'translateY(0)';
                });
                
                document.body.appendChild(loginBtn);
                this.loginBtn = loginBtn;
            }

            createLoginModal() {
                const modal = document.createElement('div');
                modal.innerHTML = `
                    <div style="
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0,0,0,0.5);
                        z-index: 10001;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">
                        <div style="
                            background: white;
                            padding: 30px;
                            border-radius: 15px;
                            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                            max-width: 400px;
                            width: 90%;
                        ">
                            <h3 style="margin: 0 0 20px 0; color: #1e293b; text-align: center;">Admin Login</h3>
                            <input type="password" id="adminPassword" placeholder="Enter admin password" style="
                                width: 100%;
                                padding: 12px;
                                border: 2px solid #e2e8f0;
                                border-radius: 8px;
                                font-size: 16px;
                                margin-bottom: 15px;
                                box-sizing: border-box;
                            ">
                            <div style="display: flex; gap: 10px;">
                                <button id="loginSubmit" style="
                                    flex: 1;
                                    background: #2563eb;
                                    color: white;
                                    border: none;
                                    padding: 12px;
                                    border-radius: 8px;
                                    cursor: pointer;
                                    font-weight: bold;
                                ">Login</button>
                                <button id="loginCancel" style="
                                    flex: 1;
                                    background: #64748b;
                                    color: white;
                                    border: none;
                                    padding: 12px;
                                    border-radius: 8px;
                                    cursor: pointer;
                                ">Cancel</button>
                            </div>
                            <p style="
                                font-size: 12px;
                                color: #64748b;
                                text-align: center;
                                margin: 15px 0 0 0;
                            ">For AquaFresh employees only</p>
                        </div>
                    </div>
                `;
                
                modal.style.display = 'none';
                document.body.appendChild(modal);
                this.loginModal = modal;

                // Add event listeners
                const passwordInput = modal.querySelector('#adminPassword');
                const submitBtn = modal.querySelector('#loginSubmit');
                const cancelBtn = modal.querySelector('#loginCancel');

                submitBtn.addEventListener('click', () => this.attemptLogin());
                cancelBtn.addEventListener('click', () => this.hideLoginModal());
                
                passwordInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.attemptLogin();
                });

                // Focus password input when modal opens
                passwordInput.addEventListener('focus', () => {
                    passwordInput.style.borderColor = '#2563eb';
                });
                passwordInput.addEventListener('blur', () => {
                    passwordInput.style.borderColor = '#e2e8f0';
                });
            }

            createEditButton() {
                const editBtn = document.createElement('button');
                editBtn.innerHTML = '✏️ Edit Mode';
                editBtn.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10000;
                    background: #2563eb;
                    color: white;
                    border: none;
                    padding: 10px 15px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: bold;
                    box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
                    transition: all 0.3s ease;
                `;
                
                editBtn.addEventListener('click', () => this.toggleEditMode());
                editBtn.addEventListener('mouseenter', () => {
                    editBtn.style.transform = 'translateY(-2px)';
                    editBtn.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.4)';
                });
                editBtn.addEventListener('mouseleave', () => {
                    editBtn.style.transform = 'translateY(0)';
                    editBtn.style.boxShadow = '0 4px 15px rgba(37, 99, 235, 0.3)';
                });
                
                document.body.appendChild(editBtn);
                this.editBtn = editBtn;
            }

            createLogoutButton() {
                const logoutBtn = document.createElement('button');
                logoutBtn.innerHTML = '🚪 Logout';
                logoutBtn.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 150px;
                    z-index: 10000;
                    background: #dc2626;
                    color: white;
                    border: none;
                    padding: 8px 12px;
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: all 0.3s ease;
                `;
                
                logoutBtn.addEventListener('click', () => this.logout());
                document.body.appendChild(logoutBtn);
                this.logoutBtn = logoutBtn;
            }

            showLoginModal() {
                this.loginModal.style.display = 'flex';
                // Focus the password input
                setTimeout(() => {
                    this.loginModal.querySelector('#adminPassword').focus();
                }, 100);
            }

            hideLoginModal() {
                this.loginModal.style.display = 'none';
                this.loginModal.querySelector('#adminPassword').value = '';
            }

            attemptLogin() {
                const password = this.loginModal.querySelector('#adminPassword').value;
                
                if (password === this.adminPassword) {
                    this.isAuthenticated = true;
                    this.hideLoginModal();
                    this.showAdminInterface();
                    this.showNotification('Login successful! Welcome admin ✅');
                } else {
                    this.showNotification('Incorrect password! ❌');
                    this.loginModal.querySelector('#adminPassword').value = '';
                    this.loginModal.querySelector('#adminPassword').focus();
                }
            }

            showAdminInterface() {
                // Hide login button and show admin controls
                this.loginBtn.style.display = 'none';
                this.createEditButton();
                this.createLogoutButton();
            }

            logout() {
                this.isAuthenticated = false;
                this.editMode = false;
                
                // Remove admin controls
                if (this.editBtn) this.editBtn.remove();
                if (this.logoutBtn) this.logoutBtn.remove();
                this.adminPanel.style.display = 'none';
                
                // Show login button again
                this.loginBtn.style.display = 'block';
                
                // Turn off edit mode for all elements
                document.querySelectorAll('[data-editable]').forEach(el => {
                    el.style.outline = 'none';
                    el.style.cursor = 'default';
                    el.setAttribute('contenteditable', 'false');
                });
                
                this.showNotification('Logged out successfully 👋');
            }

            createAdminPanel() {
                const panel = document.createElement('div');
                panel.innerHTML = `
                    <div style="background: white; border-radius: 15px; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); max-width: 500px; margin: 20px;">
                        <h3 style="margin: 0 0 15px 0; color: #1e293b;">Content Manager</h3>
                        <div style="margin-bottom: 15px;">
                            <button id="saveContent" style="background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 8px; margin-right: 10px; cursor: pointer;">💾 Save All</button>
                            <button id="exportContent" style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 8px; margin-right: 10px; cursor: pointer;">📤 Export</button>
                            <button id="importContent" style="background: #8b5cf6; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer;">📥 Import</button>
                        </div>
                        <input type="file" id="importFile" accept=".json" style="display: none;">
                        <div style="background: #fef3c7; padding: 10px; border-radius: 8px; margin-bottom: 10px;">
                            <p style="font-size: 12px; color: #92400e; margin: 0;"><strong>Password:</strong> ${this.adminPassword}</p>
                            <p style="font-size: 11px; color: #92400e; margin: 5px 0 0 0;">⚠️ Change this in the code for security!</p>
                        </div>
                        <p style="font-size: 14px; color: #64748b; margin: 0;">Click on any text to edit it. Changes are saved automatically.</p>
                    </div>
                `;
                
                panel.style.cssText = `
                    position: fixed;
                    top: 70px;
                    right: 20px;
                    z-index: 9999;
                    display: none;
                `;
                
                document.body.appendChild(panel);
                this.adminPanel = panel;

                // Add event listeners
                panel.querySelector('#saveContent').addEventListener('click', () => this.saveContent());
                panel.querySelector('#exportContent').addEventListener('click', () => this.exportContent());
                panel.querySelector('#importContent').addEventListener('click', () => panel.querySelector('#importFile').click());
                panel.querySelector('#importFile').addEventListener('change', (e) => this.importContent(e));
            }

            toggleEditMode() {
                if (!this.isAuthenticated) {
                    this.showNotification('Please login first! 🔐');
                    return;
                }

                this.editMode = !this.editMode;
                this.editBtn.innerHTML = this.editMode ? '💾 Save & Exit' : '✏️ Edit Mode';
                this.editBtn.style.background = this.editMode ? '#10b981' : '#2563eb';
                this.adminPanel.style.display = this.editMode ? 'block' : 'none';
                
                document.querySelectorAll('[data-editable]').forEach(el => {
                    if (this.editMode) {
                        el.style.outline = '2px dashed #3b82f6';
                        el.style.cursor = 'pointer';
                        el.setAttribute('contenteditable', 'true');
                    } else {
                        el.style.outline = 'none';
                        el.style.cursor = 'default';
                        el.setAttribute('contenteditable', 'false');
                        this.saveContent();
                    }
                });
            }

            makeElementsEditable() {
                // Define editable elements with their keys
                const editableElements = [
                    { selector: '.logo', key: 'logo' },
                    { selector: '.hero h1', key: 'heroTitle' },
                    { selector: '.hero p', key: 'heroDescription' },
                    { selector: '.services .section-header h2', key: 'servicesTitle' },
                    { selector: '.services .section-header p', key: 'servicesDescription' },
                    { selector: '.contact .section-header h2', key: 'contactTitle' },
                    { selector: '.contact .section-header p', key: 'contactDescription' }
                ];

                // Service cards
                document.querySelectorAll('.service-card').forEach((card, index) => {
                    const title = card.querySelector('h3');
                    const description = card.querySelector('p');
                    if (title) {
                        title.setAttribute('data-editable', `service${index}Title`);
                        editableElements.push({ element: title, key: `service${index}Title` });
                    }
                    if (description) {
                        description.setAttribute('data-editable', `service${index}Description`);
                        editableElements.push({ element: description, key: `service${index}Description` });
                    }
                });

                // Contact items
                document.querySelectorAll('.contact-item').forEach((item, index) => {
                    const title = item.querySelector('h4');
                    const content = item.querySelector('p');
                    if (title) {
                        title.setAttribute('data-editable', `contact${index}Title`);
                        editableElements.push({ element: title, key: `contact${index}Title` });
                    }
                    if (content) {
                        content.setAttribute('data-editable', `contact${index}Content`);
                        editableElements.push({ element: content, key: `contact${index}Content` });
                    }
                });

                // Apply to elements found by selector
                editableElements.forEach(item => {
                    if (item.selector) {
                        const element = document.querySelector(item.selector);
                        if (element) {
                            element.setAttribute('data-editable', item.key);
                            this.setupEditableElement(element, item.key);
                        }
                    } else if (item.element) {
                        this.setupEditableElement(item.element, item.key);
                    }
                });
            }

            setupEditableElement(element, key) {
                // Load saved content
                if (this.contentData[key]) {
                    element.innerHTML = this.contentData[key];
                }

                // Add click handler for editing
                element.addEventListener('click', (e) => {
                    if (this.editMode && this.isAuthenticated) {
                        e.preventDefault();
                        element.focus();
                    }
                });

                // Save on blur/input
                element.addEventListener('blur', () => {
                    if (this.editMode && this.isAuthenticated) {
                        this.contentData[key] = element.innerHTML;
                        this.saveToMemory();
                    }
                });

                element.addEventListener('input', () => {
                    if (this.editMode && this.isAuthenticated) {
                        this.contentData[key] = element.innerHTML;
                    }
                });
            }

            loadContent() {
                // In a real implementation, this would load from a server
                // For demo purposes, we'll use in-memory storage
                const saved = localStorage.getItem('aquafresh_content');
                if (saved) {
                    try {
                        this.contentData = JSON.parse(saved);
                    } catch (e) {
                        console.log('No saved content found');
                    }
                }
            }

            saveToMemory() {
                // Auto-save to localStorage for demo purposes
                localStorage.setItem('aquafresh_content', JSON.stringify(this.contentData));
            }

            saveContent() {
                this.saveToMemory();
                this.showNotification('Content saved successfully! ✅');
            }

            exportContent() {
                const dataStr = JSON.stringify(this.contentData, null, 2);
                const dataBlob = new Blob([dataStr], {type: 'application/json'});
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'aquafresh_content.json';
                link.click();
                URL.revokeObjectURL(url);
                this.showNotification('Content exported! 📤');
            }

            importContent(event) {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        try {
                            const imported = JSON.parse(e.target.result);
                            this.contentData = imported;
                            this.saveToMemory();
                            location.reload(); // Reload to show imported content
                        } catch (error) {
                            this.showNotification('Error importing file! ❌');
                        }
                    };
                    reader.readAsText(file);
                }
            }

            showNotification(message) {
                const notification = document.createElement('div');
                notification.innerHTML = message;
                notification.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    color: #1e293b;
                    padding: 20px 30px;
                    border-radius: 15px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    z-index: 10001;
                    font-weight: bold;
                `;
                
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);
            }
        }

        // Initialize content manager
        const contentManager = new SimpleContentManager();

        // Original functionality
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Navigation background on scroll
        window.addEventListener('scroll', () => {
            const nav = document.getElementById('nav');
            if (window.scrollY > 100) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });

        // Add entrance animations to service cards
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.service-card').forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';
            card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(card);
        });

        // Parallax effect for floating elements
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            document.querySelectorAll('.floating-element').forEach((element, index) => {
                const speed = 0.5 + (index * 0.1);
                element.style.transform = `translateY(${rate * speed}px) rotate(${scrolled * 0.01}deg)`;
            });
        });
    </script>