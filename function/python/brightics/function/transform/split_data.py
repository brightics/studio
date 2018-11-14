from sklearn.model_selection import train_test_split as sktrain_test_split

def split_data(table, train_ratio=7.0, test_ratio=3.0, random_state=None, shuffle=True, stratify=None):
    ratio = test_ratio / (train_ratio + test_ratio)
    out_table_train, out_table_test = sktrain_test_split(table, test_size=ratio, random_state=random_state, shuffle=shuffle, stratify=stratify)
  
    return {'train_table' : out_table_train, 'test_table' : out_table_test}