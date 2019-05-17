"""
    Copyright 2019 Samsung SDS
    
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    
        http://www.apache.org/licenses/LICENSE-2.0
    
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
"""

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
from multiprocessing import Pool

def apply_list(args):
    df, func, kwargs = args
    kwargs['users']=df
    return func(**kwargs)



def apply_by_multiprocessing_list_to_list(df, func, **kwargs):
    workers = kwargs.pop('workers')
    pool = Pool(processes=workers)
    result = pool.map(apply_list, [(d, func, kwargs) for d in np.array_split(df, workers)])
    pool.close()
    return result

def _predict(ratings, similar_coeff, target, k, weighted, normalize, user_avg, target_user_avg, filter_minus):
    new_ratings = []
    if normalize:
        new_ratings = [[similar_coeff[i[0]],i[1]-user_avg[i[0]]] for i in _nonzeros(ratings,target)]
    else:
        new_ratings = [[similar_coeff[i[0]],i[1]] for i in _nonzeros(ratings,target)]
    best =  sorted(enumerate(new_ratings), key=lambda x: -x[1][0])
    if filter_minus:
        modi_best = [i for i in best if i[1][0] > 0]
    else:
        modi_best = best
    if len(modi_best) < k:
        return np.nan
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


def _recommend(target_user, item_users, similar_coeff, N, k, method, weighted, centered, based, normalize, user_avg, filter, filter_minus, maintain_already_scored):
    
        # calculate the top N items, removing the users own liked items from the results
    user_items = item_users.transpose().tocsr()
    if filter:
        liked = set(user_items[target_user].indices)
    else:
        liked = set()
    scores = []
    for target_item in range(user_items.shape[1]):
        if based == 'item':
            if maintain_already_scored and item_users[target_item,target_user] != 0:
                scores += [item_users[target_item,target_user]]
            else:
                scores += [_predict(user_items, similar_coeff[target_item], target_user, k, weighted, normalize, user_avg, None, filter_minus)]

        else:
            if maintain_already_scored and item_users[target_item,target_user] != 0:
                scores += [item_users[target_item,target_user]]
            elif normalize:
                scores += [_predict(item_users, similar_coeff[target_user], target_item, k, weighted, normalize, user_avg, user_avg[target_user], filter_minus)]
            else:
                scores += [_predict(item_users, similar_coeff[target_user], target_item, k, weighted, normalize, user_avg, None, filter_minus)]
    best = sorted(enumerate(scores), key=lambda x: (~pd.isnull(x[1]), x[1]), reverse=True)
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


def _collaborative_filtering_train(table, user_col , item_col, rating_col, N=10, filter=True, k=5, based = 'item', mode='train', method = 'cosine', weighted = True, centered = True, targets = None, normalize = True, workers = 1, filter_minus = False, maintain_already_scored = True):
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
    if based== 'user':
        item_users = item_users.transpose().tocsr()

    if mode == 'Topn':
        if targets is None:
            targets = user_encoder.classes_
        if table_user_col.dtype in (np.floating,float,np.int,int,np.int64):
            targets = [float(i) for i in targets]
        targets_en = user_encoder.transform(targets)      
        Topn_result = []
        if workers == 1:
            for user in targets_en:
                recommendations_corre = _recommend(user, item_users, similar_coeff, N, k, method, weighted, centered, based, normalize, user_avg, filter, filter_minus, maintain_already_scored)
                recommendations = []
                for (item,rating) in recommendations_corre:
                    recommendations += [item_encoder.inverse_transform([item])[0],rating]
                Topn_result += [recommendations]
        else:
            Topn_result_tmp = apply_by_multiprocessing_list_to_list(targets_en, _recommend_multi, item_users = item_users, similar_coeff = similar_coeff, N = N, k = k, method = method, weighted = weighted, centered = centered, based = based, normalize = normalize, user_avg = user_avg, item_encoder = item_encoder, workers = workers, filter_minus = filter_minus, maintain_already_scored = maintain_already_scored)
            Topn_result=[]
            for i in range(workers):
                Topn_result += Topn_result_tmp[i]
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
    
def _recommend_multi(users, item_users, similar_coeff, N, k, method, weighted, centered, based, normalize, user_avg, item_encoder, filter_minus, maintain_already_scored):
    Topn_result = []
    for user in users:
        recommendations_corre = _recommend(user, item_users, similar_coeff, N, k, method, weighted, centered, based, normalize, user_avg, filter, filter_minus, maintain_already_scored)
        recommendations = []
        for (item,rating) in recommendations_corre:
            recommendations += [item_encoder.inverse_transform([item])[0],rating]
        Topn_result.append(recommendations)
    return Topn_result

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
    
def _collaborative_filtering_recommend(table, user_col , item_col, rating_col, N=10, filter=True, k=5, based = 'item', mode='Topn', method = 'cosine', weighted = True, centered = True, targets = None, normalize = True, workers = 1, filter_minus = False, maintain_already_scored = True):
    return _collaborative_filtering_train(table, user_col , item_col, rating_col, N, filter, k, based, mode, method, weighted, centered, targets, normalize, workers, filter_minus, maintain_already_scored)

def collaborative_filtering_predict(table, model, **params):
    check_required_parameters(_collaborative_filtering_predict, params, ['table', 'model'])
    if '_grouped_data' in model:
        return _function_by_group(_collaborative_filtering_predict, table, model, **params)
    else:
        return _collaborative_filtering_predict(table, model, **params)  
    
def _collaborative_filtering_predict(table, model, prediction_col ='prediction', filter_minus=False, maintain_already_scored=True):
    normalize = model['normalize'] 
    user_avg = model['user_avg']
    weighted = model['weighted']
    k = model['k']
    similar_coeff = model['similar_coeff']
    item_encoder = model['item_encoder']
    user_encoder = model['user_encoder']
    item_users = model['item_users']
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
    result = [None]*len(tmp_user)
    for i in range(len(valid_indices)):
        if based == 'item':
            if maintain_already_scored and item_users[encoded_item_col[i],encoded_user_col[i]] != 0:
                predict = item_users[encoded_item_col[i],encoded_user_col[i]]
            else:
                predict = _predict(user_items, similar_coeff[encoded_item_col[i]], encoded_user_col[i], k, weighted, normalize, user_avg, None, filter_minus)
        else:
            if maintain_already_scored and item_users[encoded_item_col[i],encoded_user_col[i]] != 0:
                predict = item_users[encoded_item_col[i],encoded_user_col[i]]
            else:
                if normalize:
                    predict = _predict(item_users, similar_coeff[encoded_user_col[i]], encoded_user_col[i], k, weighted, normalize, user_avg, user_avg[encoded_user_col[i]], filter_minus)
                else:
                    predict = _predict(item_users, similar_coeff[encoded_user_col[i]], encoded_user_col[i], k, weighted, normalize, user_avg, None, filter_minus)

        result[valid_indices[i]] = predict
    result = pd.DataFrame(result,columns=[prediction_col])
    result = pd.concat([table[user_col],table[item_col],result],axis=1)
    return {'out_table' : result}
