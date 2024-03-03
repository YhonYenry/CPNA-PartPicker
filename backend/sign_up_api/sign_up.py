import mysql.connector
import bcrypt
from flask import jsonify

def signup(mysql_config, data):
    # Create MySQL connection
    db_connection = mysql.connector.connect(**mysql_config)
    db_cursor = db_connection.cursor(dictionary=True)

    # Get username, email, and password from data
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    # Check if username exists
    check_user_query = "SELECT * FROM users WHERE username = %s"
    db_cursor.execute(check_user_query, (username,))
    user_check = db_cursor.fetchone()

    # Close MySQL connection
    db_cursor.close()
    db_connection.close()

    if user_check:
        # Username exists in database, send error message
        return jsonify({"msg": "user_err"}), 200
    else:
        # Create MySQL connection
        db_connection = mysql.connector.connect(**mysql_config)
        db_cursor = db_connection.cursor(dictionary=True)

        # Check if email exists
        check_email_query = "SELECT * FROM users WHERE email = %s"
        db_cursor.execute(check_email_query, (email,))
        email_check = db_cursor.fetchone()

        # Close MySQL connection
        db_cursor.close()
        db_connection.close()

        if email_check:
            # Email exists in database, send error message
            return jsonify({"msg": "email_err"}), 200
        else:
            # Create MySQL connection
            db_connection = mysql.connector.connect(**mysql_config)
            db_cursor = db_connection.cursor(dictionary=True)  

            # Username and email are available, hash password and create user account
            add_user_query = "INSERT INTO users (username, email, password) VALUES (%s, %s, %s)"
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            db_cursor.execute(add_user_query, (username, email, hashed_password))
            db_connection.commit()

            # Close MySQL connection
            db_cursor.close()
            db_connection.close()
            return jsonify({"msg": "user_created"}), 200
