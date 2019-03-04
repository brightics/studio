from brightics.common.utils import check_required_parameters

def select_column(table, **params):
    check_required_parameters(_select_column, params, ['table'])
    return _select_column(table, **params)


def _select_column(table, input_cols, output_cols=None, output_types=None):
    
    type_dict = {
        'int':'int32',
        'long':'int64',
        'double':'float64',
        'boolean':'bool',
        'string':'str'
        }
    
    _table = table.copy()
    
    if output_cols is None:
        _output_cols = input_cols
    else:
        _output_cols = output_cols
        
    if output_types is None:
        _output_types = [_table[x].dtype for x in input_cols]
    else:
        _output_types = [type_dict[x] for x in output_types]
        
    _input_size = min(len(input_cols), len(_output_cols), len(_output_types))
    print(_input_size)
    _input_cols = input_cols[:_input_size]
    _output_cols = _output_cols[:_input_size]
    _output_types = _output_types[:_input_size]
    
    for i, c in enumerate(_input_cols):
        _table[_output_cols[i]] = _table[c].astype(_output_types[i])
    
    return {'out_table':_table[_output_cols]}
