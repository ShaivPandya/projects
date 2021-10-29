import csv

def read_trades(csv_file_location):
    csv.register_dialect('empDialect', skipinitialspace=True, strict=True)
    trades = csv.DictReader(open(csv_file_location), dialect = 'empDialect')
    trades_list = []
    for data in trades:
        trades_list.append(data)
    return trades_list

def process_symbols(trades_list):
    ticker_list = []
    for trade_data in trades_list:
        ticker_list.append(trade_data['Symbol'])
    ticker_data = {}
    for ticker_name in set(ticker_list):
        if ticker_name != "":
            ticker_data[ticker_name] = ticker_list.count(ticker_name)
    return ticker_data

def process_order(trades_list):
    order_list = []
    for order_data in trades_list:
        order_list.append(order_data['Action'])
    order_data = {}
    for order_name in set(order_list):
        if order_name != "":
            order_data[order_name] = order_list.count(order_name)
    return order_data

def process_amount(trades_list):
    amount_list = []
    for amount_data in trades_list:
        amount_list.append(amount_data['Net Amount'])
    amount_list = list(map(float, amount_list))
    total = sum(amount_list)
    return total

def write_report(symbol_dictionary, order_dictionary, amount, report_file):
    with open(report_file, "w+") as f:
        for k in sorted(symbol_dictionary):
            f.write(str(k)+': '+str(symbol_dictionary[k])+'\n')
        f.write("\n")
        for l in sorted(order_dictionary):
            f.write(str(l)+': '+str(order_dictionary[l])+'\n')
        f.write("\n")
        f.write(str(amount))
        f.close()

trades_list = read_trades('activities.csv')
# print(trades_list)

symbol_dictionary = process_symbols(trades_list)
# print(symbol_dictionary)

order_dictionary = process_order(trades_list)
# print(order_dictionary)

amount = process_amount(trades_list)
# print(amount)

write_report(symbol_dictionary, order_dictionary, amount, 'report.txt')
