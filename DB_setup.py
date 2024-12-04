import sqlite3
from helpers.pretty_print import yellow, cyan, log, green


# Connect to the SQLite database (or create it if it doesn't exist)
db_name = "employee_management.db"
table1 = "departments"
table2 = "employees"
conn = sqlite3.connect(db_name)

# Create a cursor object to interact with the database
cursor = conn.cursor()

# Create the departments table
cursor.execute('''
CREATE TABLE IF NOT EXISTS {} (
    department_id INTEGER PRIMARY KEY AUTOINCREMENT,
    department_name TEXT NOT NULL
)
'''.format(table1))

# Create the employees table
cursor.execute('''
CREATE TABLE IF NOT EXISTS {} (
    employee_id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone_number TEXT,
    hire_date TEXT NOT NULL,
    job_title TEXT NOT NULL,
    salary REAL NOT NULL,
    department_id INTEGER,
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
)
'''.format(table2))

# Insert data into the departments table
departments = [
    ('Human Resources',),
    ('Engineering',),
    ('Sales',),
    ('Marketing',)
]

sql1 = 'INSERT INTO {} (department_name) VALUES (?)'.format(table1)
cursor.executemany(sql1, departments)

# Insert data into the employees table
employees = [
    ('John', 'Doe', 'jdoe@example.com', '555-1234', '2020-01-15', 'HR Manager', 60000.00, 1),
    ('Jane', 'Smith', 'jsmith@example.com', '555-5678', '2019-03-20', 'Software Engineer', 90000.00, 2),
    ('Michael', 'Brown', 'mbrown@example.com', '555-9876', '2021-07-30', 'Sales Executive', 75000.00, 3),
    ('Emily', 'Davis', 'edavis@example.com', '555-6543', '2018-11-05', 'Marketing Specialist', 65000.00, 4),
    ('David', 'Wilson', 'dwilson@example.com', '555-4321', '2022-08-10', 'Software Engineer', 85000.00, 2)
]

sql2 = "INSERT INTO {} (first_name, last_name, email, phone_number, hire_date, job_title, salary, department_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)".format(table2)

cursor.executemany(sql2, employees)

# Commit the changes and close the connection
conn.commit()
conn.close()

yellow(f"DB={db_name}")
yellow(f"table1={table1}")
yellow(f"table2={table2}")
