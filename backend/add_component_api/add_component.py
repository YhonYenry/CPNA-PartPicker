import mysql.connector
import json
from flask import jsonify, Flask, request

def addCase(mysql_config): 
    # Create MySQL connection
    db_connection = mysql.connector.connect(**mysql_config)
    db_cursor = db_connection.cursor(dictionary=True)


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

    insert_query = "INSERT INTO PC_Cases (case_name, part_id, category_id, manufacturer_id, form_factor, dimensions, power_supply, external_bays, internal_bays, weight, price) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    val = (case_name, part_id, category_id, manufacturer_id, form_factor, dimensions, power_supply, external_bays, internal_bays, weight, price)
    db_cursor.execute(insert_query)

    return 'Form Sucessfully Submitted'
