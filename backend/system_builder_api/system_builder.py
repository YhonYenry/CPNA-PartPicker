from flask import jsonify
import mysql.connector

def getCases(mysql_config, request):

    # Create MySQL connection
    db_connection = mysql.connector.connect(**mysql_config)
    db_cursor = db_connection.cursor(dictionary=True)  

    # Select all cases as it is the first component with no compatibility checks
    get_cases_query = "SELECT * FROM PC_Cases"
    db_cursor.execute(get_cases_query)
    cases = db_cursor.fetchall()

    # Close MySQL connection
    db_cursor.close()
    db_connection.close()

    # Check if cases is empty
    if cases:
        # Format Cases to be rendered
        case_options_html = "<option>Select Case</option>"

        for case in cases:
            case_options_html +="<option value='" + str(case['PartsID']) +  "'data-price='" + str(case['Price']) +"'>" + case['PartName'] + "</option>"
    else:
        case_options_html = "<option>No cases available</option>"
    return case_options_html

def getMotherboards(mysql_config, request):

    # Get case selection
    case = request.args.get('case_selection')
    print(case)

    # Create MySQL connection
    db_connection = mysql.connector.connect(**mysql_config)
    db_cursor = db_connection.cursor(dictionary=True)  

    # Get case specs from database
    case_specs_query = "SELECT FormFactor FROM PC_Cases WHERE PartsID = %s"
    db_cursor.execute(case_specs_query, (case,))
    case_specs = db_cursor.fetchone()

    # Extract the value of MotherboardCompatibility from case_specs
    if case_specs:
        case_board_size = case_specs['FormFactor']
        print(case_board_size)
    else:
        # Case not found
        case_board_size = None

    # Query motherboards where BoardSize is equal to case_board_size
    get_motherboards_query = "SELECT * FROM MotherBoard WHERE BoardSize = %s"
    db_cursor.execute(get_motherboards_query, (case_board_size,))
    motherboards = db_cursor.fetchall()

    # Close MySQL connection
    db_cursor.close()
    db_connection.close()

    if motherboards:
        # Format Cases to be rendered
        motherboard_options_html = "<option>Select Motherboard</option>"

        for motherboard in motherboards:
            motherboard_options_html +="<option value='" + str(motherboard['PartsID']) + "'data-price='" + str(motherboard['Price']) + "'data-power='" + str(motherboard['PowerConsumption']) + "'>" + motherboard['PartName'] + "</option>"
    else:
        motherboard_options_html = "<option>No compatible motherboards found</option>"

    return motherboard_options_html

def getProcessors(mysql_config, request):
    # Get case & motherboard selection
    case = request.args.get('case_selection')
    motherboard = request.args.get('motherboard_selection')

    # Initialize processor options HTML
    processor_options_html = ""

    try:
        # Create MySQL connection
        db_connection = mysql.connector.connect(**mysql_config)
        db_cursor = db_connection.cursor(dictionary=True)

        # Get motherboard specs from database
        motherboard_specs_query = "SELECT CPUSocket FROM MotherBoard WHERE PartsID = %s"
        db_cursor.execute(motherboard_specs_query, (motherboard,))
        motherboard_specs = db_cursor.fetchone()

        if motherboard_specs:
            # Get socket size
            motherboard_socket = motherboard_specs['CPUSocket']
            db_cursor.fetchall()

            # Query processors where CPU
            get_processors_query = "SELECT * FROM CPU WHERE SocketType = %s"
            db_cursor.execute(get_processors_query, (motherboard_socket,))
            processors = db_cursor.fetchall()

            if processors:
                # Format options to be rendered
                processor_options_html = "<option>Select Processor</option>"
                for processor in processors:
                    processor_options_html += "<option value='" + str(processor['PartsID']) + "'data-price='" + str(processor['Price']) + "'data-power='" + str(processor['PowerConsumption']) + "'>" + processor['PartName'] + "</option>"
            else:
                processor_options_html = "<option>No compatible processors found</option>"
        else:
            processor_options_html = "<option>No compatible motherboard found</option>"
    except mysql.connector.Error as err:
        print("MySQL Error: {}".format(err))
        processor_options_html = "<option>Error retrieving data</option>"
    finally:
        # Close MySQL connection and cursor
        try:
            if db_cursor:
                db_cursor.fetchall()  # Consume all results before closing
                db_cursor.close()
            if db_connection:
                db_connection.close()
        except Exception as e:
            print("Error closing cursor/connection:", e)

    return processor_options_html

def getRAM(mysql_config, request):
    # get motherboard, and processor selection
    motherboard = request.args.get('motherboard_selection')
    processor = request.args.get('processor_selection')

    try:
        # Create MySQL connection
        db_connection = mysql.connector.connect(**mysql_config)
        db_cursor = db_connection.cursor(dictionary=True)

        # Get motherboard specs from database
        motherboard_specs_query = "SELECT MemoryType FROM MotherBoard WHERE PartsID = %s"
        db_cursor.execute(motherboard_specs_query, (motherboard,))
        motherboard_specs = db_cursor.fetchone()

        if motherboard_specs:
            # Get Memory Type
            motherboard_memory = motherboard_specs['MemoryType']
            print(motherboard_memory)
            db_cursor.fetchall()

            # Query RAM where 
            get_RAMs_query = "SELECT * FROM RAM WHERE MemoryType = %s"
            db_cursor.execute(get_RAMs_query, (motherboard_memory,))
            RAMs = db_cursor.fetchall()
            print(RAMs)

            if RAMs:
                # Format options to be rendered
                RAM_options_html = "<option>Select RAM</option>"
                for RAM in RAMs:
                    RAM_options_html += "<option value='" + str(RAM['PartsID']) + "'data-price='" + str(RAM['Price']) + "'>" + RAM['PartName'] + "</option>"
            else:
                RAM_options_html = "<option>No compatible RAM found</option>"
        else:
            RAM_options_html = "<option>No compatible motherboard found</option>"
    except mysql.connector.Error as err:
        print("MySQL Error: {}".format(err))
        RAM_options_html = "<option>Error retrieving data</option>"
    finally:
        # Close MySQL connection and cursor
        try:
            if db_cursor:
                db_cursor.fetchall()  # Consume all results before closing
                db_cursor.close()
            if db_connection:
                db_connection.close()
        except Exception as e:
            print("Error closing cursor/connection:", e)
            
    return RAM_options_html

def getGPU(mysql_config, request):
    # Get case, motherboard, processor, and RAM selection
    case = request.args.get('case_selection')
    motherboard = request.args.get('motherboard_selection')
    processor = request.args.get('processor_selection')
    RAM = request.args.get('RAM_selection')

    try:
        # Create MySQL connection
        db_connection = mysql.connector.connect(**mysql_config)
        db_cursor = db_connection.cursor(dictionary=True)

        # Get case specs from database
        case_specs_query = "SELECT SUBSTRING_INDEX(Dimensions, 'x', 1) FROM PC_Cases WHERE PartsID = %s LIMIT 1"
        db_cursor.execute(case_specs_query, (case,))
        case_specs = db_cursor.fetchone()

        if case_specs:
            # Get Memory Type
            case_width = case_specs["SUBSTRING_INDEX(Dimensions, 'x', 1)"]
            print(case_width)
            db_cursor.fetchall()

            # Query GPUs where width less than case width
            get_GPUs_query = "SELECT * FROM GPU WHERE CAST(SUBSTRING_INDEX(Dimensions, 'x', 1) AS UNSIGNED) < %s"
            db_cursor.execute(get_GPUs_query, (case_width,))
            GPUs = db_cursor.fetchall()
            print(GPUs)

            if GPUs:
                # Format options to be rendered
                GPU_options_html = "<option>Select GPU</option>"
                for GPU in GPUs:
                    GPU_options_html += "<option value='" + str(GPU['PartsID']) + "'data-price='" + str(GPU['Price']) + "'data-power='" + str(GPU['PowerConsumption']) + "'>" + GPU['PartName'] + "</option>"
            else:
                GPU_options_html = "<option>No compatible GPU found</option>"
        else:
            GPU_options_html = "<option>No compatible case found</option>"
    except mysql.connector.Error as err:
        print("MySQL Error: {}".format(err))
        GPU_options_html = "<option>Error retrieving data</option>"
    finally:
        # Close MySQL connection and cursor
        try:
            if db_cursor:
                db_cursor.fetchall()  # Consume all results before closing
                db_cursor.close()
            if db_connection:
                db_connection.close()
        except Exception as e:
            print("Error closing cursor/connection:", e)
            
    return GPU_options_html

def getCoolers(mysql_config, request):
    print("Auth successful")
    # Get case, motherboard, processor, RAM, and GPU selection
    case = request.args.get('case_selection')
    motherboard = request.args.get('motherboard_selection')
    processor = request.args.get('processor_selection')
    RAM = request.args.get('RAM_selection')
    GPU = request.args.get('GPU_selection')

    try:
        # Create MySQL connection
        db_connection = mysql.connector.connect(**mysql_config)
        db_cursor = db_connection.cursor(dictionary=True)

        # Get case specs from database
        case_specs_query = "SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(Dimensions, 'x', 2), 'x', -1) FROM PC_Cases WHERE PartsID = %s;"
        db_cursor.execute(case_specs_query, (case,))
        case_specs = db_cursor.fetchone()
        print(case_specs)

        if case_specs:
            # Get Memory Type
            case_width = case_specs["SUBSTRING_INDEX(SUBSTRING_INDEX(Dimensions, 'x', 2), 'x', -1)"]
            print(case_width)
            db_cursor.fetchall()

            # Query GPUs where width less than case width
            get_coolers_query = "SELECT * FROM CPUCoolers WHERE CAST(SUBSTRING_INDEX(Dimensions, 'x', -1) AS UNSIGNED) < %s;"
            db_cursor.execute(get_coolers_query, (case_width,))
            coolers = db_cursor.fetchall()
            print(coolers)

            if coolers:
                # Format options to be rendered
                cooler_options_html = "<option>Select cooler</option>"
                for cooler in coolers:
                    cooler_options_html += "<option value='" + str(cooler['CoolerID']) + "'data-price='" + str(cooler['Price']) + "'>" + cooler['CoolerName'] + "</option>"
            else:
                cooler_options_html = "<option>No compatible cooler found</option>"
        else:
            cooler_options_html = "<option>No compatible case found</option>"
    except mysql.connector.Error as err:
        print("MySQL Error: {}".format(err))
        cooler_options_html = "<option>Error retrieving data</option>"
    finally:
        # Close MySQL connection and cursor
        try:
            if db_cursor:
                db_cursor.fetchall()  # Consume all results before closing
                db_cursor.close()
            if db_connection:
                db_connection.close()
        except Exception as e:
            print("Error closing cursor/connection:", e)

    return cooler_options_html

def getPowerSupply(mysql_config, request):
    # Get case, motherboard, processor, RAM, GPU, and cooler selection
    case = request.args.get('case_selection')
    power_consumption = request.args.get('power_consumption')

    try:
        # Create MySQL connection
        db_connection = mysql.connector.connect(**mysql_config)
        db_cursor = db_connection.cursor(dictionary=True)

        # Get case specs from database
        case_specs_query = "SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(Dimensions, 'x', 2), 'x', -1) FROM PC_Cases WHERE PartsID = %s;"
        db_cursor.execute(case_specs_query, (case,))
        case_specs = db_cursor.fetchone()
        print(case_specs)

        if case_specs:
            # Get Memory Type
            case_width = case_specs["SUBSTRING_INDEX(SUBSTRING_INDEX(Dimensions, 'x', 2), 'x', -1)"]
            print(case_width)
            db_cursor.fetchall()

            # Query GPUs where width less than case width
            get_power_supplies_query = "SELECT * FROM Power_Supplies WHERE CAST(SUBSTRING_INDEX(Dimensions, 'x', -1) AS UNSIGNED) < %s AND PowerOutput > %s;"
            db_cursor.execute(get_power_supplies_query, (case_width, power_consumption))
            power_supplies = db_cursor.fetchall()
            print(power_supplies)

            if power_supplies:
                # Format options to be rendered
                power_supply_options_html = "<option>Select cooler</option>"
                for power_supply in power_supplies:
                    power_supply_options_html += "<option value='" + str(power_supply['PartsID']) + "'data-price='" + str(power_supply['Price']) + "'>" + power_supply['PartName'] + "</option>"
            else:
                power_supply_options_html = "<option>No compatible cooler found</option>"
        else:
            power_supply_options_html = "<option>No compatible case found</option>"
    except mysql.connector.Error as err:
        print("MySQL Error: {}".format(err))
        power_supply_options_html = "<option>Error retrieving data</option>"
    finally:
        # Close MySQL connection and cursor
        try:
            if db_cursor:
                db_cursor.fetchall()  # Consume all results before closing
                db_cursor.close()
            if db_connection:
                db_connection.close()
        except Exception as e:
            print("Error closing cursor/connection:", e)

    return power_supply_options_html

def submitOrder(mysql_config, request, username):
    # Create MySQL connection
    db_connection = mysql.connector.connect(**mysql_config)
    db_cursor = db_connection.cursor(dictionary=True)


    # Get parts from request
    order_price = request.args.get('total_price')
    case_id = request.args.get('case_ID')
    motherboard_id = request.args.get('motherboard_ID')
    processor_id = request.args.get('processor_ID')
    RAM_id = request.args.get('RAM_ID')
    GPU_id = request.args.get('GPU_ID')
    cooler_id = request.args.get('cooler_ID')
    power_supply_id = request.args.get('power_supply_ID')

    get_userID_query = "SELECT id from users where username=%s" 
    db_cursor.execute(get_userID_query, (username,))
    userID = db_cursor.fetchone()['id']
    print(userID)
    if userID:
        # Add order to the database
        submit_order_query = "INSERT INTO orders (build_creator, is_complete, total_price, case_id, motherboard_id, processor_id, ram_id, gpu_id, cpu_cooler_id, powersupply_id) VALUES (%s, 0, %s, %s, %s, %s, %s, %s, %s, %s)"
        db_cursor.execute(submit_order_query, (userID, order_price, case_id, motherboard_id, processor_id, RAM_id, GPU_id, cooler_id, power_supply_id))
        db_connection.commit()
        affected_rows = db_cursor.rowcount
        print(affected_rows)

        # Close MySQL connection
        db_cursor.close()
        db_connection.close()

        if affected_rows:
            # Username exists in database, send error message
            return jsonify({"msg": "order_created"}), 200
        else:
            return jsonify({"msg": "database_err"}), 200
    else:
        return jsonify({"msg": "username_err"}), 200