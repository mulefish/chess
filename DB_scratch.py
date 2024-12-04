

from helpers.pretty_print import yellow, cyan, log, green
from datetime import datetime
import pandas as pd

import sqlite3

def get_employees_in_department(department_name):
    try:
        conn = sqlite3.connect('employee_management.db')
        cursor = conn.cursor()
        query = '''
        SELECT e.first_name, e.last_name, d.department_name
        FROM employees e
        JOIN departments d ON e.department_id = d.department_id
        WHERE d.department_name = ?
        '''
        cursor.execute(query, (department_name,))
        results = cursor.fetchall()
        conn.close()
        return results
    except sqlite3.Error as e:
        print(f"Error: {e}")
        return []


def get_average_salary_by_department():
    try:
        conn = sqlite3.connect('employee_management.db')
        cursor = conn.cursor()
        query = '''
        SELECT d.department_name, AVG(e.salary) as average_salary
        FROM employees e
        JOIN departments d ON e.department_id = d.department_id
        GROUP BY d.department_name
        '''
        cursor.execute(query)
        results = cursor.fetchall()
        conn.close()
        return results
    except sqlite3.Error as e:
        print(f"Error: {e}")
        return []
    

def get_employees_hired_after(date):
    try:
        conn = sqlite3.connect('employee_management.db')
        cursor = conn.cursor()
        query = '''
        SELECT first_name, last_name, hire_date
        FROM employees
        WHERE hire_date > ?
        '''
        cursor.execute(query, (date,))
        results = cursor.fetchall()
        conn.close()
        return results
    except sqlite3.Error as e:
        print(f"Error: {e}")
        return []



def get_highest_paid_employee_per_department():
    try:
        conn = sqlite3.connect('employee_management.db')
        cursor = conn.cursor()
        query = '''
        SELECT d.department_name, e.first_name, e.last_name, MAX(e.salary) as highest_salary
        FROM employees e
        JOIN departments d ON e.department_id = d.department_id
        GROUP BY d.department_name
        '''
        cursor.execute(query)
        results = cursor.fetchall()
        conn.close()
        return results
    except sqlite3.Error as e:
        print(f"Error: {e}")
        return []

def calculate_and_insert_averages():
    try:
        conn = sqlite3.connect('employee_management.db')
        cursor = conn.cursor()
        
        # Get the average salary and hire date for each department
        query = '''
        SELECT department_id, AVG(salary), AVG(strftime('%s', hire_date)) 
        FROM employees 
        GROUP BY department_id
        '''
        cursor.execute(query)
        results = cursor.fetchall()
        for thing in results: 
            print(thing )
        conn.commit()
        conn.close()

        return "Average values calculated and inserted successfully."
    except sqlite3.Error as e:
        print(f"Error: {e}")
        return "An error occurred."



def sort_by_salary_asc(employee_data): 
    return sorted(employee_data, key=lambda x: x[3], reverse=True)

def sort_by_salary_desc(employee_data): 
    return sorted(employee_data, key=lambda x: x[3], reverse=False)


def sort_by_salary(employee_data): return sorted(employee_data, key=lambda x: x[3])

if __name__ == '__main__':
    yellow('get_employees_in_department')
    x = get_employees_in_department('Engineering')
    print(x)

    yellow('get_average_salary_by_department')
    x = get_average_salary_by_department() 
    print(x)

    yellow('get_employees_hired_after')
    x = get_employees_hired_after('2020-01-01')
    print(x)

    yellow('print(get_highest_paid_employee_per_department')
    salaries = get_highest_paid_employee_per_department()
    x = sort_by_salary_asc(salaries)
    for thing in x:
        print(thing)

    cyan("flip sort")
    salaries = get_highest_paid_employee_per_department()
    x = sort_by_salary_desc(salaries)
    for thing in x: 
        print(thing)



    yellow("calculate_and_insert_averages")
    x = calculate_and_insert_averages()
    print(x)


