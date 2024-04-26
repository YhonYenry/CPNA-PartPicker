function addCaseClicked() {
    document.documentElement.innerHTML = `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Capstone Frontend</title>
        <link rel="stylesheet" href="./casesform.css">
        <script src="./dashboard.js"></script>
    </head>
    
    <body>
        <main>
            <div id="dashboard">
                <div id="title">
                    <h2>Add Component</h2>
                </div>
                <div id="main-content">
                    <div id="left-dashboard">
                        <div id="create-build" onclick="openCreateBuild()" class="dashboard-button">
                            <img src="./icons/build-icon.png" height="20px">
                            <div class="dashboard-button-description">
                                Build New System
                            </div>
                        </div>
                        <div id="add-component" onclick="openAddComponent()" class="dashboard-button">
                            <img src="./icons/add-component-icon.png" height="20px">
                            <div class="dashboard-button-description">
                                Add Component
                            </div>
                        </div>
                        <div id="Build History" onclick="openBuildHistory()" class=" dashboard-button">
                            <img src="./icons/history-icon.png" height="20px">
                            <div class="dashboard-button-description">
                                Build History
                            </div>
                        </div>
                        <div id="sign-out" onclick="clearCookie()" class="dashboard-button">
                            <img src="./icons/sign-out-icon.png" height="20px">
                            <div class="dashboard-button-description">
                                Sign out
                            </div>
    
                        </div>
                    </div>
                    <div id="right-dashboard">
    
                        <div id = "caseform">
                        <form action = "/api/addcomponent" method="POST" id="case_form" onsubmit="return addCase()">
                            <div>
                                <label for="case_name">Case Name:</label>
                                <input type="text" id="case_name" name="case_name" required>
                            </div>
                            <div>
                                <label for="part_id">Parts ID:</label>
                                <input type="text" id="part_id" name="part_id" required>
                            </div>
                            <div>
                                <label for="category_id">Category ID:</label>
                                <input type="text" id="category_id" name="category_id" required>
                            </div>
                            <div>
                                <label for="manufacturer_id">Manufacturer ID:</label>
                                <input type="text" id="manufacturer_id" name="manufacturer_id" required>
                            </div>
                            <div>
                                <label for="form_factor">Form Factor:</label>
                                <input type="text" id="form_factor" name="form_factor" required>
                            </div>
                            <div>
                                <label for="dimensions">Dimensions:</label>
                                <input type="text" id="dimensions" name="dimensions" required>
                            </div>
                            <div>
                                <label for="power_supply">Power Supply Included:</label>
                                <input type="checkbox" id="power_supply" name="power_supply">
                            </div>
                            <div>
                                <label for="external_bays">External Bays:</label>
                                <input type="text" id="external_bays" name="external_bays" required>
                            </div>
                            <div>
                                <label for="internal_bays">Internal Bays:</label>
                                <input type="text" id="internal_bays" name="internal_bays" required>
                            </div>
                            <div>
                                <label for="weight">Weight:</label>
                                <input type="text" id="weight" name="weight" required>
                            </div>
                            <div>
                                <label for="price">Price:</label>
                                <input type="text" id="price" name="price" required>
                            </div>
                            <button type="submit">Submit</button>
                        </form>
                        </div id = "caseform">
        </html>
    `;
}

async function addCase() {
    var formData = new FormData(document.getElementById("case_form")); // Get form data
    try {
        const response = await fetch('http://partcheck.online:5000/api/addComponent', {
            method: 'POST',
            body: formData
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.text();
        console.log(result); // Log the result from the server
        // Optionally, you can perform actions based on the server response
    } catch (error) {
        console.error('Error:', error); // Log any errors that occur during the request
    }
}



