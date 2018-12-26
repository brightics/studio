from brightics.common.report import ReportBuilder, strip_margin, plt2MD, \
    pandasDF2MD, keyValues2MD
from brightics.function.utils import _model_dict

import numpy as np
import pandas as pd


def cross_table(table, input_cols_1, input_cols_2, result='N', choice=True):
    data = pd.DataFrame(table)
    num_input_cols_1 = len(input_cols_1)
    num_input_cols_2 = len(input_cols_2)
    
    input_cols1_names = []
    for i in input_cols_1:
        input_cols1_names.append(i)
        
    input_cols2_names = []
    for j in input_cols_2:
        input_cols2_names.append(j)
    
    df1 = []
    df2 = []
    for column in input_cols_1:
        df1.append(data[column])
    for column in input_cols_2:
        df2.append(data[column])
        
    # cross table
    
    out_table_count = pd.DataFrame(pd.crosstab(df1, df2, margins=choice))
    a_count = list(out_table_count.index)[:]
    b_count = []
    name1 = ""
    
    if num_input_cols_1 == 1:
        for i in a_count:
            name1 = str(i)
            b_count.append(name1)
            name1 = ""
  
    elif num_input_cols_1 != 1:
        for i in range(len(a_count)):
            name1 = '_'.join(str(s) for s in a_count[i])
            b_count.append(name1)
            name1 = ""
  
    c_count = list(out_table_count.columns)[:]
    d_count = []
    name2 = ""
    
    if num_input_cols_2 == 1:
        for i in c_count:
            name2 = str(i)
            d_count.append(name2)
            name2 = ""
    elif num_input_cols_2 != 1:
        for i in range(len(c_count)):
            name2 = '_'.join(str(s) for s in c_count[i])
            d_count.append(name2)
            name2 = ""

    out_table_count.insert(loc=0, column=' ', value=b_count)
    out_table_count.columns = np.append('N', d_count)
    out_table_count.name = 'N'
    
    result_table = []
    if result == 'N':
        result_table = out_table_count
    
    # cross table normalize by row
    
    if result == 'N / Row Total':
        out_table_row_total = pd.DataFrame(pd.crosstab(df1, df2, margins=False, normalize='index'))
        a_row = list(out_table_row_total.index)[:]
        b_row = []
        name3 = ""
    
        if num_input_cols_1 == 1:
            for i in a_row:
                name3 = str(i)
                b_row.append(name3)
                name3 = ""
        elif num_input_cols_1 != 1:
            for i in range(len(a_row)):
                name3 = '_'.join(str(s) for s in a_row[i])
                b_row.append(name3)
                name3 = ""
        
        c_row = list(out_table_row_total.columns)[:]
        d_row = []
        name4 = ""
        if num_input_cols_2 == 1:
            for i in c_row:
                name4 = str(i)
                d_row.append(name4)
                name4 = ""
        elif num_input_cols_2 != 1:
            for i in range(len(c_row)):
                name4 = '_'.join(str(s) for s in c_row[i])
                d_row.append(name4)
                name4 = ""
    
        out_table_row_total.insert(loc=0, column=' ', value=b_row)
        out_table_row_total.columns = np.append('N / Row Total', d_row)
        out_table_row_total.name = 'N / Row Total'
        result_table = out_table_row_total

    # cross table normalize by column
    if result == 'N / Column Total':
    
        out_table_column_total = pd.DataFrame(pd.crosstab(df1, df2, margins=False, normalize='columns'))
        a_column = list(out_table_column_total.index)[:]
        b_column = []
        name5 = ""
        if num_input_cols_1 == 1:
            for i in a_column:
                name5 = str(i)
                b_column.append(name5)
                name5 = ""
        elif num_input_cols_1 != 1:
                for i in range(len(a_column)):
                    name5 = '_'.join(str(s) for s in a_column[i])
                    b_column.append(name5)
                    name5 = ""
        
        c_column = list(out_table_column_total.columns)[:]
        d_column = []
        name6 = ""
        if num_input_cols_2 == 1:
            for i in c_column:
                name6 = str(i)
                d_column.append(name6)
                name6 = ""
        elif num_input_cols_2 != 1:
            for i in range(len(c_column)):
                name6 = '_'.join(str(s) for s in c_column[i])
                d_column.append(name6)
                name6 = ""
    
        out_table_column_total.insert(loc=0, column=' ', value=b_column)
        out_table_column_total.columns = np.append('N / Column Total', d_column)
        out_table_column_total.name = 'N / Column Total'
        result_table = out_table_column_total
    
    # cross table normalize by all values
    
    if result == 'N / Total':
    
        out_table_total = pd.DataFrame(pd.crosstab(df1, df2, margins=False, normalize='all'))
        a_total = list(out_table_total.index)[:]
        b_total = []
        name7 = ""
        c_total = list(out_table_total.columns)[:]
        d_total = []
        name8 = ""
    
        if num_input_cols_1 == 1:
            for i in a_total:
                name7 = str(i)
                b_total.append(name7)
                name7 = ""
        elif num_input_cols_1 != 1:
            for i in range(len(a_total)):
                name7 = '_'.join(str(s) for s in a_total[i])
                b_total.append(name7)
                name7 = ""
        if num_input_cols_2 == 1:
            for i in c_total:
                name8 = str(i)
                d_total.append(name8)
                name8 = ""
        elif num_input_cols_2 != 1:   
            for i in range(len(c_total)):
                name8 = '_'.join(str(s) for s in c_total[i])
                d_total.append(name8)
                name8 = ""
    
        out_table_total.insert(loc=0, column=' ', value=b_total)
        out_table_total.columns = np.append('N / Total', d_total)
        out_table_total.name = 'N / Total'
        result_table = out_table_total
  
    return {'table': result_table}
