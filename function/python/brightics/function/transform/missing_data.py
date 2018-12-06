from brightics.function.validation import validate, greater_than_or_equal_to


def delete_missing_data(table, input_cols, how='any', thresh=None):
    
    validate(greater_than_or_equal_to(thresh, 1, 'thresh'))
    #validate_number_greater_than_or_equal_to(thresh, 1, 'thresh')
    #if not thresh >= 1: raise BrighticsFunctionException('0010', ['thresh', 1])
    
    _table = table.copy()
    
    if thresh is not None:
        thresh = len(input_cols) - thresh + 1
    
    _out_table = _table.dropna(subset=input_cols, how=how, axis='index', thresh=thresh)
        
    return {'out_table':_out_table}