from sklearn.neighbors import KNeighborsClassifier 
import pandas as pd
from brightics.common.utils import check_required_parameters

def knn_classification(train_table, test_table, feature_cols, label_col, k=5, algorithm='auto', leaf_size=30, p=2, pred_col_name='prediction', prob_col_prefix='probability', suffix='index'):
    
    params = [feature_cols, label_col]
    check_required_parameters(knn_classification, params)
    
    X_train = train_table[feature_cols]
    y_train = train_table[label_col]
    X_test = test_table[feature_cols]

    knn = KNeighborsClassifier(n_neighbors=k, algorithm=algorithm, leaf_size=leaf_size, p=p)
    
    # Predict the class labels for the provided data
    knn.fit(X_train, y_train)
    pred = knn.predict(X_test)
    out_col_pred = pd.DataFrame(pred, columns=[pred_col_name])
    
    classes = knn.classes_
    if suffix == 'index':
        suffixes = [i for i, _ in enumerate(classes)]
    else:
        suffixes = classes

    # Return probability estimates for the test data 
    prob = knn.predict_proba(X_test)
    prob_col_name = ['{prob_col_prefix}_{suffix}'.format(prob_col_prefix=prob_col_prefix, suffix=suffix) for suffix in suffixes]	
    out_col_prob = pd.DataFrame(data=prob, columns=prob_col_name)
    
    # Result
    out_table = pd.concat([test_table.reset_index(drop=True), out_col_pred, out_col_prob], axis=1)
    return {'out_table':out_table}
