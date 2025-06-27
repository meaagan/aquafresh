// Auth0 + Content Management System
        class Auth0ContentManager {
            constructor() {
                this.contentData = {};
                this.editMode = false;
                this.auth0 = null;
                this.currentUser = null;
                this.init();
            }

            async init() {
                this.loadContent();
                await this.setupAuth0();
                this.createLoginButton();
                this.createAdminPanel();
                this.makeElementsEditable();
                await this.checkAuthState();
            }

            async setupAuth0() {
                try {
                    // You'll need to replace these with your actual Auth0 credentials
                    this.auth0 = await auth0.createAuth0Client({
                        domain: 'YOUR_AUTH0_DOMAIN.auth0.com', // Replace with your domain
                        clientId: 'YOUR_AUTH0_CLIENT_ID',       // Replace with your client ID
                        authorizationParams: {
                            redirect_uri: window.location.origin
                        }
                    });

                    // Handle the authentication callback
                    const query = window.location.search;
                    if (query.includes('code=') && query.includes('state=')) {
                        await this.auth0.handleRedirectCallback();
                        window.history.replaceState({}, document.title, window.location.pathname);
                    }
                } catch (error) {
                    console.error('Auth0 setup error:', error);
                    this.showDemoMode();
                }
            }

            showDemoMode() {
                // Fallback to demo mode if Auth0 isn't configured
                const demoNotice = document.createElement('div');
                demoNotice.innerHTML = `
                    <div style="
                        position: fixed;
                        top: 10px;
                        left: 50%;
                        transform: translateX(-50%);
                        background: #fbbf24;
                        color: #92400e;
                        padding: 10px 20px;
                        border-radius: 25px;
                        font-size: 12px;
                        z-index: 10002;
                        font-weight: bold;
                    ">
                        ⚠️ Demo Mode - Configure Auth0 credentials for production
                    </div>
                `;
                document.body.appendChild(demoNotice);
                
                // Create simple demo login
                this.createDemoLogin();
            }

            createDemoLogin() {
                // Create discrete demo access in footer
                const demoLink = document.createElement('span');
                demoLink.innerHTML = '••';
                demoLink.style.cssText = `
                    color: #f59e0b;
                    cursor: pointer;
                    font-size: 14px;
                    margin-left: 8px;
                    transition: color 0.3s ease;
                    user-select: none;
                `;
                
                demoLink.addEventListener('click', () => {
                    // Demo login - just simulate authentication
                    this.currentUser = { email: 'demo@aquafresh.com', name: 'Demo Admin' };
                    this.showAdminInterface();
                    this.showNotification('Demo login successful! ✅');
                    demoLink.remove();
                });
                
                demoLink.addEventListener('mouseenter', () => {
                    demoLink.style.color = '#d97706';
                });
                demoLink.addEventListener('mouseleave', () => {
                    demoLink.style.color = '#f59e0b';
                });
                
                // Add to footer
                const footer = document.querySelector('.footer');
                if (footer) {
                    footer.appendChild(demoLink);
                }
            }

            async checkAuthState() {
                if (!this.auth0) return;
                
                try {
                    const isAuthenticated = await this.auth0.isAuthenticated();
                    if (isAuthenticated) {
                        this.currentUser = await this.auth0.getUser();
                        this.showAdminInterface();
                    }
                } catch (error) {
                    console.error('Auth check error:', error);
                }
            }

            createLoginButton() {
                // Create discrete admin access in footer
                const adminLink = document.createElement('span');
                adminLink.innerHTML = '•';
                adminLink.style.cssText = `
                    color: #94a3b8;
                    cursor: pointer;
                    font-size: 14px;
                    margin-left: 8px;
                    transition: color 0.3s ease;
                    user-select: none;
                `;
                
                adminLink.addEventListener('click', async () => {
                    if (this.auth0) {
                        try {
                            await this.auth0.loginWithRedirect();
                        } catch (error) {
                            console.error('Login error:', error);
                            this.showNotification('Login failed! Please try again. ❌');
                        }
                    }
                });
                
                adminLink.addEventListener('mouseenter', () => {
                    adminLink.style.color = '#64748b';
                });
                adminLink.addEventListener('mouseleave', () => {
                    adminLink.style.color = '#94a3b8';
                });
                
                // Add to footer
                const footer = document.querySelector('.footer');
                if (footer) {
                    footer.appendChild(adminLink);
                }
                
                this.loginBtn = adminLink;
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

            createUserInfo() {
                const userInfo = document.createElement('div');
                const userName = this.currentUser?.name || this.currentUser?.email || 'Admin';
                userInfo.innerHTML = `👤 ${userName}`;
                userInfo.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 170px;
                    z-index: 10000;
                    background: #10b981;
                    color: white;
                    padding: 8px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: bold;
                `;
                
                document.body.appendChild(userInfo);
                this.userInfo = userInfo;
            }

            createLogoutButton() {
                const logoutBtn = document.createElement('button');
                logoutBtn.innerHTML = '🚪 Logout';
                logoutBtn.style.cssText = `
                    position: fixed;
                    top: 60px;
                    right: 20px;
                    z-index: 10000;
                    background: #dc2626;
                    color: white;
                    border: none;
                    padding: 6px 10px;
                    border-radius: 15px;
                    cursor: pointer;
                    font-size: 11px;
                    transition: all 0.3s ease;
                `;
                
                logoutBtn.addEventListener('click', async () => {
                    if (this.auth0) {
                        await this.auth0.logout({
                            logoutParams: {
                                returnTo: window.location.origin
                            }
                        });
                    } else {
                        // Demo logout
                        this.logout();
                    }
                });
                
                document.body.appendChild(logoutBtn);
                this.logoutBtn = logoutBtn;
            }

            showAdminInterface() {
                if (this.loginBtn) this.loginBtn.style.display = 'none';
                this.createEditButton();
                this.createUserInfo();
                this.createLogoutButton();
            }

            logout() {
                this.editMode = false;
                this.currentUser = null;
                
                // Remove admin controls
                if (this.editBtn) this.editBtn.remove();
                if (this.userInfo) this.userInfo.remove();
                if (this.logoutBtn) this.logoutBtn.remove();
                this.adminPanel.style.display = 'none';
                
                // Recreate discrete login access
                this.createLoginButton();
                
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
                        <div style="background: #dcfce7; padding: 10px; border-radius: 8px; margin-bottom: 10px;">
                            <p style="font-size: 12px; color: #166534; margin: 0;"><strong>🔒 Secured by Auth0</strong></p>
                            <p style="font-size: 11px; color: #166534; margin: 5px 0 0 0;">✅ Enterprise-grade authentication & user management</p>
                        </div>
                        <div style="background: #fef3c7; padding: 10px; border-radius: 8px; margin-bottom: 10px;">
                            <p style="font-size: 11px; color: #92400e; margin: 0;">⚙️ <strong>Setup Required:</strong> Add your Auth0 domain & client ID to the code</p>
                        </div>
                        <p style="font-size: 14px; color: #64748b; margin: 0;">Click on any text to edit it. Changes are saved automatically.</p>
                    </div>
                `;
                
                panel.style.cssText = `
                    position: fixed;
                    top: 100px;
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
                if (!this.currentUser) {
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
                    if (this.editMode && this.currentUser) {
                        e.preventDefault();
                        element.focus();
                    }
                });

                // Save on blur/input
                element.addEventListener('blur', () => {
                    if (this.editMode && this.currentUser) {
                        this.contentData[key] = element.innerHTML;
                        this.saveToMemory();
                    }
                });

                element.addEventListener('input', () => {
                    if (this.editMode && this.currentUser) {
                        this.contentData[key] = element.innerHTML;
                    }
                });
            }

            loadContent() {
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
                            location.reload();
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
                setTimeout(() => notification.remove(), 3000);
            }
        }

        // Initialize content manager
        const contentManager = new Auth0ContentManager();

        // Original functionality
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

        window.addEventListener('scroll', () => {
            const nav = document.getElementById('nav');
            if (window.scrollY > 100) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.service-card').forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';
            card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(card);
        });

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            document.querySelectorAll('.floating-element').forEach((element, index) => {
                const speed = 0.5 + (index * 0.1);
                element.style.transform = `translateY(${rate * speed}px) rotate(${scrolled * 0.01}deg)`;
            });
        });