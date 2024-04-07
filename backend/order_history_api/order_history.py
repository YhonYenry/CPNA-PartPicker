import mysql.connector
import json
from flask import jsonify

def getOrders(mysql_config, username):
    # Create MySQL connection
    db_connection = mysql.connector.connect(**mysql_config)
    db_cursor = db_connection.cursor(dictionary=True)

    # Get userID from username
    get_userID_query = "SELECT id from users where username=%s" 
    db_cursor.execute(get_userID_query, (username,))
    userID = db_cursor.fetchone()['id']
    print(userID)

    if userID:
        get_orders_query = "SELECT * from orders where build_creator=%s ORDER BY order_id DESC" 
        db_cursor.execute(get_orders_query, (userID,))
        orders = db_cursor.fetchall()

        # Close MySQL connection
        db_cursor.close()
        db_connection.close()

        print(orders)

        for order in orders:
            order['username'] = username

        orders_json = json.dumps(orders, default=str)
        return orders_json
    else:
        return jsonify({"msg": "username_err"}), 200

def getComponentNames(mysql_config, request):
    # Get component ID's from request
    case_id = request.args.get('case_ID')
    motherboard_id = request.args.get('motherboard_ID')
    processor_id = request.args.get('processor_ID')
    RAM_id = request.args.get('RAM_ID')
    GPU_id = request.args.get('GPU_ID')
    cooler_id = request.args.get('cooler_ID')
    power_supply_id = request.args.get('power_supply_ID')

    # Queries
    case_name_query = "SELECT PartName from PC_Cases where PartsID=%s"
    motherboard_name_query = "SELECT PartName from MotherBoard where PartsID=%s"
    processor_name_query = "SELECT PartName from CPU where PartsID=%s"
    RAM_name_query = "SELECT PartName from RAM where PartsID=%s"
    GPU_name_query =  "SELECT PartName from GPU where PartsID=%s"
    cooler_name_query = "SELECT CoolerName from CPUCoolers where CoolerID=%s"
    power_supply_name_query = "SELECT PartName from Power_Supplies where PartsID=%s"

    # Initalize array to hold values
    component_names = {}

    # Create MySQL connection
    db_connection = mysql.connector.connect(**mysql_config)
    db_cursor = db_connection.cursor(dictionary=True)

    if case_id:
        db_cursor.execute(case_name_query, (case_id,))
        component_names['case_name'] = db_cursor.fetchone()['PartName']
        if motherboard_id:
            db_cursor.execute(motherboard_name_query, (motherboard_id,))
            component_names['motherboard_name'] = db_cursor.fetchone()['PartName']
            if processor_id:
                db_cursor.execute(processor_name_query, (processor_id,))
                component_names['processor_name'] = db_cursor.fetchone()['PartName']
                if RAM_id:
                    db_cursor.execute(RAM_name_query, (RAM_id,))
                    component_names['RAM_name'] = db_cursor.fetchone()['PartName']
                    if GPU_id:
                        db_cursor.execute(GPU_name_query, (GPU_id,))
                        component_names['GPU_name'] = db_cursor.fetchone()['PartName']
                        if cooler_id:
                            db_cursor.execute(cooler_name_query, (cooler_id,))
                            component_names['cooler_name'] = db_cursor.fetchone()['CoolerName']
                            if power_supply_id:
                                db_cursor.execute(power_supply_name_query, (power_supply_id,))
                                component_names['power_supply_name'] = db_cursor.fetchone()['PartName']

                                # Close MySQL connection
                                db_cursor.fetchall()
                                db_cursor.close()
                                db_connection.close()
                                return jsonify(component_names), 200
                            else:
                                # Close MySQL connection
                                db_cursor.fetchall()
                                db_cursor.close()
                                db_connection.close()
                                return jsonify({"msg": "power_supply_err"}), 200
                        else:
                            # Close MySQL connection
                            db_cursor.fetchall()
                            db_cursor.close()
                            db_connection.close()
                            return jsonify({"msg": "cooler_err"}), 200
                    else:
                        # Close MySQL connection
                        db_cursor.fetchall()
                        db_cursor.close()
                        db_connection.close()
                        return jsonify({"msg": "GPU_err"}), 200
                else:
                    # Close MySQL connection
                    db_cursor.fetchall()
                    db_cursor.close()
                    db_connection.close()
                    return jsonify({"msg": "RAM_err"}), 200
            else:
                # Close MySQL connection
                db_cursor.fetchall()
                db_cursor.close()
                db_connection.close()
                return jsonify({"msg": "processor_err"}), 200
        else:
            # Close MySQL connection
            db_cursor.fetchall()
            db_cursor.close()
            db_connection.close()
            return jsonify({"msg": "case_err"}), 200
    else:
        # Close MySQL connection
        db_cursor.close()
        db_connection.close()
        return jsonify({"msg": "case_err"}), 200

def deleteOrder(mysql_config, order_id):
    # Create MySQL connection
    db_connection = mysql.connector.connect(**mysql_config)
    db_cursor = db_connection.cursor(dictionary=True)

    delete_order_query = "DELETE FROM orders WHERE order_id = %s"
    db_cursor.execute(delete_order_query, (order_id,))
    db_connection.commit()

    # Get the number of rows affected
    rows_deleted = db_cursor.rowcount
    print("Rows Deleted: %d", rows_deleted)

    # Close MySQL connection
    db_cursor.close()
    db_connection.close()

    if rows_deleted:
        return jsonify({"msg": "order_deleted"}), 200
    else:
        return jsonify({"msg": "delete_error"}), 200

def orderCompleted(mysql_config, order_id):
    # Create MySQL connection
    db_connection = mysql.connector.connect(**mysql_config)
    db_cursor = db_connection.cursor(dictionary=True)

    update_order_query = "UPDATE orders SET is_complete = 1 WHERE order_id = %s"
    db_cursor.execute(update_order_query, (order_id,))
    db_connection.commit()

    # Get the number of rows affected
    rows_updated = db_cursor.rowcount

    # Close MySQL connection
    db_cursor.close()
    db_connection.close()

    if rows_deleted:
        return jsonify({"msg": "order_completed"}), 200
    else:
        return jsonify({"msg": "update_error"}), 200