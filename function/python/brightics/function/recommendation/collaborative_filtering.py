from scipy.spatial.distance import jaccard
import numpy as np
import pandas as pd
import itertools
from sklearn import preprocessing
from scipy.sparse import csr_matrix
from brightics.function.utils import _model_dict
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters

def _correlation(u, v):
    u = u - np.average(u)
    v = v - np.average(v)
    denom = np.sqrt(np.inner(u,u)*np.inner(v,v))
    if denom == 0:
        result = -1
    else:
        result = np.inner(u,v)/denom
    return result

def _cosine(u, v):
    denom = np.sqrt(np.inner(u,u)*np.inner(v,v))
    if denom == 0:
        result = -1
    else:
        result = np.inner(u,v)/denom
    return result


    
def _similar_coeff(centered_ratings, i, j, method):

    if method == 'cosine':
        similar_coeff = _cosine(centered_ratings[i],centered_ratings[j])
    elif method == 'pearson':
        similar_coeff = _correlation(centered_ratings[i],centered_ratings[j])
    elif method == 'jaccard':
        similar_coeff = 1-jaccard(centered_ratings[i],centered_ratings[j])
    return similar_coeff

def _predict(ratings, similar_coeff, target, k, weighted):
    new_ratings = []
    for i in range(ratings.shape[1]):
        new_ratings += [[similar_coeff[i],ratings[target][i]]]
    best =  sorted(enumerate(new_ratings), key=lambda x: -x[1][0])
    modi_best = best.copy()
    for item in best:
        if item[1][0] <= 0 or item[1][1] == 0:
            modi_best.remove(item)
    if len(modi_best) < k:
        return 0
    top = modi_best[0:k]
    if weighted:
        multiple = 0
        sim = 0 
        for i in range(k):
            multiple += top[i][1][0]*top[i][1][1]
            sim += top[i][1][0]
        result = multiple/sim
    else:
        sum = 0 
        for i in range(k):
            sum += top[i][1][1]
        result = sum/k
    return result

def _indices(m, row):
    result = []
    for i in range(len(m[row])):
        if m[row][i] != 0:
            result += [i]
    return result

    
def _recommend(target_user, item_users, similar_coeff, N, k, method, weighted, centered, based):

        # calculate the top N items, removing the users own liked items from the results
    user_items = np.transpose(item_users)
    liked = set(_indices(user_items, target_user))
    scores = []
    for target_item in range(user_items.shape[1]):
        if based == 'item':
            scores += [_predict(user_items, similar_coeff[target_item], target_user, k, weighted)]
            
        else:
            scores += [_predict(item_users, similar_coeff[target_user], target_item, k, weighted)]
    count = N + len(liked)
    best = sorted(enumerate(scores), key=lambda x: -x[1])
    return list(itertools.islice((rec for rec in best if rec[0] not in liked), N))

def _nonzeros(m, row):    
    """ returns the non zeroes of a row in csr_matrix """
    for index in range(m.indptr[row], m.indptr[row+1]):
        yield m.indices[index], m.data[index]

def collaborative_filtering_train(table, group_by=None, **params):
    check_required_parameters(_collaborative_filtering_train, params, ['table'])
    if group_by is not None:
        return _function_by_group(_collaborative_filtering_train, table, group_by=group_by, **params)
    else:
        return _collaborative_filtering_train(table, **params)


def _collaborative_filtering_train(table, user_col , item_col, rating_col, N=10, k=2, based = 'item', mode='train', method = 'cosine', weighted = True, centered = True, targets = None):
    table_user_col = table[user_col]
    table_item_col = table[item_col]
    rating_col = table[rating_col]
    user_encoder = preprocessing.LabelEncoder()
    item_encoder = preprocessing.LabelEncoder()
    user_encoder.fit(table_user_col)
    item_encoder.fit(table_item_col)
    user_correspond = user_encoder.transform(table_user_col)
    item_correspond = item_encoder.transform(table_item_col)
    item_users = np.zeros((len(item_encoder.classes_),len(user_encoder.classes_)))
    for i in range(len(table_user_col)):
        item_users[item_correspond[i]][user_correspond[i]] = rating_col[i]+1
    centered_ratings = item_users.copy()
    if centered:
        check_cen = csr_matrix(centered_ratings)
    num_item, num_user = item_users.shape
    if centered:
        for item in range(num_item):
            index = 0
            sum = 0
            for user, rating in _nonzeros(check_cen, item):
                index += 1
                sum+= rating
            avg = sum / index
            for user, rating in _nonzeros(check_cen, item):
                centered_ratings[item][user] -= avg
    for i in range(len(table_user_col)):
        item_users[item_correspond[i]][user_correspond[i]] -= 1
    user_items = item_users.T   
    if method == 'adjusted':
        check_cen = csr_matrix(np.transpose(centered_ratings))
    if method == 'adjusted':
        for user in range(num_user):
            sum = 0
            for item, rating in _nonzeros(check_cen, user):
                sum+= rating
            avg = sum / num_item
            for item in range(num_item):
                centered_ratings[item][user] -= avg
        method = 'cosine'      
        
    if based =='item':
        similar_coeff = np.zeros((num_item,num_item))
        for item in range(num_item):
            similar_coeff[item][item] = -1
            for diff_item in range(item+1,num_item):
                similar_coeff[item][diff_item] = _similar_coeff(centered_ratings, item, diff_item, method)
                similar_coeff[diff_item][item] = similar_coeff[item][diff_item]
                
    else:
        similar_coeff = np.zeros((num_user,num_user))
        for user in range(num_user):
            similar_coeff[user][user] = -1
            for diff_user in range(user+1,num_user):
                similar_coeff[user][diff_user] = _similar_coeff(np.transpose(centered_ratings), user, diff_user, method)
                similar_coeff[diff_user][user] = similar_coeff[user][diff_user]
                   
    if mode == 'Topn':
        if targets is None:
            targets = user_encoder.classes_
        targets_en = user_encoder.transform(targets)      
        result = []
        for user in targets_en:
            recommendations_corre = _recommend(user, item_users, similar_coeff, N, k, method, weighted, centered, based)
            recommendations = []
            for (item,rating) in recommendations_corre:
                recommendations += [item_encoder.inverse_transform([item])[0],rating]
            result += [recommendations]
        result = pd.DataFrame(result)
        result = pd.concat([pd.DataFrame(targets), result], axis=1, ignore_index=True)
        column_names=['user_name']
        for i in range(int((result.shape[1]-1)/2)):
            column_names += ['item_top%d' %(i+1),'rating_top%d' %(i+1)]
        result.columns = column_names
    else:
        result = pd.DataFrame(columns=['1','2'])
                
    model = dict()
    model['weighted'] = weighted
    model['k'] = k
    model['similar_coeff'] = similar_coeff
    model['item_encoder'] = item_encoder
    model['user_encoder'] = user_encoder
    model['item_users'] = item_users
    model['user_col'] = user_col
    model['item_col'] = item_col
    model['based'] = based
    return{'out_table' : result, 'model' : model}

def collaborative_filtering_predict(table, model, **params):
    check_required_parameters(_collaborative_filtering_predict, params, ['table', 'model'])
    if '_grouped_data' in model:
        return _function_by_group(_collaborative_filtering_predict, table, model, **params)
    else:
        return _collaborative_filtering_predict(table, model, **params)  
    
def _collaborative_filtering_predict(table, model, prediction_col ='prediction'):
    weighted = model['weighted']
    k = model['k']
    similar_coeff = model['similar_coeff']
    item_encoder = model['item_encoder']
    user_encoder = model['user_encoder']
    item_users = model['item_users']
    user_col = model['user_col']
    item_col = model['item_col']
    based = model['based']
    encoded_user_col = user_encoder.transform(table[user_col])
    encoded_item_col = item_encoder.transform(table[item_col])
    result = []
    for i in range(len(table[user_col])):
        if based == 'item':
            if item_users[encoded_item_col[i]][encoded_user_col[i]] != 0:
                predict = item_users[encoded_item_col[i]][encoded_user_col[i]]
            else:
                predict = _predict(np.transpose(item_users), similar_coeff[encoded_item_col[i]], encoded_user_col[i], k, weighted)
        else:
            if item_users[encoded_item_col[i]][encoded_user_col[i]] != 0:
                predict = item_users[encoded_item_col[i]][encoded_user_col[i]]
            else:

                predict = _predict(item_users, similar_coeff[encoded_user_col[i]], encoded_item_col[i], k, weighted)

        result += [[table[user_col][i], table[item_col][i],predict]]
    result = pd.DataFrame(result)
    result.columns = [user_col, item_col, prediction_col]
    return {'out_table' : result}