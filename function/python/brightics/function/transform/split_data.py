from sklearn.model_selection import train_test_split as sktrain_test_split
from brightics.function.validation import validate, greater_than


def split_data(table, train_ratio=7.0, test_ratio=3.0, random_state=None, shuffle=True, stratify=None):
    validate(greater_than(train_ratio, 0.0, 'train_ratio'),
             greater_than(test_ratio, 0.0, 'test_ratio'))
    
    ratio = test_ratio / (train_ratio + test_ratio)
    out_table_train, out_table_test = sktrain_test_split(table, test_size=ratio, random_state=random_state, shuffle=shuffle, stratify=stratify)
  
    return {'train_table' : out_table_train.reset_index(), 'test_table' : out_table_test.reset_index()}
