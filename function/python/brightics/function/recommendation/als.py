import numpy as np
import scipy.sparse
import itertools
from sklearn import preprocessing
from scipy.sparse import csr_matrix
import pandas as pd
from brightics.common.repr import BrtcReprBuilder
from brightics.common.repr import strip_margin
from brightics.common.repr import plt2MD
from brightics.common.repr import pandasDF2MD
from brightics.common.repr import dict2MD
from brightics.function.utils import _model_dict
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.common.validation import validate
from brightics.common.validation import greater_than_or_equal_to
from brightics.common.utils import get_default_from_parameters_if_required
from multiprocessing import Pool

#--------------------------------------------------------------------------------------------------------
"""
The MIT License (MIT)

Copyright (c) 2016 Ben Frederickson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
"""

class MatrixFactorizationBase():
    """ MatrixFactorizationBase contains common functionality for recommendation models.
    Attributes
    ----------
    item_factors : ndarray
        Array of latent factors for each item in the training set
    user_factors : ndarray
        Array of latent factors for each user in the training set
     """
    def __init__(self):
        # learned parameters
        self.item_factors = None
        self.user_factors = None
    
    def predict(self, userid, itemid):
        user = self.user_factors[userid]
        score = self.item_factors[itemid].dot(user)
        return score
    
    def recommend(self, userid, user_items,
                  N=10, filter_already_liked_items=True, filter_items=None):
        user = self.user_factors[userid]
    

        # calculate the top N items, removing the users own liked items from the results
        if filter_already_liked_items is True:
            liked = set(user_items[userid].indices)
        else:
            liked = set()
        scores = self.item_factors.dot(user)
        if filter_items:
            liked.update(filter_items)
        count = N + len(liked)
        if count < len(scores):
            ids = np.argpartition(scores, -count)[-count:]
            best = sorted(zip(ids, scores[ids]), key=lambda x: -x[1])
        else:
            best = sorted(enumerate(scores), key=lambda x: -x[1])
        return list(itertools.islice((rec for rec in best if rec[0] not in liked), N))

def nonzeros(m, row):
    """ returns the non zeroes of a row in csr_matrix """
    for index in range(m.indptr[row], m.indptr[row+1]):
        yield m.indices[index], m.data[index]



class AlternatingLeastSquares(MatrixFactorizationBase):

    """ Alternating Least Squares
    A Recommendation Model based off the algorithms described in the paper 'Collaborative
    Filtering for Implicit Feedback Datasets' with performance optimizations described in
    'Applications of the Conjugate Gradient Method for Implicit Feedback Collaborative
    Filtering.'
    Parameters
    ----------
    factors : int, optional
        The number of latent factors to compute
    regularization : float, optional
        The regularization factor to use
    iterations : int, optional
        The number of ALS iterations to use when fitting data
    Attributes
    ----------
    item_factors : ndarray
        Array of latent factors for each item in the training set
    user_factors : ndarray
        Array of latent factors for each user in the training set
    """

    def __init__(self, implicit=False, factors=100, regularization=0.01, alpha=1,
                 iterations=15, seed = None):
        
        self.item_factors = None
        self.user_factors = None

        # parameters on how to factorize
        self.factors = factors
        self.regularization = regularization
        self.alpha = alpha

        # options on how to fit the model
        self.seed = seed
        self.implicit = implicit
        self.iterations = iterations


    def fit(self, item_users):
        """ Factorizes the item_users matrix.
        After calling this method, the members 'user_factors' and 'item_factors' will be
        initialized with a latent factor model of the input data.
        The item_users matrix does double duty here. It defines which items are liked by which
        users (P_iu in the original paper), as well as how much confidence we have that the user
        liked the item (C_iu).
        The negative items are implicitly defined: This code assumes that non-zero items in the
        item_users matrix means that the user liked the item. The negatives are left unset in this
        sparse matrix: the library will assume that means Piu = 0 and Riu = 1 for all these items.
        Parameters
        ----------
        item_users: csr_matrix
            Matrix of confidences for the liked items. This matrix should be a csr_matrix where
            the rows of the matrix are the item, the columns are the users that liked that item,
            and the value is the confidence that the user liked the item.
        """
        Riu = item_users
        if not isinstance(Riu, scipy.sparse.csr_matrix):
            Riu = Riu.tocsr()
        Rui = Riu.T.tocsr()
        items, users = Riu.shape
        

        # Initialize the variables randomly if they haven't already been set
        if self.user_factors is None:
            np.random.seed(self.seed) ; self.user_factors =  np.random.rand(users, self.factors)*0.0001
        if self.item_factors is None:
            np.random.seed(self.seed) ; self.item_factors = np.random.rand(items, self.factors)*0.0001
        else:
            Rui_array = None
            Riu_array = None

        for iteration in range(self.iterations):
            least_squares(self.implicit, self.alpha, Rui, self.user_factors, self.item_factors, self.regularization)
            least_squares(self.implicit, self.alpha, Riu, self.item_factors, self.user_factors, self.regularization)



def least_squares(implicit, alpha, Rui, X, Y, regularization):
    users, n_factors = X.shape
    YtY = Y.T.dot(Y)
    for u in range(users):
        if implicit:
            A = YtY + regularization * np.eye(n_factors)
            b = np.zeros(n_factors)
            for i, rui in nonzeros(Rui, u):
                factor = Y[i]
                cui = 1+alpha*rui
                b += cui * factor         
                A += (cui - 1) *np.outer(factor,factor)

        else:
            A = regularization * np.eye(n_factors)
            b = np.zeros(n_factors)
            for i, rui in nonzeros(Rui, u):
                factor = Y[i]
                if rui != -1:
                    b += rui * factor
                    A += np.outer(factor,factor)
                    
        X[u] = np.linalg.solve(A, b)




#------------------------------------------------------------------------------------------------

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

def als_train(table, group_by=None, **params):
    check_required_parameters(_als_train, params, ['table'])
    params = get_default_from_parameters_if_required(params,_als_train)
    param_validation_check = [greater_than_or_equal_to(params, 1, 'number'),
                              greater_than_or_equal_to(params, 1, 'iterations'),
                              greater_than_or_equal_to(params, 0.1, 'reg_param'),
                              greater_than_or_equal_to(params, 1, 'rank'),
                              greater_than_or_equal_to(params, 0, 'alpha'),
                              greater_than_or_equal_to(params, 0, 'seed')]
        
    validate(*param_validation_check)
    if group_by is not None:
        return _function_by_group(_als_train, table, group_by=group_by, **params)
    else:
        return _als_train(table, **params)


def _als_train(table, user_col, item_col, rating_col, mode = 'train', number=10, filter = True, implicit = False, iterations = 10, reg_param = 0.1, rank = 10, alpha = 1.0, seed = None, targets = None, workers = 1):
    table_user_col = table[user_col]
    table_item_col = table[item_col]
    rating_col = table[rating_col]
    rating_col = np.where(rating_col == 0, -1, rating_col)
    user_encoder = preprocessing.LabelEncoder()
    item_encoder = preprocessing.LabelEncoder()
    user_encoder.fit(table_user_col)
    item_encoder.fit(table_item_col)
    user_correspond = user_encoder.transform(table_user_col)
    item_correspond = item_encoder.transform(table_item_col)       
    item_users = csr_matrix((rating_col,(item_correspond,user_correspond)))
    als_model = AlternatingLeastSquares(factors = rank,implicit = implicit,iterations = iterations, regularization = reg_param, alpha = alpha, seed = seed)
    als_model.fit(item_users)
    tmp_col = list(als_model.user_factors)
    for i in range(len(tmp_col)):
        tmp_col[i] = list(tmp_col[i])
    user_factors = pd.DataFrame(user_encoder.classes_, columns = [user_col])
    user_factors['features'] = tmp_col
    tmp_col = list(als_model.item_factors)
    for i in range(len(tmp_col)):
        tmp_col[i] = list(tmp_col[i])
    item_factors = pd.DataFrame(item_encoder.classes_, columns = [item_col])
    item_factors['features'] = tmp_col
    if mode == 'Topn':
        if targets is None:
            targets = user_encoder.classes_
        if table_user_col.dtype in (np.floating,float,np.int,int,np.int64):
            targets = [float(i) for i in targets]
        targets_en = user_encoder.transform(targets)
        user_items = item_users.T.tocsr()
        Topn_result = []
        if workers == 1:
            for user in targets_en:
                recommendations_corre = als_model.recommend(user, user_items, number, filter_already_liked_items= filter)
                recommendations = []
                for (item,rating) in recommendations_corre:
                    recommendations += [item_encoder.inverse_transform([item])[0],rating]
                Topn_result += [recommendations]
        else:
            Topn_result_tmp = apply_by_multiprocessing_list_to_list(targets_en, _recommend_multi, user_items = user_items, number = number, item_encoder = item_encoder, als_model = als_model, workers = workers, filter = filter)
            Topn_result=[]
            for i in range(workers):
                Topn_result += Topn_result_tmp[i]
        Topn_result = pd.DataFrame(Topn_result)
        Topn_result = pd.concat([pd.DataFrame(targets), Topn_result], axis=1, ignore_index=True)
        column_names=['user']
        for i in range(number):
            column_names += ['item_top%d' %(i+1),'rating_top%d' %(i+1)]
        Topn_result.columns = column_names
        return {'out_table' : Topn_result}
        
    parameters = dict()
    parameters['Iterations'] = iterations
    parameters['Reg Param'] = reg_param
    parameters['Seed'] = seed
    parameters['Rank'] = rank
    if implicit:
        parameters['alpha'] = alpha
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ## ALS Train Result
    |
    | ### Parameters
    | {parameters} 
    | ### Item Factors
    | {item_factors}
    | ### User Factors
    | {user_factors}
    |
    """.format(item_factors=pandasDF2MD(item_factors, num_rows = 100), user_factors=pandasDF2MD(user_factors, num_rows = 100), parameters=dict2MD(parameters))))

    model = _model_dict('ALS')
    model['als_model'] = als_model
    model['item_encoder'] = item_encoder
    model['user_encoder'] = user_encoder
    model['user_col'] = user_col
    model['item_col'] = item_col
    model['user_factors'] = user_factors
    model['item_factors'] = item_factors
    model['_repr_brtc_'] = rb.get()
    return{'model' : model}
    
def _recommend_multi(users, user_items, number, item_encoder, als_model, filter):
    Topn_result = []
    for user in users:
        recommendations_corre = als_model.recommend(user, user_items, number, filter_already_liked_items= filter)
        recommendations = []
        for (item,rating) in recommendations_corre:
            recommendations += [item_encoder.inverse_transform([item])[0],rating]
        Topn_result.append(recommendations)
    return Topn_result

def als_recommend(table, group_by=None, **params):
    check_required_parameters(_als_recommend, params, ['table'])
    params = get_default_from_parameters_if_required(params,_als_recommend)
    param_validation_check = [greater_than_or_equal_to(params, 1, 'number'),
                              greater_than_or_equal_to(params, 1, 'iterations'),
                              greater_than_or_equal_to(params, 0.1, 'reg_param'),
                              greater_than_or_equal_to(params, 1, 'rank'),
                              greater_than_or_equal_to(params, 0, 'alpha'),
                              greater_than_or_equal_to(params, 0, 'seed')]
        
    validate(*param_validation_check)
    if group_by is not None:
        return _function_by_group(_als_recommend, table, group_by=group_by, **params)
    else:
        return _als_recommend(table, **params)


def _als_recommend(table, user_col, item_col, rating_col, mode = 'Topn', number=10, filter=True, implicit = False, iterations = 10, reg_param = 0.1, rank = 10, alpha = 1.0, seed = None, targets = None, workers = 1):
    return _als_train(table, user_col, item_col, rating_col, mode, number, filter, implicit, iterations, reg_param, rank, alpha, seed, targets, workers)

def als_predict(table, model, **params):
    check_required_parameters(_als_predict, params, ['table', 'model'])
    if '_grouped_data' in model:
        return _function_by_group(_als_predict, table, model, **params)
    else:
        return _als_predict(table, model, **params)  
    
def _als_predict(table, model, prediction_col = 'prediction'):
    als_model = model['als_model']
    item_encoder = model['item_encoder']
    user_encoder = model['user_encoder']
    user_col = model['user_col']
    item_col = model['item_col']
    tmp_user = np.array(table[user_col])
    tmp_item = np.array(table[item_col])
    valid_indices = [i for i in range(len(tmp_user)) if tmp_user[i] in user_encoder.classes_ and tmp_item[i] in item_encoder.classes_]
    valid_user = [tmp_user[i] for i in valid_indices]
    valid_item = [tmp_item[i] for i in valid_indices]
    encoded_user_col = user_encoder.transform(valid_user)
    encoded_item_col = item_encoder.transform(valid_item)
    result = [None]*len(tmp_user)
    for i in range(len(valid_indices)):
        predict = als_model.predict(encoded_user_col[i], encoded_item_col[i])
        result[valid_indices[i]] = predict
    result = pd.DataFrame(result,columns=[prediction_col])
    result = pd.concat([table[user_col],table[item_col],result],axis=1)
    return {'out_table' : result}