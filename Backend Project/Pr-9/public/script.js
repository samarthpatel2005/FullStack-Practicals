// Product Site JavaScript - Handles client-side logic for testing Express server endpoints

document.addEventListener('DOMContentLoaded', () => {
    const testHomeButton = document.getElementById('test-home');
    const testProductsButton = document.getElementById('test-products');
    const testAboutButton = document.getElementById('test-about');
    const responseContent = document.getElementById('response-content');

    function displayResponse(data, isJson = true) {
        if (isJson) {
            responseContent.textContent = JSON.stringify(data, null, 2);
        } else {
            responseContent.textContent = data;
        }
    }

    function showError(error) {
        responseContent.textContent = `Error: ${error.message}`;
    }

    // Test Home Route
    testHomeButton.addEventListener('click', async () => {
        try {
            const response = await fetch('/');
            const data = await response.text();
            displayResponse(data, false);
        } catch (error) {
            showError(error);
        }
    });

    // Test Products API
    testProductsButton.addEventListener('click', async () => {
        try {
            const response = await fetch('/api/products');
            const data = await response.json();
            displayResponse(data);
        } catch (error) {
            showError(error);
        }
    });

    // Test About API
    testAboutButton.addEventListener('click', async () => {
        try {
            const response = await fetch('/about');
            const data = await response.json();
            displayResponse(data);
        } catch (error) {
            showError(error);
        }
    });

    // Smooth scrolling for navigation
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Initial welcome message
    responseContent.textContent = 'Express Server is ready! Click buttons above to test API endpoints.';
});