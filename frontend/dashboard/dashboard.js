document.addEventListener('DOMContentLoaded', async function () {
    await fetchDashboard();
});

function attachEventListeners() {
    const leftDashboard = document.getElementById('left-dashboard');

    leftDashboard.addEventListener('mouseover', () => {
        document.querySelectorAll('.dashboard-button-description').forEach(description => {
            description.style.display = 'flex';
        });
        leftDashboard.style.width = '200px';
    });

    leftDashboard.addEventListener('mouseout', () => {
        document.querySelectorAll('.dashboard-button-description').forEach(description => {
            description.style.display = 'none';
        });
        leftDashboard.style.width = '';
    });
}

async function fetchDashboard() {
    const authToken = getCookie('authToken');

    try {
        const response = await fetch('http://partcheck.online:5000/api/dashboard', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });


        if (!response.ok) {
            window.location.href = "http://partcheck.online:8080";
        }

        const htmlContent = await response.text();
        document.documentElement.innerHTML = htmlContent;
        attachEventListeners();
        return 200;
    } catch (error) {
        console.error(error);
        window.location.href = "http://partcheck.online:8080";
    }
}


function openCreateBuild() {
    const authToken = getCookie('authToken');

    fetch('http://partcheck.online:5000/api/systemBuilder', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(htmlContent => {
            document.documentElement.innerHTML = htmlContent;
            attachEventListeners();
            return 200;
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}

function openComponentList() {
    const authToken = getCookie('authToken');

    fetch('http://partcheck.online:5000/api/componentList', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(htmlContent => {
            document.documentElement.innerHTML = htmlContent;
            attachEventListeners();
            return 200;
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}

function openAddComponent() {
    const authToken = getCookie('authToken');

    fetch('http://partcheck.online:5000/api/addComponent', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(htmlContent => {
            document.documentElement.innerHTML = htmlContent;
            attachEventListeners();
            return 200;
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}

async function openBuildHistory() {
    try {
        const authToken = getCookie('authToken');

        const response = await fetch('http://partcheck.online:5000/api/buildHistory', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const htmlContent = await response.text();
        document.documentElement.innerHTML = htmlContent;

        // Get orders from database based on username
        await getOrders();

        attachEventListeners();
        return 200;
    } catch (error) {
        console.error('Fetch error:', error);
    }
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

