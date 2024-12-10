// document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('file-upload').addEventListener('change', function(event) {
        const fileInput = event.target;
        const fileName = fileInput.files[0] ? fileInput.files[0].name : "Click file to upload";
        document.getElementById('upload-text').textContent = fileName;
    });


    // Target HTML elements
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const loginSubmitBtn = document.getElementById('submit-btn');

    // Initial state setup
    loginSubmitBtn.disabled = true;
    loginSubmitBtn.style.cursor = 'not-allowed';
    password.disabled = true;


    // Email input event listener
    email.addEventListener('keyup', () => {
        if (email.value.trim().length > 0) {
            console.log('Email has a value');
            password.disabled = false; // Enable the password field
        } else {
            console.log('Email does not have a valid input');
            resetFormState();
        }
    });

    // Password input event listener
    password.addEventListener('keyup', () => {
        if (password.value.trim().length > 0) {
            console.log('Password has a value');
            loginSubmitBtn.disabled = false; // Enable the submit button
            loginSubmitBtn.style.cursor = 'pointer';
        } else {
            console.log('Password does not have a valid input');
            loginSubmitBtn.disabled = true;
            loginSubmitBtn.style.cursor = 'not-allowed';
        }
    });

    // Helper function to reset form state
    function resetFormState() {
        loginSubmitBtn.disabled = true;
        loginSubmitBtn.style.cursor = 'not-allowed';
        password.disabled = true;
        password.value = ''; // Clear password input
    }


// });
