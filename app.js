document.getElementById('registrationForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get values from the form and trim any leading/trailing spaces
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Client-side validation
    if (!name || !email || !password) {
        alert('All fields are required!');
        return;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert('Please enter a valid email address!');
        return;
    }

    // Password validation: Minimum 8 characters, at least one letter, one number
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordPattern.test(password)) {
        alert('Password must be at least 8 characters long and contain at least one letter and one number.');
        return;
    }

    try {
        // Show loading indicator (disable the form temporarily)
        document.getElementById('submitBtn').disabled = true;
        document.getElementById('submitBtn').textContent = 'Registering...';

        // Make the API call to your backend
        const response = await fetch('http://localhost:3000/patients/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }), // Send form data as JSON
        });

        // Parse the response
        const data = await response.json();

        if (response.ok) {
            // If registration is successful, display a success message
            alert('Registration successful!');
            
            // Clear the form fields after success
            document.getElementById('registrationForm').reset();

            // Optionally, redirect to a login page here
            window.location.href = 'login.html'; // Redirect to login page
        } else {
            // Display a specific error message returned from the server
            alert(data.message || 'Registration failed. Please try again.');
        }
    } catch (error) {
        // Handle any network errors or other unexpected issues
        console.error('An error occurred:', error);
        alert('An unexpected error occurred. Please check your connection and try again.');
    } finally {
        // Reset the loading state (enable the form again)
        document.getElementById('submitBtn').disabled = false;
        document.getElementById('submitBtn').textContent = 'Register';
    }
});
