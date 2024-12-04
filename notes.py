import csv
import numpy as np
import pandas as pd

def factorial(n):
    return 1 if n == 0 else n * factorial(n - 1)

def is_palindrome(s):
    return s == s[::-1]


if __name__ == '__main__':
    x = factorial(5)
    print(x)

    print("aabbaa is_palindrome {} ".format( is_palindrome("aabbaa")))
    print("aabbac is_palindrome {} ".format( is_palindrome("aabbac")))

    reversed_string = "hello"[::-1]
    print("reverse_string {} " + reversed_string )

    max_value = max([1, 2, 3])
    print("max {}".format( max_value ))

    input = "Ab12R"
    numbers = "1234567890"
    nums = list(numbers)
    arr = list(input)
    for item in arr:
        if item in nums: 
            n = int(item)
            print( f"{n} isa n")
        else:
            print(f"{item} isa string ")

    # arrays
    arr1 = [1,2,3,4,5,6]
    print( arr1[2:]) # [3,4,5,6]
    print( arr1 )    # [1, 2, 3, 4, 5, 6]
    print( arr1[-2]) # 5 

    # 2. Conditional List Comprehension
    numbers = [1, 2, 3, 4, 5, 6]
    evens = [x for x in numbers if x % 2 == 0]
    print(evens)  # [2, 4, 6]

    # Create pairs of numbers:
    pairs = [(x, y) for x in range(3) for y in range(3)]
    print(pairs)  # [(0, 0), (0, 1), (0, 2), (1, 0), (1, 1), (1, 2), (2, 0), (2, 1), (2, 2)]

    # Apply a function to each element:
    def double(x):
        return x * 2
    doubled = [double(x) for x in range(5)]
    print(doubled)  # [0, 2, 4, 6, 8]

    # Flatten a 2D list:
    matrix = [[1, 2], [4, 5], [7, 8, 9,0]]
    flattened = [num for row in matrix for num in row]
    print(flattened)  # [1, 2, 4, 5, 7, 8, 9, 0]

    # Transform only specific elements:
    nums = [1, 2, 3, 4, 5]
    result = [x**2 if x % 2 == 0 else x for x in nums]
    print(result)  # [1, 4, 3, 16, 5]

    # prime numbers 
    primes = [x for x in range(2, 20) if all(x % y != 0 for y in range(2, int(x**0.5) + 1))]
    print(primes)  # [2, 3, 5, 7, 11, 13, 17, 19]

    # join
    words = ["Hello", "World", "Python"]
    result = " ".join(words)
    print(result)  # Output: "Hello World Python"

    # numpy
    import numpy as np
    array = np.array(["A", "B", "C"])
    result = "-".join(array.tolist())
    print(result)  # Output: "A-B-C"
     
     #join sub
    nested = [["Hello", "World"], ["Python", "Rocks"]]
    result = [" ".join(sublist) for sublist in nested]
    print(result)  # Output: ["Hello World", "Python Rocks"]

    # CSV
    import csv
    with open("data.csv", mode="r") as file:
        csv_reader = csv.reader(file, delimiter="\t")
        for row in csv_reader:
            print(row)
    # csv as dict
    import csv

    with open("data3.csv", mode="r") as file:
        csv_reader = csv.DictReader(file)
        for row in csv_reader:
            print(row["Name"], row["Age"])  # Example columns

    # dataframe
    df = pd.read_csv("data2.tsv", delimiter="\t")

    # # large file
    # chunk_size = 1000
    # for chunk in pd.read_csv("large_file.csv", chunksize=chunk_size):
    #     print(chunk)


    try:
        with open("data.csv", mode="r") as file:
            csv_reader = csv.reader(file)
            for row in csv_reader:
                print(row)
    except FileNotFoundError:
        print("File not found. Please check the path.")
    except Exception as e:
        print(f"An error occurred: {e}")

    # rotate 
    def rotate_clockwise(matrix):
        return [list(row) for row in zip(*matrix[::-1])]

    matrix = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
    ]
    rotated = rotate_clockwise(matrix)
    print(rotated)
    
    # ASYNC 
import asyncio
import random

async def fetch_data(url):
    print(f"Fetching data from {url}...")
    # Simulate a network request with asyncio.sleep
    await asyncio.sleep(random.uniform(1, 3))  # Simulate a delay
    print(f"Finished fetching data from {url}.")
    return f"Data from {url}"

async def main():
    urls = [
        "https://example.com/api/data1",
        "https://example.com/api/data2",
        "https://example.com/api/data3",
    ]
    
    # Create tasks to fetch data from all URLs
    tasks = [fetch_data(url) for url in urls]

    # Gather results (wait for all tasks to complete)
    results = await asyncio.gather(*tasks)

    # Process results
    for result in results:
        print(result)

# Run the asyncio event loop
asyncio.run(main())

# LINKED LIST 
class Node:
    def __init__(self, data):
        self.data = data  # The value of the node
        self.next = None  # Pointer to the next node (initially None)

    def __repr__(self):
        return str(self.data)  # For easier debugging and display

class LinkedList:
    def __init__(self):
        self.head = None  # Head of the list

    # Add a node at the end
    def append(self, data):
        new_node = Node(data)
        if not self.head:  # If the list is empty
            self.head = new_node
            return
        current = self.head
        while current.next:  # Traverse to the last node
            current = current.next
        current.next = new_node

    # Print all elements in the list
    def display(self):
        current = self.head
        while current:
            print(current.data, end=" -> ")
            current = current.next
        print("None")

    # Delete a node by value
    def delete(self, value):
        current = self.head
        if current and current.data == value:  # If head is the value to be deleted
            self.head = current.next
            current = None
            return
        prev = None
        while current and current.data != value:
            prev = current
            current = current.next
        if not current:  # Value not found
            print(f"{value} not found in the list.")
            return
        prev.next = current.next  # Unlink the node
        current = None

    # Search for a value
    def search(self, value):
        current = self.head
        while current:
            if current.data == value:
                return True
            current = current.next
        return False

ll = LinkedList()

# Append elements to the list
ll.append(10)
ll.append(20)
ll.append(30)

# Display the linked list
ll.display()  # Output: 10 -> 20 -> 30 -> None

# Search for an element
print(ll.search(20))  # Output: True
print(ll.search(40))  # Output: False

# Delete an element
ll.delete(20)
ll.display()  # Output: 10 -> 30 -> None

# Try to delete a non-existent element
ll.delete(50)  # Output: 50 not found in the list.