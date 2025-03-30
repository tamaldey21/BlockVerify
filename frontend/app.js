class DataVerificationPlatform {
    constructor() {
        this.isConnected = false;
        this.account = null;
        this.init();
    }

    init() {
        // Initialize elements
        this.connectButton = document.getElementById('connectWallet');
        this.verificationForm = document.getElementById('verificationForm');
        this.verificationsList = document.getElementById('verificationsList');

        // Add event listeners
        this.connectButton.addEventListener('click', () => this.connectWallet());
        this.verificationForm.addEventListener('submit', (e) => this.handleSubmission(e));

        // Initialize sample verifications
        this.loadSampleVerifications();

        // Add scroll animations
        this.initScrollAnimations();
    }

    async connectWallet() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({ 
                    method: 'eth_requestAccounts' 
                });
                this.account = accounts[0];
                this.isConnected = true;
                this.connectButton.innerHTML = `
                    <i class="fas fa-wallet"></i> 
                    ${this.account.slice(0,6)}...${this.account.slice(-4)}
                `;
                this.showNotification('Wallet connected successfully!', 'success');
            } catch (error) {
                this.showNotification('Failed to connect wallet', 'error');
            }
        } else {
            this.showNotification('Please install MetaMask!', 'error');
        }
    }

    handleSubmission(e) {
        e.preventDefault();
        if (!this.isConnected) {
            this.showNotification('Please connect your wallet first!', 'error');
            return;
        }

        const formData = new FormData(e.target);
        const data = {
            title: formData.get('title'),
            content: formData.get('content'),
            source: formData.get('source')
        };

        this.addVerification(data);
        e.target.reset();
        this.showNotification('Data submitted for verification!', 'success');
    }

    addVerification(data) {
        const verificationElement = document.createElement('div');
        verificationElement.className = 'verification-item';
        verificationElement.innerHTML = `
            <h4>${data.title}</h4>
            <p>${data.content}</p>
            ${data.source ? `<a href="${data.source}" target="_blank">Source</a>` : ''}
            <div class="verification-actions">
                <button onclick="platform.verify(this, true)">
                    <i class="fas fa-check"></i> Verify
                </button>
                <button onclick="platform.verify(this, false)">
                    <i class="fas fa-times"></i> Reject
                </button>
            </div>
        `;
        this.verificationsList.appendChild(verificationElement);
    }

    verify(button, isVerified) {
        if (!this.isConnected) {
            this.showNotification('Please connect your wallet first!', 'error');
            return;
        }
        
        const verificationItem = button.closest('.verification-item');
        verificationItem.classList.add(isVerified ? 'verified' : 'rejected');
        verificationItem.style.opacity = '0.7';
        button.parentElement.innerHTML = isVerified ? 
            '<span class="verified-text">Verified ✓</span>' : 
            '<span class="rejected-text">Rejected ✗</span>';
    }

    loadSampleVerifications() {
        const sampleData = [
            {
                title: "Climate Change Report 2024",
                content: "Global temperatures have risen by 1.1°C since pre-industrial times.",
                source: "https://example.com/climate-report"
            },
            {
                title: "COVID-19 Vaccination Data",
                content: "70% of the global population has received at least one dose.",
                source: "https://example.com/covid-data"
            }
        ];

        sampleData.forEach(data => this.addVerification(data));
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        });

        document.querySelectorAll('.step, .stat-item, .verification-item')
            .forEach(el => observer.observe(el));
    }
}

// Initialize the platform
const platform = new DataVerificationPlatform();

// Add smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
