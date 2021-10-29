import csv
import re

def contains_domain(address, domain):
    """Returns True if the email address contains the given domain,
    in the domain position, false if not."""
    # Checks for pattern that contains at least one alphanumeric character, dot, dash and then an @ sign
    # followed by the domain
    domain_pattern = r'[\w\.-]+@'+domain+'$'
    if re.match(domain_pattern, address):                       # If the domain pattern is in the address
        return True                                             # Return True
    return False                                                # Return False if it is not

def replace_domain(address, old_domain, new_domain):
    """Replaces the old domain with the new domain in
    the received address."""
    old_domain_pattern = r'' + old_domain + '$'
    address = re.sub(old_domain_pattern, new_domain, address)   # finds the old_domain_pattern in address and replaces it with new_domain
    return address

def main():
    """Processes the list of emails, replacing any instances of the
    old domain with the new domain."""
    old_domain, new_domain = 'abc.edu', 'xyz.edu'
    csv_file_location = '<csv-file-location>'
    report_file = '<path_to_home_directory>' + '/updated_user_emails.csv'
    user_email_list = []
    old_domain_email_list = []
    new_domain_email_list = []

    with open(csv_file_location, 'r') as f:                                     # Opens the file in read mode
        user_data_list = list(csv.reader(f))                                    # Stores as list
        user_email_list = [data[1].strip() for data in user_data_list[1:]]      # From index one to end

    for email_address in user_email_list:
        if contains_domain(email_address, old_domain):                  # The address is the email_address given one at a time
            old_domain_email_list.append(email_address)                 # Originally empty but now filled with old emails
            replaced_email = replace_domain(email_address, old_domain, new_domain)  # Cretaes a new email with the new domain
            new_domain_email_list.append(replaced_email)                # Stores the replaced email in the originally empty list
    
    email_key = ' ' + 'Email Address'
    # user_data_list is the list version of the CSV file
    email_index = user_data_list[0].index(email_key)            # Returns the position of email_key in user_data_list

    for user in user_data_list[1:]:
        for old_domain, new_domain in zip(old_domain_email_list, new_domain_email_list):
            if user[email_index] == ' ' + old_domain:
                user[email_index] = ' ' + new_domain
    f.close()

    with open(report_file, 'w+') as output_file:
        writer = csv.writer(output_file)
        writer.writerows(user_data_list)
        output_file.close()

main()