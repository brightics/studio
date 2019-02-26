from sklearn.neighbors import KNeighborsRegressor 
import pandas as pd
import numpy as np


def knn_regression(train_table, test_table, feature_cols, label_col, k=5, algorithm='auto', leaf_size=30, p=2, pred_col_name='prediction'):
    
    X_train = train_table[feature_cols]
    y_train = train_table[label_col]
    X_test = test_table[feature_cols]

    knn = KNeighborsRegressor (n_neighbors=k, algorithm=algorithm, leaf_size=leaf_size, p=p)
    
    out_col_pred = pd.DataFrame()
    
    # Predict the class labels for the provided data
    knn.fit(X_train, y_train)
    pred = knn.predict(X_test)
    out_col_pred[pred_col_name] = pred
    
    # Result
    out_table = pd.concat([test_table.reset_index(drop=True), out_col_pred], axis=1)
    return {'out_table':out_table}
