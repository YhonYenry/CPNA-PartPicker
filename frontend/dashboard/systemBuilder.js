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

            // Event listener to display processor selection after motherboard selection is made
            document.getElementById('processor-options').addEventListener('change', function () {
                const RAM_Row = document.getElementById('RAM-row');

                // Show or hide processor-row based on selected value
                if (this.value !== 'default') {
                    RAM_Row.style.display = 'table-row';
                    var processorSelections = document.getElementById('processor-options');

                    var selectedProcessor = processorSelections.options[processorSelections.selectedIndex];

                    var processorPrice = selectedProcessor.getAttribute('data-price');
                    document.getElementById('processor-price').innerHTML = "$" + processorPrice;

                } else {
                    RAM_Row.style.display = 'none';
                }
            });
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

            // Event listener to display processor selection after motherboard selection is made
            document.getElementById('RAM-options').addEventListener('change', function () {
                const GPU_Row = document.getElementById('GPU-row');

                // Show or hide processor-row based on selected value
                if (this.value !== 'default') {
                    GPU_Row.style.display = 'table-row';
                    var RAMSelections = document.getElementById('RAM-options');

                    var selectedRAM = RAMSelections.options[RAMSelections.selectedIndex];

                    var RAMPrice = selectedRAM.getAttribute('data-price');
                    document.getElementById('RAM-price').innerHTML = "$" + RAMPrice;

                } else {
                    GPU_Row.style.display = 'none';
                }
            });

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

            // Event listener to display processor selection after motherboard selection is made
            document.getElementById('GPU-options').addEventListener('change', function () {
                const cooler_Row = document.getElementById('cooler-row');

                // Show or hide processor-row based on selected value
                if (this.value !== 'default') {
                    cooler_Row.style.display = 'table-row';
                    var GPUSelections = document.getElementById('GPU-options');

                    var selectedGPU = GPUSelections.options[GPUSelections.selectedIndex];

                    var GPUPrice = selectedGPU.getAttribute('data-price');
                    document.getElementById('GPU-price').innerHTML = "$" + GPUPrice;

                } else {
                    cooler_Row.style.display = 'none';
                }
            });

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

            // Event listener to display processor selection after motherboard selection is made
            document.getElementById('cooler-options').addEventListener('change', function () {
                const power_supply_row = document.getElementById('power-supply-row');

                // Show or hide processor-row based on selected value
                if (this.value !== 'default') {
                    power_supply_row.style.display = 'table-row';
                    var coolerSelections = document.getElementById('cooler-options');

                    var selectedCooler = coolerSelections.options[coolerSelections.selectedIndex];

                    var coolerPrice = selectedCooler.getAttribute('data-price');
                    document.getElementById('cooler-price').innerHTML = "$" + coolerPrice;

                } else {
                    power_supply_row.style.display = 'none';
                }
            });
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

        // Calculate power consumption of components
        const motherboardPower = document.getElementById('motherboard-options').options[document.getElementById('motherboard-options').selectedIndex].getAttribute('data-power');
        const CPUPower = document.getElementById('processor-options').options[document.getElementById('processor-options').selectedIndex].getAttribute('data-power');
        const GPUPower = document.getElementById('GPU-options').options[document.getElementById('GPU-options').selectedIndex].getAttribute('data-power');
        const totalPower = motherboardPower + CPUPower + GPUPower;
        console.log(totalPower);

        // Check if previous selection has been made
        if (selectedCooler != "default") {
            // Send previous selections to backend to filter for compatible power supplys
            const authToken = getCookie('authToken');
            const response = await fetch(`http://partcheck.online:5000/api/getPowerSupply?case_selection=${selectedCase}&power_consumption=${totalPower}`, {
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

            // Event listener to display processor selection after motherboard selection is made
            document.getElementById('power-supply-options').addEventListener('change', function () {
                const submit_button = document.getElementById('submit-buttom-row');
                const total_price_row = document.getElementById('total-price-row');

                // Show or hide processor-row based on selected value
                if (this.value !== 'default') {
                    var powerSupplySelections = document.getElementById('cooler-options');
                    var selectedPowerSupply = powerSupplySelections.options[powerSupplySelections.selectedIndex];
                    var powerSupplyPriceStr = selectedPowerSupply.getAttribute('data-price');
                    document.getElementById('power-supply-price').innerHTML = "$" + powerSupplyPriceStr;

                    // Calculate total price
                    const casePrice = parseFloat(document.getElementById('case-options').options[document.getElementById('case-options').selectedIndex].getAttribute('data-price'));
                    const motherboardPrice = parseFloat(document.getElementById('motherboard-options').options[document.getElementById('motherboard-options').selectedIndex].getAttribute('data-price'));
                    const processorPrice = parseFloat(document.getElementById('processor-options').options[document.getElementById('processor-options').selectedIndex].getAttribute('data-price'));
                    const RAMPrice = parseFloat(document.getElementById('RAM-options').options[document.getElementById('RAM-options').selectedIndex].getAttribute('data-price'));
                    const GPUPrice = parseFloat(document.getElementById('GPU-options').options[document.getElementById('GPU-options').selectedIndex].getAttribute('data-price'));
                    const coolerPrice = parseFloat(document.getElementById('cooler-options').options[document.getElementById('cooler-options').selectedIndex].getAttribute('data-price'));
                    const powerSupplyPrice = parseFloat(document.getElementById('power-supply-options').options[document.getElementById('power-supply-options').selectedIndex].getAttribute('data-price'));
                    const totalPrice = casePrice + motherboardPrice + processorPrice + RAMPrice + GPUPrice + coolerPrice + powerSupplyPrice;

                    document.getElementById('total-price').innerHTML = "$" + totalPrice;
                    total_price_row.style.display = 'table-row';
                    submit_button.style.display = 'table-row';


                } else {
                    submit_button.style.display = 'none';
                }
            });
        } else {
            // No cooler has been selected yet, alert user
        }

    } catch (error) {
        console.error('Error fetching power supplies:', error);
    }
}

async function submitBuild() {
    // Get component ID's
    const caseID = document.getElementById('case-options').options[document.getElementById('case-options').selectedIndex].value;
    const motherboardID = document.getElementById('motherboard-options').options[document.getElementById('motherboard-options').selectedIndex].value;
    const processorID = document.getElementById('processor-options').options[document.getElementById('processor-options').selectedIndex].value;
    const RAMID = document.getElementById('RAM-options').options[document.getElementById('RAM-options').selectedIndex].value;
    const GPUID = document.getElementById('GPU-options').options[document.getElementById('GPU-options').selectedIndex].value;
    const coolerID = document.getElementById('cooler-options').options[document.getElementById('cooler-options').selectedIndex].value;
    const powerSupplyID = document.getElementById('power-supply-options').options[document.getElementById('power-supply-options').selectedIndex].value;
    const totalPrice = document.getElementById('total-price').innerHTML.slice(1);

    try {
        const authToken = getCookie('authToken');
        const response = await fetch(`http://partcheck.online:5000/api/submitOrder?case_ID=${caseID}&motherboard_ID=${motherboardID}&processor_ID=${processorID}&RAM_ID=${RAMID}&GPU_ID=${GPUID}&cooler_ID=${coolerID}&power_supply_ID=${powerSupplyID}&total_price=${totalPrice}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        const JSONResponse = await response.json();
        console.log(JSONResponse);
        openBuildHistory();

    } catch (error) {
        console.log(error);
    }
}

function resetSelections(currentSelection) {
    var selectBoxes = document.querySelectorAll('.selection-option');
    document.getElementById('total-price-row').style.display = 'none';
    document.getElementById('submit-buttom-row').style.display = 'none';

    selectBoxes.forEach(function (selectBox, index, selectBoxArray) {
        if (index > currentSelection) {
            selectBox.parentNode.parentNode.style.display = 'none';
        } else if (index === currentSelection && index < selectBoxArray.length - 1) {
            var nextSelection = selectBoxArray[index + 1]
            nextSelection.selectedIndex = 0;
            nextSelection.parentNode.parentNode.querySelector('.component-price').innerHTML = '$--.--';
        }
    })

}