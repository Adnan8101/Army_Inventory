document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('weeklyChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Complete', 'In Progress', 'Delayed'],
            datasets: [{
                label: 'Weekly Status',
                data: [50, 25, 25],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
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
