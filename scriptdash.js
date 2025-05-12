document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const menuItems = document.querySelectorAll('.menu-item[data-page]');
    const pages = document.querySelectorAll('.page-content');
    const detailsSection = document.getElementById('details-section');
    const recordsSection = document.getElementById('records-section');
    const fullRecordsView = document.getElementById('full-records-view');
    const fullAlertsView = document.getElementById('full-alerts-view');
    const logoutBtn = document.getElementById('logout-btn');
    const viewAllButtons = document.querySelectorAll('.view-all-btn');
    const closeFullscreenButtons = document.querySelectorAll('.close-fullscreen');
    const loginButton = document.querySelector('.login-btn');
    const faceAuthButton = document.querySelector('.face-auth-btn');
    const currentDateEl = document.getElementById('current-date');
    const currentTimeEl = document.getElementById('current-time');

    // Initialize app
    initApp();

    function initApp() {
        updateDateTime();
        setInterval(updateDateTime, 60000);
        populateRecordsTable();
        populateAlertsList();
        simulateVideoFeed(); // Assume this is defined elsewhere
        setupEventListeners();
    }

    function updateDateTime() {
        const now = new Date();
        const dateOptions = { day: '2-digit', month: 'short', year: 'numeric' };
        const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };

        currentDateEl.textContent = now.toLocaleDateString('en-GB', dateOptions);
        currentTimeEl.textContent = now.toLocaleTimeString('en-US', timeOptions);
    }

    function setupEventListeners() {
        // Navigation
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                const targetPage = item.getAttribute('data-page');

                menuItems.forEach(mi => mi.classList.remove('active'));
                item.classList.add('active');

                pages.forEach(page => {
                    page.classList.remove('active');
                    if (page.id === targetPage) {
                        page.classList.add('active');
                    }
                });

                fullRecordsView.style.display = 'none';
                fullAlertsView.style.display = 'none';
            });
        });

        // View All Buttons
        viewAllButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const parentSection = e.target.closest('.section');
                if (parentSection.id === 'records-section') {
                    fullRecordsView.style.display = 'block';
                } else if (parentSection.id === 'details-section') {
                    fullAlertsView.style.display = 'block';
                }
            });
        });

        // Close fullscreen views
        closeFullscreenButtons.forEach(button => {
            button.addEventListener('click', () => {
                button.closest('.fullscreen-view').style.display = 'none';
            });
        });

        // Logout
        logoutBtn.addEventListener('click', () => {
            document.querySelector('.app-container').style.display = 'none';
            document.querySelector('.login-container').style.display = 'flex';
        });

        // Login handlers
        if (loginButton) {
            loginButton.addEventListener('click', handleLogin);
        }
        if (faceAuthButton) {
            faceAuthButton.addEventListener('click', simulateFaceAuth);
        }

        // Camera select
        const cameraSelect = document.getElementById('camera-select');
        if (cameraSelect) {
            cameraSelect.addEventListener('change', () => {
                document.getElementById('camera-location').textContent =
                    cameraSelect.value === 'cam1' ? 'Kalimalang' :
                    cameraSelect.value === 'cam2' ? 'Bekasi Utara' :
                    cameraSelect.value === 'cam3' ? 'Bekasi Timur' :
                    'Bekasi Selatan';
            });
        }

        // Range input UI
        const rangeInputs = document.querySelectorAll('input[type="range"]');
        rangeInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const rangeValue = e.target.nextElementSibling;
                if (rangeValue && rangeValue.classList.contains('range-value')) {
                    rangeValue.textContent = e.target.value;
                }
            });
        });

        // Save button
        const saveButton = document.querySelector('.btn-save');
        if (saveButton) {
            saveButton.addEventListener('click', () => {
                showNotification('Settings saved successfully!', 'success');
            });
        }
    }

    function simulateFaceAuth() {
        const scanner = document.querySelector('.face-scanner');
        const faceAuthBtn = document.querySelector('.face-auth-btn');

        faceAuthBtn.disabled = true;
        faceAuthBtn.textContent = 'Scanning...';
        scanner.classList.add('scanning');

        setTimeout(() => {
            scanner.classList.remove('scanning');
            faceAuthBtn.textContent = 'Authentication Successful';

            setTimeout(() => {
                handleLogin();
            }, 1000);
        }, 3000);
    }

    function handleLogin() {
        document.querySelector('.login-container').style.display = 'none';
        document.querySelector('.app-container').style.display = 'grid';

        const faceAuthBtn = document.querySelector('.face-auth-btn');
        if (faceAuthBtn) {
            faceAuthBtn.disabled = false;
            faceAuthBtn.innerHTML = '<i class="fas fa-camera"></i> Face Authenticate';
        }

        showNotification('Welcome back, Admin!', 'info');
    }

    function populateRecordsTable() {
        const table = document.querySelector('#full-records-view .full-table tbody');
        if (!table) return;

        table.innerHTML = '';
        const plateNumbers = ['BM 6408 QO', 'B 1234 CD', 'B 5678 EF', 'D 9012 GH', 'F 3456 IJ'];
        const statuses = [
            { text: 'Verified', class: 'success' },
            { text: 'Pending', class: 'warning' },
            { text: 'Failed', class: 'error' }
        ];
        const locations = ['Kalimalang', 'Bekasi Utara', 'Bekasi Timur', 'Bekasi Selatan', 'Bekasi Barat'];

        for (let i = 1; i <= 20; i++) {
            const plate = plateNumbers[Math.floor(Math.random() * plateNumbers.length)];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const location = locations[Math.floor(Math.random() * locations.length)];
            const hour = Math.floor(Math.random() * 10) + 8;
            const minute = Math.floor(Math.random() * 60);
            const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${i}</td>
                <td>${plate}</td>
                <td>15.2.22</td>
                <td>${time}</td>
                <td>${location}</td>
                <td><span class="status-badge ${status.class}">${status.text}</span></td>
                <td>
                    <button class="action-icon view-record" data-id="${i}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-icon download-record" data-id="${i}">
                        <i class="fas fa-download"></i>
                    </button>
                </td>
            `;
            table.appendChild(row);
        }

        document.querySelectorAll('.view-record').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                showNotification(`Viewing record #${id}`, 'info');
            });
        });

        document.querySelectorAll('.download-record').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                showNotification(`Downloading record #${id}`, 'success');
            });
        });
    }

    function populateAlertsList() {
        const alertsList = document.querySelector('#full-alerts-view .alerts-list');
        if (!alertsList) return;

        alertsList.innerHTML = '';
        const alertTypes = [
            { type: 'critical', icon: 'exclamation-triangle', title: 'Unauthorized Access' },
            { type: 'warning', icon: 'bell', title: 'Motion Detected' },
            { type: 'info', icon: 'info-circle', title: 'System Update' },
            { type: 'success', icon: 'check-circle', title: 'Backup Complete' }
        ];
        const locations = ['Camera 1', 'Camera 2', 'Camera 3', 'Camera 4', 'System'];

        for (let i = 1; i <= 15; i++) {
            const alert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
            const location = locations[Math.floor(Math.random() * locations.length)];
            const now = new Date();
            now.setHours(now.getHours() - Math.floor(Math.random() * 24));
            now.setMinutes(now.getMinutes() - Math.floor(Math.random() * 60));

            const timeFormatted = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });

            const alertItem = document.createElement('div');
            alertItem.className = `alert-item ${alert.type}`;
            alertItem.innerHTML = `
                <span class="alert-icon"><i class="fas fa-${alert.icon}"></i></span>
                <div class="alert-details">
                    <strong>${alert.title}</strong>
                    <p>${location} - ${timeFormatted}</p>
                </div>
                <span class="status-badge ${alert.type}">${alert.title}</span>
            `;

            alertsList.appendChild(alertItem);
        }
    }

    function showNotification(message, type) {
        // Assumes you have a function to display toast/notification messages
        console.log(`[${type.toUpperCase()}] ${message}`);
    }

});
