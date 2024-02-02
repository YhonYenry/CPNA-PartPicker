// Global variable used during password reset
var resetEmail;

async function signin() {
    document.getElementById('username_label').innerHTML = 'Username:';
    document.getElementById('password_label').innerHTML = 'Password:';

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const data = {
        username: username,
        password: password
    };

    // Check if username field is empty
    if (username !== '') {
        if (password !== '') {
            console.log("Fetching Account");
            try {
                const response = await fetch('http://partcheck.online:5000/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                console.log(result);
                if ('access_token' in result) {
                    const authToken = result.access_token;
                    setCookie('authToken', authToken, 30);
                    console.log(authToken);
                    checkAuth(authToken);
                }
                else {
                    const error = result.msg;

                    if (error == 'user_err') {
                        // User does not exist
                        document.getElementById('username_label').innerHTML += '<span class="error_message" style="color: #007bff; ">The information your entered does not match.</span>';

                    } else if (error == 'pswd_err') {
                        // Password is incorrect
                        document.getElementById('username_label').innerHTML += '<span class="error_message" style="color: #007bff; ">The information your entered does not match.</span>';

                    } else {
                        // Unknown Error
                        console.log("Error!");
                    }
                }
            } catch (error) {
                console.error('Fetch error:', error);
            }

        } else {
            // Password empty
            document.getElementById('password_label').innerHTML += '<span class="error_message" style="color: #007bff; ">Please enter a password.</span>';
        }
    } else {
        // Username empty
        document.getElementById('username_label').innerHTML += '<span class="error_message" style="color: #007bff; ">Please enter a username.</span>';
    }
}

async function checkAuth(authToken) {
    try {
        const response = await fetch('http://partcheck.online:5000/api/checkAuth', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
            }
        });

        if (response.ok) {
            const responseData = await response.json();

            // Access the message and redirect URL from the JSON response
            const redirectUrl = responseData.redirect_url;

            // Perform the redirection to http://partcheck.online:8080/dashboard
            window.location.href = redirectUrl;
        } else {
            // Handle other error cases
            console.log('Failed to authenticate:', response.status);
        }

    } catch (error) {
        console.error('Fetch error:', error);
    }
}

function redirect_signup() {
    window.location.href = 'http://partcheck.online:8080/signup';
}

function open_forgot_password() {
    const resetPasswordForm = document.getElementById('reset-password-form');
    const loginForm = document.getElementById('login-form');

    loginForm.style.display = 'none';
    resetPasswordForm.style.display = 'block';
}

function close_forgot_password() {
    const resetPasswordForm = document.getElementById('reset-password-form');
    const loginForm = document.getElementById('login-form');

    resetPasswordForm.style.display = 'none';
    loginForm.style.display = 'block';
}

function open_reset_code() {
    const resetPasswordForm = document.getElementById('reset-password-form');
    const resetCodeForm = document.getElementById('reset-code-form');

    document.getElementById('email_label').innerHTML = "Email Address:"
    resetPasswordForm.style.display = 'none';
    resetCodeForm.style.display = 'block';
}

function close_reset_code() {
    const resetPasswordForm = document.getElementById('reset-password-form');
    const resetCodeForm = document.getElementById('reset-code-form');

    document.getElementById('reset_code_label').innerHTML = "Reset Code:"
    document.getElementById('confirm_password_label').innerHTML = "Confirm Password:"
    resetCodeForm.style.display = 'none';
    resetPasswordForm.style.display = 'block';
}

function return_home() {
    const resetPasswordForm = document.getElementById('reset-password-form');
    const resetCodeForm = document.getElementById('reset-code-form');
    const loginForm = document.getElementById('login-form');

    document.getElementById('reset_code_label').innerHTML = "Reset Code:"
    document.getElementById('confirm_password_label').innerHTML = "Confirm Password:"
    resetCodeForm.style.display = 'none';
    resetPasswordForm.style.display = 'none';
    loginForm.style.display = 'block';
}

// Sends password reset email
async function send_password_reset() {
    document.getElementById('email_label').innerHTML = "Email Address:"
    const email = document.getElementById('email').value;

    email_parts = email.split('@');

    // Check if email is valid format
    if (email_parts.length === 2 && email_parts[1].indexOf('.') !== -1) {
        // Email is valid format, send request if email in database.

        const data = {
            email: email
        }

        fetch('http://partcheck.online:5000/api/send-password-reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(result => {
                const message = result.msg;
                if (message === "msg_sent") {
                    // Email sent
                    open_reset_code();
                    resetEmail = email;

                } else if (message === "not_found") {
                    // Email does not exist in database
                    document.getElementById('email_label').innerHTML += '<span class="error_message" style="color: #007bff; ">No user is associated with that email.</span>';
                } else if (message === "try_again") {
                    // Error sending email

                } else {
                    // Unknown error
                }
            })

    } else {
        document.getElementById('email_label').innerHTML += '<span class="error_message" style="color: #007bff; ">Please enter a valid email address.</span>';
    }
}

// Checks email code and updates password
async function reset_password() {
    document.getElementById('reset_code_label').innerHTML = "Reset Code:";
    document.getElementById('confirm_password_label').innerHTML = "Confirm Password:";
    const emailCode = document.getElementById('reset_code').value;
    const password = document.getElementById('new_password').value;
    const confirmPassword = document.getElementById('confirm_password').value;

    if (password === confirmPassword && password !== '') {
        // Send new password and email code to server to authenticate
        const data = {
            email: resetEmail,
            password: password,
            emailCode: emailCode
        }

        fetch('http://partcheck.online:5000/api/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(result => {
                const message = result.msg;
                if (message === "pswd_updated") {
                    // Code was correct and password was updated
                    return_home();

                } else if (message === "code_err") {
                    // Email code is not correct
                    document.getElementById('reset_code_label').innerHTML += '<span class="error_message" style="color: #007bff; ">Incorrect Code.</span>';

                } else if (message === "time_err") {
                    // Code is out of time
                    document.getElementById('reset_code_label').innerHTML += '<span class="error_message" style="color: #007bff; ">Code expired.</span>';

                } else {
                    // Unknown error
                }
            })

    } else {
        // Passwords do not match
        document.getElementById('confirm_password_label').innerHTML += '<span class="error_message" style="color: #007bff; ">Passwords do not match.</span>';
    }
}
// Sets authentication cookie
function setCookie(name, value, minutes) {
    const expires = new Date();
    expires.setTime(expires.getTime() + minutes * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

// Gets the cookie from browser
function getCookie(name) {
    const cookieArray = document.cookie.split(';');

    for (let i = 0; i < cookieArray.length; i++) {
        const cookie = cookieArray[i].trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }

    return null;
}

// Removes the cookie
function clearCookie() {
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = 'http://partcheck.online:8080';
}

// Signs user in if valid cookie is present
document.addEventListener('DOMContentLoaded', function () {
    // Check if the 'authToken' cookie exists
    const authToken = getCookie('authToken');

    if (authToken) {
        // If the cookie exists, perform automatic login
        var response = checkAuth(authToken);
        console.log(response);
    }
});
