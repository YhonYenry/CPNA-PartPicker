from flask import Flask, jsonify, request, render_template, redirect, url_for
from flask_jwt_extended import JWTManager,create_access_token, jwt_required, get_jwt_identity # Auth Tokens
from flask_cors import CORS, cross_origin # Requests to other domains
from datetime import datetime, timedelta
import mysql.connector # Database Connections
import bcrypt # Password Hashing
import os
from sendgrid import SendGridAPIClient # Send email
from sendgrid.helpers.mail import Mail # Send email
import secrets # Random number generator
import string

app = Flask(__name__, template_folder='../frontend/protected')
app.config['JWT_SECRET_KEY'] = '0376911010287a8b6ee74124123705a2'
CORS(app, resources={r"/api/*": {"origins": "http://partcheck.online:8080"}})
jwt = JWTManager(app)

SENDGRID_API_KEY = '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'
sg = SendGridAPIClient(SENDGRID_API_KEY)


# Database connection
mysql_config = {
    'host': 'localhost',
    'user': 'capstone',
    'password': 'capstone0',
    'database': 'capstone_database'
}



@app.route('/api/login', methods=['POST'])
def api_login():
    # Create MySQL connection
    db_connection = mysql.connector.connect(**mysql_config)
    db_cursor = db_connection.cursor(dictionary=True)  

    # Get data from request
    data = request.get_json()

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
        if  bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            expiration_time = timedelta(minutes=30)
            access_token = create_access_token(identity=username, expires_delta=expiration_time)
            return jsonify(access_token=access_token), 200
        else:
            return jsonify({"msg": "pswd_err"}), 200
    else:
        return jsonify({"msg": "user_err"}), 200



@app.route('/api/signup', methods=['POST'])
def signup():
    # Create MySQL connection
    db_connection = mysql.connector.connect(**mysql_config)
    db_cursor = db_connection.cursor(dictionary=True)  

    # Get data from request
    data = request.get_json()

    # Get username and password from data
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


@app.route('/api/send-password-reset', methods=['POST'])
def send_password_reset():
    # Create MySQL connection
    db_connection = mysql.connector.connect(**mysql_config)
    db_cursor = db_connection.cursor(dictionary=True)  

    # Get data from request
    data = request.get_json()
    # Get email from data
    email = data.get('email')

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



@app.route('/api/reset-password', methods=['POST'])
def reset_password():
    # Create MySQL connection
    db_connection = mysql.connector.connect(**mysql_config)
    db_cursor = db_connection.cursor(dictionary=True)  

    # Get data from request
    data = request.get_json()

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



@app.route('/api/checkAuth', methods=['GET'])
@jwt_required()
def authorized_page():
    print("Checking auth")
    current_user = get_jwt_identity()

    redirect_url = 'http://partcheck.online:8080/dashboard'
    return jsonify(message='User authenticated', redirect_url=redirect_url), 200


# Routes for loading html content on dashboard

# Main dashboard
@app.route('/api/dashboard', methods=['GET'])
@cross_origin(origin='http://partcheck.online:8080', headers=['Content-Type', 'Authorization'])
@jwt_required()
def dashboard():
    print("Checking auth")
    current_user = get_jwt_identity()

    return render_template('/dashboard/dashboard.html', logged_in_as=current_user)

# System Builder
@app.route('/api/systemBuilder', methods=['GET'])
@jwt_required()
@cross_origin(origin='http://partcheck.online:8080', headers=['Content-Type', 'Authorization'])
def openSystemBuilder():
    print("Checking auth")
    current_user = get_jwt_identity()
    return render_template('/systemBuilder/systemBuilder.html', logged_in_as=current_user)

# Component List
@app.route('/api/componentList', methods=['GET'])
@jwt_required()
@cross_origin(origin='http://partcheck.online:8080', headers=['Content-Type', 'Authorization'])
def openComponentList():
    print("Checking auth")
    current_user = get_jwt_identity()
    return render_template('/componentList/componentList.html', logged_in_as=current_user)

# Add Component
@app.route('/api/addComponent', methods=['GET'])
@jwt_required()
@cross_origin(origin='http://partcheck.online:8080', headers=['Content-Type', 'Authorization'])
def openAddComponent():
    print("Checking auth")
    current_user = get_jwt_identity()
    return render_template('/addComponent/addComponent.html', logged_in_as=current_user)

# Component List
@app.route('/api/buildHistory', methods=['GET'])
@jwt_required()
@cross_origin(origin='http://partcheck.online:8080', headers=['Content-Type', 'Authorization'])
def openBuildHistory():
    print("Checking auth")
    current_user = get_jwt_identity()
    return render_template('/buildHistory/buildHistory.html', logged_in_as=current_user)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
