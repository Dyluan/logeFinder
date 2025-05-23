import subprocess

if __name__ == "__main__":
    # Run the script to gather the links
    print('Gathering links...')
    subprocess.run(["python", "zimmoLinks.py"])
    print('Links gathered successfully')

    print('Gathering details...')
    # Run the script to generate the data
    subprocess.run(["python", "getDetails.py"])
    print('Details gathered successfully')
    
    print('Importing data...')
    # Run the script to evaluate the model
    subprocess.run(["python", "import.py"])
    print('Data imported successfully')