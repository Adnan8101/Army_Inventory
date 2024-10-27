document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const userIdInput = document.getElementById('userId');
    const passwordInput = document.getElementById('password');

    async function loginUser() {
        const userId = userIdInput.value;
        const password = passwordInput.value;

        console.log(`Attempting login with UserID: ${userId}, Password: [HIDDEN]`);

        try {
            // Validate non-empty inputs on the client side
            if (!userId || !password) {
                showPopup('popup-error', 'User ID and Password are required.');
                return;
            }

            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, password }),
            });

            const result = await response.json();
            if (response.ok) {
                // Login successful
                showPopup('popup-success', `Login successful. Welcome, <span style="color:#ff9900;">${result.name}</span>`);
                setTimeout(() => {
                    let redirectUrl;
                    switch (result.userType) {
                        case 'AO':
                            redirectUrl = '/panels/officer';
                            break;
                        case 'WM':
                            redirectUrl = '/panels/weapon_manufacturer';
                            break;
                        case 'WA':
                            redirectUrl = '/panels/agency';
                            break;
                        default:
                            redirectUrl = '/';
                    }
                    window.location.href = redirectUrl;
                }, 3000);
            } else {
                // Handle login failure
                console.error(`Invalid credentials for UserID: ${userId}. Expected UserID or Password did not match.`);
                showPopup('popup-error', result.message || 'Invalid credentials. Please check your User ID and Password.');
            }
        } catch (error) {
            console.error('Error during login request:', error);
            showPopup('popup-error', 'A network error occurred. Please try again.');
        }
    }

    function showPopup(id, message) {
        const popup = document.getElementById(id);
        popup.querySelector('p').innerHTML = message;
        popup.style.display = 'block';
    }

    function closePopup(id) {
        document.getElementById(id).style.display = 'none';
    }

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        loginUser();
    });

    // Expose the closePopup function globally so it works on the onclick attribute
    window.closePopup = closePopup;
});
