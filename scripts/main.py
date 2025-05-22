import subprocess

if __name__ == "__main__":
    # Run the script to gather the links
    subprocess.run(["python", "zimmoLinks.py"])

    # Run the script to generate the data
    subprocess.run(["python", "getDetails.py"])

    # Run the script to evaluate the model
    subprocess.run(["python", "import.py"])