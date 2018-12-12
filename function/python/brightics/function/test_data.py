import pandas as pd
from sklearn.datasets import load_iris


def get_iris():
    raw_data = load_iris()
    out_data = pd.DataFrame(data=raw_data.data, columns=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'])
    out_data['species'] = [raw_data.target_names[x] for x in raw_data.target]
    return out_data
