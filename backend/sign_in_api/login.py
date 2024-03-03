from flask import jsonify, request
from flask_jwt_extended import create_access_token
from datetime import timedelta
import bcrypt
import mysql.connector

def login(mysql_config, data):
    # Create MySQL connection
    db_connection = mysql.connector.connect(**mysql_config)
    db_cursor = db_connection.cursor(dictionary=True)  

    # Get username and password from data
    username = data.get('username')
    password = data.get('password')

    # Query database for user
    check_user_query = "SELECT * FROM users WHERE username = %s"
    db_cursor.execute(check_user_query, (username,))
    user = db_cursor.fetchone()

    # Close MySQL connection
    db_cursor.close()
    db_connection.close()

    print("Query complete")
    if user:
        # Username exists in database, check password
        if bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            expiration_time = timedelta(minutes=30)
            access_token = create_access_token(identity=username, expires_delta=expiration_time)
            return jsonify(access_token=access_token), 200
        else:
            return jsonify({"msg": "pswd_err"}), 200
    else:
        return jsonify({"msg": "user_err"}), 200

