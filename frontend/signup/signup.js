function signup() {
    document.getElementById('username_label').innerHTML = 'Username:';
    document.getElementById('password_label').innerHTML = 'Password:';
    document.getElementById('email_label').innerHTML = 'Email Address:';
    document.getElementById('confirm_password_label').innerHTML = 'Confirm Password:';

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirm_password = document.getElementById('confirm_password').value;

    const data = {
        username: username,
        email: email,
        password: password
    }

    // Check that passwords match and are not empty
    if (username !== '') {
        // Check email format
        email_parts = email.split('@');
        if (email_parts.length === 2 && email_parts[1].indexOf('.') !== -1) {
            // Check if username is empty
            if (password !== '') {
                if (password === confirm_password) {
                    fetch('http://partcheck.online:5000/api/signup', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    })
                        .then(response => response.json())
                        .then(result => {
                            const message = result.msg;
                            if (message == 'user_created') {
                                redirect_signin();

                            } else if (message == 'user_err') {
                                // Username already taken
                                document.getElementById('username_label').innerHTML += '<span class="error_message" style="color: #007bff; ">Username taken.</span>';

                            } else if (message == 'email_err') {
                                // Email already exists
                                document.getElementById('email_label').innerHTML += '<span class="error_message" style="color: #007bff; ">An account with this email exists.</span>';

                            } else {
                                // Unknown Error
                            }
                        })
                } else {
                    // Passwords do not match
                    document.getElementById('confirm_password_label').innerHTML += '<span class="error_message" style="color: #007bff; ">Passwords do not match.</span>';
                }
            } else {
                // Passwords do not match
                document.getElementById('password_label').innerHTML += '<span class="error_message" style="color: #007bff; ">Please enter a password.</span>';
            }
        } else {
            // Invalid email format
            document.getElementById('email_label').innerHTML += '<span class="error_message" style="color: #007bff; ">Please enter a valid email.</span>';
        }
    } else {
        // Username is empty
        document.getElementById('username_label').innerHTML += '<span class="error_message" style="color: #007bff; ">Please enter a username.</span>';
    }
}

function redirect_signin() {
    window.location.href = 'http://partcheck.online:8080/';
}