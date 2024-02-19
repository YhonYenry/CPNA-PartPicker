async function getCases() {
    try {
        const authToken = getCookie('authToken');

        const response = await fetch('http://partcheck.online:5000/api/getCases', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error in response!');
        }

        const htmlResponse = await response.text();

        document.getElementById('case-options').innerHTML = htmlResponse;

        // Event listener to display motherboard selection after case selection is made
        document.getElementById('case-options').addEventListener('change', function () {
            const motherboardRow = document.getElementById('motherboard-row');

            // Show or hide motherboard-row based on selected value
            if (this.value !== 'default') {
                motherboardRow.style.display = 'table-row';
                var caseSelections = document.getElementById('case-options');

                var selectedCase = caseSelections.options[caseSelections.selectedIndex];

                var casePrice = selectedCase.getAttribute('data-price');
                document.getElementById('case-price').innerHTML = "$" + casePrice;
            } else {
                motherboardRow.style.display = 'none';
            }
        });


    } catch (error) {
        console.error('Error fetching cases:', error);
        window.location.href = "http://partcheck.online:8080";
    }
}

async function getMotherboards() {
    try {
        // Get previous selections
        const selectedCase = document.getElementById('case-options').value;
        console.log(selectedCase);

        // Check if previous selections has been made
        if (selectedCase != "default") {
            // Send case selection to backend to filter for compatible motherboards
            const authToken = getCookie('authToken');
            const response = await fetch(`http://partcheck.online:5000/api/getMotherboards?case_selection=${selectedCase}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error in response!');
            }

            const htmlResponse = await response.text();

            document.getElementById('motherboard-options').innerHTML = htmlResponse;

            // Event listener to display processor selection after motherboard selection is made
            document.getElementById('motherboard-options').addEventListener('change', function () {
                const processorRow = document.getElementById('processor-row');

                // Show or hide processor-row based on selected value
                if (this.value !== 'default') {
                    processorRow.style.display = 'table-row';
                    var motherboardSelections = document.getElementById('motherboard-options');

                    var selectedMotherboard = motherboardSelections.options[motherboardSelections.selectedIndex];

                    var motherboardPrice = selectedMotherboard.getAttribute('data-price');
                    document.getElementById('motherboard-price').innerHTML = "$" + motherboardPrice;

                } else {
                    processorRow.style.display = 'none';
                }
            });

        } else {
            // No motherboard has been selected yet, alert user
        }

    } catch (error) {
        console.error('Error fetching motherboards:', error);
    }
}

async function getProcessors() {
    try {
        // Get previous selections
        const selectedCase = document.getElementById('case-options').value;
        const selectedMotherboard = document.getElementById('motherboard-options').value;

        // Check if previous selection has been made
        if (selectedMotherboard != "default") {
            // Send previous selections to backend to filter for compatible processors
            const authToken = getCookie('authToken');
            const response = await fetch(`http://partcheck.online:5000/api/getProcessors?case_selection=${selectedCase}&motherboard_selection=${selectedMotherboard}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error in response!');
            }

            const htmlResponse = await response.text();

            document.getElementById('processor-options').innerHTML = htmlResponse;
        } else {
            // No motherboard has been selected yet, alert user
        }

    } catch (error) {
        console.error('Error fetching processors:', error);
    }
}

async function getRAM() {
    try {
        // Get previous selections
        const selectedCase = document.getElementById('case-options').value;
        const selectedMotherboard = document.getElementById('motherboard-options').value;
        const selectedProcessor = document.getElementById('processor-options').value;

        // Check if previous selection has been made
        if (selectedProcessor != "default") {
            // Send previous selections to backend to filter for compatible RAM
            const authToken = getCookie('authToken');
            const response = await fetch(`http://partcheck.online:5000/api/getRAM?case_selection=${selectedCase}&motherboard_selection=${selectedMotherboard}&processor_selection=${selectedProcessor}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error in response!');
            }

            const htmlResponse = await response.text();

            document.getElementById('RAM-options').innerHTML = htmlResponse;
        } else {
            // No processor has been selected yet, alert user
        }

    } catch (error) {
        console.error('Error fetching RAMs:', error);
    }
}

async function getGPU() {
    try {
        // Get previous selections
        const selectedCase = document.getElementById('case-options').value;
        const selectedMotherboard = document.getElementById('motherboard-options').value;
        const selectedProcessor = document.getElementById('processor-options').value;
        const selectedRAM = document.getElementById('RAM-options').value;

        // Check if previous selection has been made
        if (selectedRAM != "default") {
            // Send case selection to backend to filter for compatible motherboards
            const authToken = getCookie('authToken');
            const response = await fetch(`http://partcheck.online:5000/api/getGPU?case_selection=${selectedCase}&motherboard_selection=${selectedMotherboard}&processor_selection=${selectedProcessor}&RAM_selection=${selectedRAM}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error in response!');
            }

            const htmlResponse = await response.text();

            document.getElementById('GPU-options').innerHTML = htmlResponse;
        } else {
            // No RAM has been selected yet, alert user
        }

    } catch (error) {
        console.error('Error fetching GPUs:', error);
    }
}


async function getCoolers() {
    try {
        // Get previous selections
        const selectedCase = document.getElementById('case-options').value;
        const selectedMotherboard = document.getElementById('motherboard-options').value;
        const selectedProcessor = document.getElementById('processor-options').value;
        const selectedRAM = document.getElementById('RAM-options').value;
        const selectedGPU = document.getElementById('GPU-options').value;

        // Check if previous selection has been made
        if (selectedGPU != "default") {
            // Send previous selections to backend to filter for compatible coolers
            const authToken = getCookie('authToken');
            const response = await fetch(`http://partcheck.online:5000/api/getCoolers?case_selection=${selectedCase}&motherboard_selection=${selectedMotherboard}&processor_selection=${selectedProcessor}&RAM_selection=${selectedRAM}&GPU_selection=${selectedGPU}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error in response!');
            }

            const htmlResponse = await response.text();

            document.getElementById('cooler-options').innerHTML = htmlResponse;
        } else {
            // No GPU has been selected yet, alert user
        }

    } catch (error) {
        console.error('Error fetching coolers:', error);
    }
}


async function getPowerSupplys() {
    try {
        // Get previous selections
        const selectedCase = document.getElementById('case-options').value;
        const selectedMotherboard = document.getElementById('motherboard-options').value;
        const selectedProcessor = document.getElementById('processor-options').value;
        const selectedRAM = document.getElementById('RAM-options').value;
        const selectedGPU = document.getElementById('GPU-options').value;
        const selectedCooler = document.getElementById('cooler-options').value;

        // Check if previous selection has been made
        if (selectedCooler != "default") {
            // Send previous selections to backend to filter for compatible power supplys
            const authToken = getCookie('authToken');
            const response = await fetch(`http://partcheck.online:5000/api/getPowerSupply?case_selection=${selectedCase}&motherboard_selection=${selectedMotherboard}&processor_selection=${selectedProcessor}&RAM_selection=${selectedRAM}&GPU_selection=${selectedGPU}&cooler_selection=${selectedCooler}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error in response!');
            }

            const htmlResponse = await response.text();

            document.getElementById('power-supply-options').innerHTML = htmlResponse;
        } else {
            // No cooler has been selected yet, alert user
        }

    } catch (error) {
        console.error('Error fetching power supplies:', error);
    }
}
