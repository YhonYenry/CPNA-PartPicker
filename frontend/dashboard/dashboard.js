document.addEventListener('DOMContentLoaded', async function () {
    openCreateBuild();
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

            var selectBoxes = document.querySelectorAll('.selection-option');
            selectBoxes.forEach(function (selectBox, index, selectBoxesArray) {
                // Add event listener for the change event
                selectBox.addEventListener('change', function () {
                    console.log('event listener activated')
                    // Check if the next select box has a selected value
                    if (index < selectBoxesArray.length - 1) {
                        // Next select box has been selected, do something
                        var nextSelectBox = selectBoxesArray[index + 1];
                        if (nextSelectBox.options.length > 1) {
                            resetSelections(index);
                        }
                    }

                });
            });
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

