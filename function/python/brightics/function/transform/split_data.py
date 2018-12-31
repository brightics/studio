from sklearn.model_selection import train_test_split as sktrain_test_split
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters

def split_data(table, group_by=None, **params):
    check_required_parameters(_split_data, params, ['table'])
    if group_by is not None:
        return _function_by_group(_split_data, table, group_by=group_by, **params)
    else:
        return _split_data(table, **params)

def _split_data(table, train_ratio=7.0, test_ratio=3.0, random_state=None, shuffle=True, stratify=None):
    ratio = test_ratio / (train_ratio + test_ratio)
    out_table_train, out_table_test = sktrain_test_split(table, test_size=ratio, random_state=random_state, shuffle=shuffle, stratify=stratify)
  
    return {'train_table' : out_table_train, 'test_table' : out_table_test}