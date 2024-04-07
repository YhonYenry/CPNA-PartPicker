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
        const orderTable = document.getElementById("history-table-body");
        orderTable.innerHTML = '';
        for (order of JSONResponse) {
            var newRow = document.createElement('tr');
            newRow.classList.add("order-row");
            newRow.setAttribute('onclick', `orderClicked(${order.order_id})`);
            newRow.dataset.order = JSON.stringify(order);
            newRow.id = `order-${order.order_id}`;

            let orderDate = order.creation_date.split(' ');

            if (order.is_complete == 0) {
                newRow.innerHTML = `
                    <td>${order.order_id}</td>
                    <td>${orderDate[0]}</td>
                    <td>${order.total_price}</td>
                    <td>In Progress</td>
                `;
                orderTable.appendChild(newRow);
            } else {
                newRow.innerHTML = `
                    <td>${order.order_id}</td>
                    <td>${orderDate[0]}</td>
                    <td>${order.total_price}</td>
                    <td>Complete</td>
                `;
                orderTable.appendChild(newRow);
            }
        }

    } catch (error) {
        console.log(error);
    }
}

async function orderClicked(order_id) {
    const orderRow = document.getElementById(`order-${order_id}`);
    const orderData = JSON.parse(orderRow.dataset.order);
    console.log(orderData);

    document.getElementById("order-title").innerHTML = `Order #${order_id}`;
    document.getElementById("order-creation-info").innerHTML = `Created by ${orderData.username} on ${orderData.creation_date}`;
    document.getElementById("order-price-value").innerHTML = `$${orderData.total_price}`;
    const orderPowerDiv = document.getElementById("order-power");

    try {
        const authToken = getCookie('authToken');
        const response = await fetch(`http://partcheck.online:5000/api/getComponentNames?case_ID=${orderData.case_id}&motherboard_ID=${orderData.motherboard_id}&processor_ID=${orderData.processor_id}&RAM_ID=${orderData.ram_id}&GPU_ID=${orderData.gpu_id}&cooler_ID=${orderData.cpu_cooler_id}&power_supply_ID=${orderData.powersupply_id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        const JSONResponse = await response.json();
        document.getElementById("order-case").innerHTML = JSONResponse.case_name;
        document.getElementById("order-motherboard").innerHTML = JSONResponse.motherboard_name;
        document.getElementById("order-processor").innerHTML = JSONResponse.processor_name;
        document.getElementById("order-RAM").innerHTML = JSONResponse.RAM_name;
        document.getElementById("order-GPU").innerHTML = JSONResponse.GPU_name;
        document.getElementById("order-cooler").innerHTML = JSONResponse.cooler_name;
        document.getElementById("order-power-supply").innerHTML = JSONResponse.power_supply_name;
        console.log(JSONResponse);

        if (orderData.is_complete == 0) {
            document.getElementById("order-buttons").innerHTML = `
                <div>
                    <button onclick="deleteOrder(${order_id})">Delete Order</button>
                </div>
                <div>
                    <button onclick="orderCompleted(${order_id})">Mark Complete</button>
                </div>
            `;
        } else {
            document.getElementById("order-buttons").innerHTML = ``;
        }

        document.getElementById("order-info-popup").style.display = "flex";

    } catch (error) {
        console.log(error);
    }

}

function closeOrderInfo() {
    document.getElementById("order-info-popup").style.display = "none";
}

async function deleteOrder(order_id) {
    try {
        const authToken = getCookie('authToken');
        const response = await fetch(`http://partcheck.online:5000/api/deleteOrder?order_id=${order_id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        const deleteStatus = await response.json();
        console.log(deleteStatus);

        if (deleteStatus.msg == 'order_deleted') {
            // Close popup and refresh orders from database
            closeOrderInfo();
            getOrders()

        } else {
            console.error("ERROR: Failed to delete order")
            closeOrderInfo();
        }


    } catch (error) {
        console.log(error);
    }
}

async function orderCompleted(order_id) {
    try {
        const authToken = getCookie('authToken');
        const response = await fetch(`http://partcheck.online:5000/api/orderCompleted?order_id=${order_id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        const updateStatus = await response.json();
        console.log(deleteStatus);

        if (deleteStatus.msg == 'order_completed') {
            // Close popup and refresh orders from database
            closeOrderInfo();
            getOrders()

        } else {
            console.error("ERROR: Failed to update order status")
            closeOrderInfo();
        }


    } catch (error) {
        console.log(error);
    }

    // Close popup and refresh orders from database
    closeOrderInfo();
    getOrders()
}