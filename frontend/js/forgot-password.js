document.getElementById('forgotPasswordForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const userId = document.getElementById('userId').value;
    const email = document.getElementById('email').value;

    try {
        const response = await fetch('/api/password/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, email }),
        });

        const result = await response.json();
        if (response.ok) {
            window.location.href = `/otp-verification.html?userId=${userId}`;
        } else {
            document.getElementById('message').innerText = result.message;
        }
    } catch (error) {
        document.getElementById('message').innerText = 'An error occurred. Please try again.';
    }
});
