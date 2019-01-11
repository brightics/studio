import pandas as pd
import numpy as np
import math
from pandasql import sqldf


def add_expression_column(table, new_cols, formulas, expr_type='sqlite'):
    _table = table.copy()

    print(locals())    
    for nc, f in zip(new_cols, formulas):
        if expr_type == 'sqlite':
            _table[nc] = sqldf('select {f} as new_val from _table'.format(f=f))
        else:
            _table[nc] = _table.eval(f, engine=expr_type)
        
    return {'out_table':_table}


def add_expression_column_if(table, new_col, conditions, values, else_value, expr_type='sqlite'):
    _table = table.copy()
    
    _condition_size = min(len(conditions), len(values))
    _conditions = conditions[:_condition_size]
    _values = values[:_condition_size]
    
    if expr_type == 'sqlite':
        casted_else_value = '\'' + str(else_value) + '\'' if isinstance(else_value, str) else str(else_value)
        casted_values = ['\'' + str(v) + '\'' if isinstance(v, str) else str(v) for v in values]
        case_statement = 'case ' + ' '.join(['''when {c} then {v}'''.format(c=c, v=v) for c, v in zip(_conditions, casted_values)]) + ' else ' + casted_else_value + ' end'
        _table[new_col] = sqldf('''select {case_statement} from _table'''.format(case_statement=case_statement))
    else:
        _eval_conditions = [_table.eval(c, engine=expr_type) for c in _conditions]
        _new_col_data = [else_value] * len(_table)
        
        for i in range(len(table)):
            _assigned = False
            for ci, ec in enumerate(_eval_conditions):
                if ec[i] and not _assigned:
                    _new_col_data[i] = _values[ci]
                    _assigned = True
             
        _table[new_col] = _new_col_data
    
    return {'out_table':_table}
