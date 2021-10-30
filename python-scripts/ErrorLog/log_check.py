import re, operator, csv

errors = {}
users = {}

with open("syslog.log", "r") as f:
    for line in f:
        username = re.search(r"\((.*)\)", line).group(1)
        if (username) not in users.keys():
            users[username] = {}
            users[username]["INFO"] = 0
            users[username]["ERROR"] = 0
        if "INFO" in line:
            users[username]["INFO"] += 1
        elif "ERROR" in line:
            users[username]["ERROR"] += 1
            error = re.search(r"ERROR ([\w' ]+)", line).group(1).strip()
            if error not in errors.keys():
                errors[error] = 0
            errors[error] += 1

errors = sorted(errors.items(), key=operator.itemgetter(1), reverse=True)
users = sorted(users.items())

errors.insert(0, ("Error", "Count"))

with open('error_message.csv', 'w') as f:
    for error in errors:
        a,b = error
        f.write(str(a)+','+str(b)+'\n')

with open('user_statistics.csv', 'w') as f:
    f.write("Username,INFO,ERROR\n")
    for stats in users:
        a,b = stats
        f.write(str(a)+','+str(b["INFO"])+','+str(b["ERROR"])+'\n')

print(errors)
print()
print(users)
