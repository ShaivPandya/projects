import unittest
from emails import find_email

class EmailsTest(unittest.TestCase):
    """test_basic tests a simple case where expected parameters are chosen, such as the first and last name
    of a person in the csv file"""
    def test_basic(self):
        testcase = [None, "Jane", "Doe"]
        expected = "janedoe@domain.com"
        self.assertEqual(find_email(testcase), expected)
    
    """Tests one name/parameter only (as opposed to two) which should output 'Missing parameters'"""
    def test_one_name(self):
        testcase = [None, "John"]
        expected = "Missing parameters"
        self.assertEqual(find_email(testcase), expected)
    
    """Tests the full name of a user who is not in the list with expected output 'No email address found'"""
    def test_two_name(self):
        testcase = [None, "Roy", "Cooper"]
        expected = "No email address found"
        self.assertEqual(find_email(testcase), expected)
    
    """test_empty tests that if no parameters are passed, the script should return nothing"""
    def test_empty(self):
        testcase = ""
        expected = "Missing parameters"
        self.assertEqual(find_email(testcase), expected)
    
    """Tests an integer input which should return 'Parameters can only be letters'"""
    def test_two_numbers(self):
        testcase = [None, 5, 6]
        expected = "Parameters can only be letters"
        self.assertEqual(find_email(testcase), expected)

if __name__ == '__main__':
    unittest.main()
