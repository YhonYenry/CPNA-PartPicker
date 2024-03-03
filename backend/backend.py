from flask import Flask, jsonify, request, render_template, redirect, url_for
from flask_jwt_extended import JWTManager,create_access_token, jwt_required, get_jwt_identity # Auth Tokens
from flask_cors import CORS, cross_origin # Requests to other domains

# modular function declarations
from sign_up_api.sign_up import signup
from sign_in_api.login import login
from reset_password_api.reset_password import send_reset_password, reset_password
from system_builder_api.system_builder import getCases, getMotherboards, getProcessors, getRAM, getGPU, getCoolers, getPowerSupply

app = Flask(__name__, template_folder='../frontend/protected')
app.config['JWT_SECRET_KEY'] = '0376911010287a8b6ee74124123705a2'
CORS(app, resources={r"/api/*": {"origins": "http://partcheck.online:8080"}})
jwt = JWTManager(app)


# Database connection
mysql_config = {
    'host': 'localhost',
    'user': 'capstone',
    'password': 'capstone0',
    'database': 'capstone_database'
}


# API Routes

@app.route('/api/login', methods=['POST'])
def login_route():
    data = request.get_json()
    response = login(mysql_config, data)
    return response



@app.route('/api/signup', methods=['POST'])
def signup_route():
    data = request.get_json()
    response = signup(mysql_config, data)
    return response


@app.route('/api/send-password-reset', methods=['POST'])
def send_password_reset_route():
    data = request.get_json()
    response = send_reset_password(mysql_config, data)
    return response



@app.route('/api/reset-password', methods=['POST'])
def reset_password_route():
    data = request.get_json()
    response = reset_password(mysql_config, data)
    return response


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

# Queries for selecting compatible components
# Compatibility scripts defined here

# Case Query - Selects all cases
@app.route('/api/getCases', methods=['GET'])
@jwt_required()
@cross_origin(origin='http://partcheck.online:8080', headers=['Content-Type', 'Authorization'])
def getCases_route():
    print("Checking auth")
    current_user = get_jwt_identity()
    response = getCases(mysql_config, request)
    return response

# Motherboard Query - Selects all motherboards with compatible case
@app.route('/api/getMotherboards', methods=['GET'])
@jwt_required()
@cross_origin(origin='http://partcheck.online:8080', headers=['Content-Type', 'Authorization'])
def getMotherboards_route():
    print("Checking auth")
    current_user = get_jwt_identity()
    response = getMotherboards(mysql_config, request)
    return response

# Processor Query - Selects all processors with compatible case and motherboard
@app.route('/api/getProcessors', methods=['GET'])
@jwt_required()
@cross_origin(origin='http://partcheck.online:8080', headers=['Content-Type', 'Authorization'])
def getProcessors_route():
    current_user = get_jwt_identity()
    response = getProcessors(mysql_config, request)
    return response


# RAM Query - Selects all RAM with compatible case. motherboard, and processor
@app.route('/api/getRAM', methods=['GET'])
@jwt_required()
@cross_origin(origin='http://partcheck.online:8080', headers=['Content-Type', 'Authorization'])
def getRAM_route():
    print("Checking auth")
    current_user = get_jwt_identity()
    response = getRAM(mysql_config, request)
    return response


# GPU Query - Selects all GPU with compatible case, motherboard, processor, and RAM
@app.route('/api/getGPU', methods=['GET'])
@jwt_required()
@cross_origin(origin='http://partcheck.online:8080', headers=['Content-Type', 'Authorization'])
def getGPU_route():
    print("Checking auth")
    current_user = get_jwt_identity()
    response = getGPU(mysql_config, request)
    return response

# CPU Cooler Query - Selects all Coolers with compatible case, motherboard, processor, RAM, and GPU
@app.route('/api/getCoolers', methods=['GET'])
@jwt_required()
@cross_origin(origin='http://partcheck.online:8080', headers=['Content-Type', 'Authorization'])
def getCoolers_route():
    print("Checking auth")
    current_user = get_jwt_identity()
    response = getCoolers(mysql_config, request)
    return response

# Power Supply Query - Selects all PSU with compatible case, motherboard, processor, RAM, GPU, and Cooler
@app.route('/api/getPowerSupply', methods=['GET'])
@jwt_required()
@cross_origin(origin='http://partcheck.online:8080', headers=['Content-Type', 'Authorization'])
def getPowerSupply():
    print("Checking auth")
    current_user = get_jwt_identity()
    response = getPowerSupply(mysql_config, request)
    return response

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


@app.route('/submit_case')
def case_form():
        return render_template('caseform.html')
#Add Case
@app.route('/submit/component', methods=['POST'])
@jwt_required()
@cross_origin(origin='http://partcheck.online:8080', headers=['Content-Type', 'Authorization'])
def submit_case(): 
    case_name = request.form['case_name']
    part_id = request.form['part_id']
    category_id = request.form['category_id']
    manufacturer_id = request.form['manufacturer_id']
    form_factor = request.form['form_factor']
    dimensions = request.form['dimensions']
    power_supply = 1 if 'power_supply' in request.form else 0
    external_bays = request.form['external_bays']
    internal_bays = request.form['internal_bays']
    weight = request.form['weight']
    price = request.form['price']

    sql = "INSERT INTO your_table_name (case_name, part_id, category_id, manufacturer_id, form_factor, dimensions, power_supply, external_bays, internal_bays, weight, price) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    val = (case_name, part_id, category_id, manufacturer_id, form_factor, dimensions, power_supply, external_bays, internal_bays, weight, price)
    cursor.execute(sql, val)
    return 'Form Sucessfully Submitted'


#Add Motherboard
@app.route('/submit_motherboard', methods=['POST'])
def motherboard_form(): 
    return render_template('motherboardfrom.html')

#@app.route('/submit/component', methods=['POST'])
#@jwt_required()
#@cross_origin(origin='http://partcheck.online:8080', headers=['Content-Type', 'Authorization'])
#def submit_motherboard():
    




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






