async function getOrders() {
    console.log("Getting orders");
    try {
        const authToken = getCookie('authToken');
        const response = await fetch(`http://partcheck.online:5000/api/getOrders`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        const JSONResponse = await response.json();
        console.log(JSONResponse);
        const orderTable = document.getElementById("history-table");
        for (order of JSONResponse) {
            var newRow = document.createElement('tr');
            newRow.style.maxHeight = "50px";
            newRow.innerHTML = `
                <td>${order.order_id}</td>
                <td></td>
                <td>${order.total_price}</td>
            `;
            orderTable.appendChild(newRow);
        }

    } catch (error) {
        console.log(error);
    }
}