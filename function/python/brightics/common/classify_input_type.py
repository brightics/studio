from brightics.common.validation import raise_error

def check_col_type(table,feature_cols):
    test_table=table[feature_cols]
    if(check_list(test_table)):
        return list(table[feature_cols[0]])
    elif(check_all_numbers(test_table)):
        return test_table
    else:
        raise_error('0720', 'feature_cols')
    
def check_list(table):
    if(len(table.columns)==1):
        if(table.dtypes[0]!=object):
            return False
        return True

def check_all_numbers(table):
    for i in table.dtypes:
        if(i!=float and i!= int):
            return False
    return True