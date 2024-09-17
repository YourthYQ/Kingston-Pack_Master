import pandas as pd
import math
from algorithms.box import Box

def import_box_data(file_path, pallet_dims):
    xls = pd.ExcelFile(file_path)
    df = pd.read_excel(
        file_path,
        sheet_name=xls.sheet_names[1],
        skiprows=1  # Skip the first two rows
    )

    green_columns = df[[
        'Part# ',  
        'Qty', 
        'Master carton Qty', 
        'Master carton  Dimension (in)',  
        'Unnamed: 5',  
        'Unnamed: 6',  
        'Master carton weight (lb)'
    ]]

    box_list = []
    box_info = {}

    for index, row in green_columns.iterrows():
        quantity = math.ceil(row["Qty"] / row["Master carton Qty"])
        length = row['Master carton  Dimension (in)']  
        width = row['Unnamed: 5']  
        height = row['Unnamed: 6']  
        key = (length, width, height)
        if key in box_info:
            box_info[key] += quantity
        else:
            box_info[key] = quantity

    scale_ratio = calculate_scaling_ratio(box_info, pallet_dims)

    for index, row in green_columns.iterrows():
        part_number = row['Part# ']

        # testing, revise your testing quantity here
        quantity = math.ceil(row["Qty"] / row["Master carton Qty"])
        # quantity = 2
        
        length = row['Master carton  Dimension (in)']  
        width = row['Unnamed: 5']  
        height = row['Unnamed: 6']  

        for i in range(1, quantity + 1):
            box_list.append(Box(i, format_box_unit(length, scale_ratio), format_box_unit(width, scale_ratio), format_box_unit(height, scale_ratio)))

    return box_list, scale_ratio

def format_pallet_unit(value, scale_ratio):
    return math.floor(math.floor(value) / scale_ratio)

def format_box_unit(value, scale_ratio):
    return math.ceil(math.ceil(value) / scale_ratio)

def calculate_scaling_ratio(box_info, pallet_dims):
    total_exact_volume = 0
    ceilings = []
    for key in box_info.keys():
        ceiling = [math.ceil(x) for x in key]
        ceilings.append(ceiling)
        volume = 1
        for value in key:
            volume = value * volume
        total_exact_volume += volume

    total_volume_ceilings_2, pallet_volume_floors_2, total_volume_ceilings_3, pallet_volume_floors_3 = ceiling_process(ceilings, pallet_dims)

    pallet_volume = 1
    for side in pallet_dims:
        pallet_volume *= side

    exact_percentage = total_exact_volume / pallet_volume
    ceil_2_percentage = total_volume_ceilings_2 / pallet_volume_floors_2
    ceil_3_percentage = total_volume_ceilings_3 / pallet_volume_floors_3

    return find_minimum_error(exact_percentage, ceil_2_percentage, ceil_3_percentage)

def ceiling_process(ceilings, pallet_dims):
    ceilings_2 = [[x / 2 for x in ceiling] for ceiling in ceilings]
    pallet_dims_floors_2 = [math.floor(x) / 2 for x in pallet_dims]
    total_volume_ceilings_2 = sum([math.prod(ceiling) for ceiling in ceilings_2])
    pallet_volume_floors_2 = math.prod(pallet_dims_floors_2)

    ceilings_3 = [[x / 3 for x in ceiling] for ceiling in ceilings]
    pallet_dims_floors_3 = [math.floor(x) / 3 for x in pallet_dims]
    total_volume_ceilings_3 = sum([math.prod(ceiling) for ceiling in ceilings_3])
    pallet_volume_floors_3 = math.prod(pallet_dims_floors_3)

    return total_volume_ceilings_2, pallet_volume_floors_2, total_volume_ceilings_3, pallet_volume_floors_3

def find_minimum_error(exact_percentage, ceil_2_percentage, ceil_3_percentage):
    min_error = min(abs(exact_percentage - ceil_2_percentage), abs(exact_percentage - ceil_3_percentage))
    if min_error == abs(exact_percentage - ceil_2_percentage):
        return 2
    else:
        return 3