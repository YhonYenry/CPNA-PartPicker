from flask import jsonify, request
import mysql.connector
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import string
import secrets
import bcrypt
from datetime import datetime, timedelta

SENDGRID_API_KEY = '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'
sg = SendGridAPIClient(SENDGRID_API_KEY)

def send_reset_password(mysql_config, data):
    # Create MySQL connection
    db_connection = mysql.connector.connect(**mysql_config)
    db_cursor = db_connection.cursor(dictionary=True)  

    # Get email from data
    email = data.get('email')
    print(sg)

    # Check if user exists with given email
    check_email_query = "SELECT * FROM users WHERE email = %s"
    db_cursor.execute(check_email_query, (email,))
    user = db_cursor.fetchone()

    # Close MySQL connection
    db_cursor.close()
    db_connection.close()

    if user:
        # Email was found, send reset request
        message = Mail(
            from_email='partcheckemail@gmail.com',
            to_emails=email)
        message.template_id = 'd-765e74f049414300b497195e1daf1fed'

        # Generate one time password
        alphabet = string.ascii_letters + string.digits
        otp = ''.join(secrets.choice(alphabet) for _ in range(6))

        

        message_data = {
            'OTP': otp
        }

        message.dynamic_template_data = message_data
        try:
            # Create MySQL connection
            db_connection = mysql.connector.connect(**mysql_config)
            db_cursor = db_connection.cursor(dictionary=True)  

            # Store one time password in database
            otp_expiration_time = datetime.now() + timedelta(minutes=5)
            update_otp_query = "UPDATE users SET otp = %s, otp_expiration = %s where email = %s"

            db_cursor.execute(update_otp_query, (otp, otp_expiration_time, email))
            db_connection.commit()

            # Close MySQL connection
            db_cursor.close()
            db_connection.close()

            # Send the email
            response = sg.send(message)

            return jsonify({"msg": "msg_sent"}), 200
        except Exception as e:
            # Error sending message
            print("Error:", e)
            return jsonify({"msg": "try_again"}), 200
    else:
        # Email was not found
        return jsonify({"msg": "not_found"}), 200
    
def reset_password(mysql_config, data):
    # Create MySQL connection
    db_connection = mysql.connector.connect(**mysql_config)
    db_cursor = db_connection.cursor(dictionary=True)  

    # Get email code and password from data
    code = data.get('emailCode')
    email = data.get('email')
    password = data.get('password')

    # Check if email code is valid and within time constraints
    check_otp_query = "SELECT otp, otp_expiration FROM users WHERE email = %s"
    db_cursor.execute(check_otp_query, (email,))
    otp_query_result = db_cursor.fetchone()

    # Close MySQL connection
    db_cursor.close()
    db_connection.close()

    if otp_query_result:
        # Get the OTP and its expiration from the database
        otp = otp_query_result['otp']
        otp_expiration = otp_query_result['otp_expiration']

        # Check if the codes match
        if otp == code:
            if datetime.now() < otp_expiration:
                # Create MySQL connection
                db_connection = mysql.connector.connect(**mysql_config)
                db_cursor = db_connection.cursor(dictionary=True)  

                # Code is valid, reset password
                hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
                update_password_query = "UPDATE users SET password = %s WHERE email = %s"
                db_cursor.execute(update_password_query, (hashed_password, email))
                db_connection.commit()

                # Close MySQL connection
                db_cursor.close()
                db_connection.close()
                return jsonify({"msg": "pswd_updated"}), 200
            else:
                # Code is expired
                return jsonify({"msg": "time_err"}), 200
        else:
            # Code is incorrect
            return jsonify({"msg": "code_err"}), 200
    else:
        # Unknown Error
        return jsonify({"msg": "query_err"}), 200