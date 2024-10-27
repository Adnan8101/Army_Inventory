document.addEventListener('DOMContentLoaded', function() {
    // Retrieve userId from the URL and pre-fill the userId field
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    
    // Debugging Step: Log userId retrieval status
    console.log("Retrieved userId from URL:", userId);

    const userIdField = document.getElementById('userId');
    
    if (userId) {
        userIdField.value = userId;
    } else {
        // Display error message if userId is not found
        document.getElementById('message').innerText = "User ID not found. Please restart the reset process.";
        console.error("User ID is missing in URL parameters. Check the redirection from OTP verification.");
    }

    // Password strength validation
    document.getElementById('newPassword').addEventListener('input', function() {
        const password = this.value;
        const requirements = {
            minLength: password.length >= 8,
            lowerCase: /[a-z]/.test(password),
            upperCase: /[A-Z]/.test(password),
            digit: /[0-9]/.test(password),
            specialChar: /[!@#$%^&*]/.test(password),
        };
        
        document.getElementById('minLength').style.color = requirements.minLength ? 'green' : 'red';
        document.getElementById('lowerCase').style.color = requirements.lowerCase ? 'green' : 'red';
        document.getElementById('upperCase').style.color = requirements.upperCase ? 'green' : 'red';
        document.getElementById('digit').style.color = requirements.digit ? 'green' : 'red';
        document.getElementById('specialChar').style.color = requirements.specialChar ? 'green' : 'red';
    });

    // Form submission handler
    document.getElementById('resetPasswordForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const userId = document.getElementById('userId').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!newPassword || newPassword !== confirmPassword) {
            document.getElementById('message').innerText = 'Passwords do not match or missing required fields';
            return;
        }

        // Log form submission details for debugging
        console.log("Submitting reset password form with:", { userId, newPassword });

        try {
            const response = await fetch('/api/password/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, newPassword })
            });

            const result = await response.json();
            if (response.ok) {
                document.getElementById('message').innerText = 'Password reset successful';
                setTimeout(() => { window.location.href = '/login.html'; }, 2000);
            } else {
                document.getElementById('message').innerText = result.message;
                console.error("Server response error:", result.message);
            }
        } catch (error) {
            console.error("Error during password reset request:", error);
            document.getElementById('message').innerText = 'An error occurred. Please try again.';
        }
    });
});
