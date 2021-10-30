#!/usr/bin/python 3

"""
To execute, enter:
find . -name "*old_string*" | python3 change_name.py

Or:
find . -name "*old_string*" | ./change_name.py

"""

import sys, subprocess

for line in sys.stdin:
    old_name = line.strip()
    new_name = old_name.replace("old_string", "new_string")
    subprocess.run(["mv", old_name, new_name])


