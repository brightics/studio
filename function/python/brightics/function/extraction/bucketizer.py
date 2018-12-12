import pandas as pd


def place(a, splits):
    for i in range(len(splits) - 1):
        if splits[i] <= float(a) < splits[i + 1]:
            return i

        
def bucketizer(table, input_cols, splits, table_splits=None, new_name=None):
        
    if table_splits is None:
        if 'to' in splits and 'by' in splits:
            string_format = splits.split(' ')
            splits = []
            if '.' in string_format[4]:
                string_format[4] = str(float(string_format[4]))
                if '.' in string_format[4]:
                    check_decimal_number = string_format[4].split('.')
                    check_decimal_number = len(check_decimal_number[1])
                if 'e' in string_format[4]:
                    check_decimal_number = string_format[4].split('-')
                    check_decimal_number = int(check_decimal_number[1])
                if '.' in string_format[0]:
                    string_format[0] = str(float(string_format[0]))
                    if '.' in string_format[0]:
                        check_starting_decimal_number = string_format[0].split('.')
                        check_decimal_number = max(check_decimal_number, len(check_starting_decimal_number[1]))
                    if 'e' in string_format[0]: 
                        check_starting_decimal_number = string_format[0].split('-')
                        print(int(check_starting_decimal_number[1]))
                        check_decimal_number = max(check_decimal_number, int(check_starting_decimal_number[1]))
            i = float(string_format[0])
            while i <= float(string_format[2]):
                if '.' in string_format[4]:
                    i = round(i, check_decimal_number)
                print(i)
                splits += [i]
                i += float(string_format[4])
                
        else:
            splits = splits.split(',')
        splits = list(map(float, splits))

    # else:
        # splits=list(table_splits[input_cols[1]])
        
    splits.sort()
    if new_name is None:
    
        # new_name=input_cols[0]+'_bucketed'
        new_name = input_cols + '_bucketed'
    table[new_name] = table[input_cols].apply(place, splits=splits)
    
    # table[new_name]=table[input_cols[0]].apply(place,splits=splits)
    # result=table[list(hold_cols)+[input_cols[0]]+[new_name]]
    
    return {'out_table' : table}
