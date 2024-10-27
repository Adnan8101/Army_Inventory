document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('overviewChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            datasets: [{
                label: 'Monthly Data',
                data: [60, 70, 80, 70, 60, 70],
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            animation: {
                duration: 2000, // animation duration in ms
                easing: 'easeInOutBounce', // easing function
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});
