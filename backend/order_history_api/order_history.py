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
        get_orders_query = "SELECT * from orders where build_creator=%s" 
        db_cursor.execute(get_orders_query, (userID,))
        orders = db_cursor.fetchall()
        print(orders)
        orders_json = json.dumps(orders, default=str)
        return orders_json
    else:
        return jsonify({"msg": "username_err"}), 200