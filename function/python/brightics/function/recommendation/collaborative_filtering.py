import numpy as np
import pandas as pd
import itertools
from sklearn import preprocessing
from scipy.sparse import csr_matrix
from brightics.common.repr import BrtcReprBuilder
from brightics.common.repr import strip_margin
from brightics.common.repr import pandasDF2MD
from brightics.common.repr import dict2MD
from brightics.function.utils import _model_dict
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.common.validation import validate
from brightics.common.validation import greater_than_or_equal_to
from brightics.common.utils import get_default_from_parameters_if_required
from sklearn.metrics.pairwise import cosine_similarity, pairwise_distances


def _predict(ratings, similar_coeff, target, k, weighted, normalize, user_avg, target_user_avg):
    new_ratings = []
    if normalize:
        for i in _nonzeros(ratings,target):
                new_ratings += [[similar_coeff[i[0]],i[1]-user_avg[i[0]]]]
    else:
        for i in _nonzeros(ratings,target):
                new_ratings += [[similar_coeff[i[0]],i[1]]]
    best =  sorted(enumerate(new_ratings), key=lambda x: -x[1][0])
    modi_best = [i for i in best if i[1][0] != -1]
    if len(modi_best) < k:
        return None
    top = modi_best[0:k]
    if weighted:
        multiple = 0
        sim = 0
        for i in range(k):
            multiple += top[i][1][0]*top[i][1][1]
            sim += abs(top[i][1][0])
        result = multiple/sim
    else:
        sum = 0
        for i in range(k):
            sum += top[i][1][1]
        result = sum/k
    if normalize:
        result += target_user_avg
    return result

def _indices(m, row):
    result=[]
    for index in range(m.indptr[row], m.indptr[row+1]):
        result.append(m.indices[index])
    return result

def _recommend(target_user, item_users, similar_coeff, N, k, method, weighted, centered, based, normalize, user_avg):

        # calculate the top N items, removing the users own liked items from the results
    user_items = item_users.transpose().tocsr()
    liked = set(_indices(user_items, target_user))
    scores = []
    for target_item in range(user_items.shape[1]):
        if based == 'item':
            scores += [_predict(user_items, similar_coeff[target_item], target_user, k, weighted, normalize, user_avg, None)]

        else:
            if normalize:
                scores += [_predict(item_users, similar_coeff[target_user], target_item, k, weighted, normalize, user_avg, user_avg[target_user])]
            else:
                scores += [_predict(item_users, similar_coeff[target_user], target_item, k, weighted, normalize, user_avg, None)]
    best = sorted(enumerate(scores), key=lambda x: (x[1] is not None, x[1]), reverse=True)
    return list(itertools.islice((rec for rec in best if rec[0] not in liked), N))

def _nonzeros(m, row):    
    """ returns the non zeroes of a row in csr_matrix """
    for index in range(m.indptr[row], m.indptr[row+1]):
        yield m.indices[index], m.data[index]

def collaborative_filtering_train(table, group_by=None, **params):
    params = get_default_from_parameters_if_required(params,_collaborative_filtering_train)
    param_validation_check = [greater_than_or_equal_to(params, 1, 'N'),
                              greater_than_or_equal_to(params, 1, 'k')]
        
    validate(*param_validation_check)
    check_required_parameters(_collaborative_filtering_train, params, ['table'])
    if group_by is not None:
        return _function_by_group(_collaborative_filtering_train, table, group_by=group_by, **params)
    else:
        return _collaborative_filtering_train(table, **params)


def _collaborative_filtering_train(table, user_col , item_col, rating_col, N=10, k=5, based = 'item', mode='train', method = 'cosine', weighted = True, centered = True, targets = None, normalize = True):
    if based == 'item':
        normalize = False
    table_user_col = table[user_col]
    table_item_col = table[item_col]
    rating_col = table[rating_col]
    user_encoder = preprocessing.LabelEncoder()
    item_encoder = preprocessing.LabelEncoder()
    user_encoder.fit(table_user_col)
    item_encoder.fit(table_item_col)
    user_correspond = user_encoder.transform(table_user_col)
    item_correspond = item_encoder.transform(table_item_col)
    if based=='item':
        item_users = csr_matrix((rating_col,(item_correspond,user_correspond)))
        check_cen = csr_matrix((rating_col+1,(item_correspond,user_correspond)))
    else:
        item_users = csr_matrix((rating_col,(user_correspond,item_correspond)))
        check_cen = csr_matrix((rating_col+1,(user_correspond,item_correspond)))
    centered_ratings = item_users.copy()
    
    num_item, num_user = item_users.shape
    if centered:
        update_item = []
        update_user = []
        update_rating = []
        for item in range(num_item):
            index = 0
            sum = 0
            for user, rating in _nonzeros(check_cen, item):
                index += 1
                sum+= rating
            avg = sum / index -1
            for user, rating in _nonzeros(check_cen, item):
                update_item.append(item)
                update_user.append(user)
                update_rating.append(avg)
                
        centered_ratings -= csr_matrix((update_rating,(update_item,update_user)))
    if (method == 'adjusted' or normalize) and based == 'item':
        check_cen = check_cen.transpose().tocsr()
    if based == 'user':
        tmp = num_user
        num_user = num_item
        num_item = tmp
    user_avg = []
    if normalize:
        for user in range(num_user):
            index = 0
            sum = 0
            for user, rating in _nonzeros(check_cen, user):
                index += 1
                sum+= rating
            avg = sum / index
            user_avg.append(avg)
    if method == 'adjusted':
        update_item = []
        update_user = []
        update_rating = []
        for user in range(num_user):
            sum = 0
            for item, rating in _nonzeros(check_cen, user):
                sum+= rating
            avg = sum / num_item
            for item in range(num_item):
                update_item.append(item)
                update_user.append(user)
                update_rating.append(avg)
        if based=='item':
            centered_ratings -= csr_matrix((update_rating,(update_item,update_user)))
        else:
            centered_ratings -= csr_matrix((update_rating,(update_user,update_item)))
        method = 'cosine'     
    if based == 'user':
        tmp = num_user
        num_user = num_item
        num_item = tmp
        
    if method == 'cosine':
        similar_coeff = cosine_similarity(centered_ratings)
    elif method == 'pearson':
        result=[]
        for i in centered_ratings.toarray():
            result.append(i-np.average(i))
        similar_coeff = cosine_similarity(result)
    elif method == 'jaccard':
        similar_coeff = 1 - pairwise_distances(centered_ratings.toarray(), metric = "hamming")
    for item in range(num_item):
        similar_coeff[item][item] = -1
    if based== 'user':
        item_users = item_users.transpose().tocsr()

    if mode == 'Topn':
        if targets is None:
            targets = user_encoder.classes_
        if table_user_col.dtype in (np.floating,float,np.int,int,np.int64):
            targets = [float(i) for i in targets]
        targets_en = user_encoder.transform(targets)      
        Topn_result = []
        for user in targets_en:
            recommendations_corre = _recommend(user, item_users, similar_coeff, N, k, method, weighted, centered, based, normalize, user_avg)
            recommendations = []
            for (item,rating) in recommendations_corre:
                recommendations += [item_encoder.inverse_transform([item])[0],rating]
            Topn_result += [recommendations]
        Topn_result = pd.DataFrame(Topn_result)
        Topn_result = pd.concat([pd.DataFrame(targets), Topn_result], axis=1, ignore_index=True)
        column_names=['user_name']
        for i in range(int((Topn_result.shape[1]-1)/2)):
            column_names += ['item_top%d' %(i+1),'rating_top%d' %(i+1)]
        Topn_result.columns = column_names
        return {'out_table' : Topn_result}

    parameters = dict()
    parameters['Number of Neighbors'] = k
    parameters['Based'] = based
    if method == 'cosine':
        parameters['Similarity method'] = 'Cosine'
    elif method == 'jaccard':
        parameters['Similarity method'] = 'Jaccard'
    elif method == 'pearson':
        parameters['Similarity method'] = 'Pearson'
    else:
        parameters['Similarity method'] = 'Adjusted Cosine'
    parameters['Use Centered Mean'] = centered
    parameters['Use Weighted Rating'] = weighted
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ## Collaborative Filtering Result
    |
    | ### Parameters
    | {parameters} 
    |
    """.format(parameters=dict2MD(parameters))))
            
    model = _model_dict('collaborative filtering')
    model['weighted'] = weighted
    model['k'] = k
    model['similar_coeff'] = similar_coeff
    model['item_encoder'] = item_encoder
    model['user_encoder'] = user_encoder
    model['item_users'] = item_users
    model['user_col'] = user_col
    model['item_col'] = item_col
    model['based'] = based
    model['_repr_brtc_'] = rb.get()
    model['normalize'] = normalize
    model['user_avg'] = user_avg
    return{'model' : model}

def collaborative_filtering_recommend(table, group_by=None, **params):
    params = get_default_from_parameters_if_required(params,_collaborative_filtering_recommend)
    param_validation_check = [greater_than_or_equal_to(params, 1, 'N'),
                              greater_than_or_equal_to(params, 1, 'k')]
        
    validate(*param_validation_check)
    check_required_parameters(_collaborative_filtering_recommend, params, ['table'])
    if group_by is not None:
        return _function_by_group(_collaborative_filtering_recommend, table, group_by=group_by, **params)
    else:
        return _collaborative_filtering_recommend(table, **params)
    
def _collaborative_filtering_recommend(table, user_col , item_col, rating_col, N=10, k=5, based = 'item', mode='Topn', method = 'cosine', weighted = True, centered = True, targets = None, normalize = True):
    return _collaborative_filtering_train(table, user_col , item_col, rating_col, N, k, based, mode, method, weighted, centered, targets, normalize)

def collaborative_filtering_predict(table, model, **params):
    check_required_parameters(_collaborative_filtering_predict, params, ['table', 'model'])
    if '_grouped_data' in model:
        return _function_by_group(_collaborative_filtering_predict, table, model, **params)
    else:
        return _collaborative_filtering_predict(table, model, **params)  
    
def _collaborative_filtering_predict(table, model, prediction_col ='prediction'):
    normalize = model['normalize'] 
    user_avg = model['user_avg']
    weighted = model['weighted']
    k = model['k']
    similar_coeff = model['similar_coeff']
    item_encoder = model['item_encoder']
    user_encoder = model['user_encoder']
    item_users = model['item_users']
    array_item_users = item_users.toarray()
    user_items = item_users.transpose().tocsr()
    user_col = model['user_col']
    item_col = model['item_col']
    based = model['based']
    tmp_user = np.array(table[user_col])
    tmp_item = np.array(table[item_col])
    valid_indices = [i for i in range(len(tmp_user)) if tmp_user[i] in user_encoder.classes_ and tmp_item[i] in item_encoder.classes_]
    valid_user = [tmp_user[i] for i in valid_indices]
    valid_item = [tmp_item[i] for i in valid_indices]
    encoded_user_col = user_encoder.transform(valid_user)
    encoded_item_col = item_encoder.transform(valid_item)
    result = []
    check_num_total = 0
    check_num_valid = 0
    while check_num_total < len(tmp_user):
        if check_num_total not in valid_indices:
            predict = None
        else:
            if based == 'item':
                if array_item_users[encoded_item_col[check_num_valid]][encoded_user_col[check_num_valid]] != 0:
                    predict = array_item_users[encoded_item_col[check_num_valid]][encoded_user_col[check_num_valid]]
                else:
                    predict = _predict(user_items, similar_coeff[encoded_item_col[check_num_valid]], encoded_user_col[check_num_valid], k, weighted, normalize, user_avg, None)
            else:
                if array_item_users[encoded_item_col[check_num_valid]][encoded_user_col[check_num_valid]] != 0:
                    predict = array_item_users[encoded_item_col[check_num_valid]][encoded_user_col[check_num_valid]]
                else:
                    predict = _predict(item_users, similar_coeff[encoded_user_col[check_num_valid]], encoded_item_col[check_num_valid], k, weighted, normalize, user_avg, user_avg[encoded_user_col[check_num_valid]])
            check_num_valid += 1
        result += [[tmp_user[check_num_total], tmp_item[check_num_total],predict]]
        check_num_total += 1
    result = pd.DataFrame(result)
    result.columns = [user_col, item_col, prediction_col]
    return {'out_table' : result}