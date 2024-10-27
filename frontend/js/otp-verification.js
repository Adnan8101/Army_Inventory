// Extract userId from URL and populate the readonly field
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    document.getElementById('userId').value = userId;

    // Autofocus management for OTP inputs
    const otpInputs = document.querySelectorAll('.otp-input');
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            if (input.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });

        input.addEventListener('keydown', (event) => {
            if (event.key === 'Backspace' && input.value.length === 0 && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
    });
});

// Submit OTP Verification Form
document.getElementById('otpVerificationForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const userId = document.getElementById('userId').value;
    const otp = Array.from(document.querySelectorAll('.otp-input')).map(input => input.value).join('');

    try {
        const response = await fetch('/api/password/verify-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, otp }),
        });

        const result = await response.json();
        if (response.ok) {
            // Redirect to reset password page with userId in URL
            window.location.href = `/reset-password.html?userId=${userId}`;
        } else {
            document.getElementById('message').innerText = result.message;
        }
    } catch (error) {
        document.getElementById('message').innerText = 'An error occurred. Please try again.';
    }
});
