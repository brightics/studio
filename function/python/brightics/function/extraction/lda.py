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


from sklearn.discriminant_analysis import LinearDiscriminantAnalysis as LDA
import pandas as pd
import matplotlib.pyplot as plt
from brightics.common.repr import BrtcReprBuilder, strip_margin, pandasDF2MD, plt2MD, dict2MD
from brightics.function.utils import _model_dict
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.common.validation import validate, greater_than_or_equal_to, less_than_or_equal_to
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.exception import BrighticsFunctionException


def lda(table, group_by=None, **params):
    check_required_parameters(_lda, params, ['table'])
    
    params = get_default_from_parameters_if_required(params, _lda)
    if (params['solver'] == 'svd'):
        if (params['shrinkage'] == 'float'):
            param_validation_check = [greater_than_or_equal_to(params, 0, 'tol'),
                                      greater_than_or_equal_to(params, 1, 'n_components'),
                                      greater_than_or_equal_to(params, 0, 'shrinkage_value'),
                                      less_than_or_equal_to(params, 1, 'shrinkage_value')]
        else:
            param_validation_check = [greater_than_or_equal_to(params, 0, 'tol'),
                                      greater_than_or_equal_to(params, 1, 'n_components')]
    else:
        if (params['shrinkage'] == 'float'):
            param_validation_check = [greater_than_or_equal_to(params, 1, 'n_components'),
                                      greater_than_or_equal_to(params, 0, 'shrinkage_value'),
                                      less_than_or_equal_to(params, 1, 'shrinkage_value')]
        else:
            param_validation_check = [greater_than_or_equal_to(params, 1, 'n_components')]
    validate(*param_validation_check)
    
    if group_by is not None:
        label_col = ""
        for param in params:
            if param == "label_col":
                label_col = params[param]
        for group in group_by:
            if group == label_col:
                elist = []
                elist.append({'0100': "Group by column should be different from label column"})
                print(elist)
                raise BrighticsFunctionException.from_errors(elist)
        grouped_model = _function_by_group(_lda, table, group_by=group_by, **params)
        return grouped_model
    else:
        return _lda(table, **params)
    
    
def _lda(table, feature_cols, label_col, new_column_name='projected_', solver='svd', shrinkage=None, shrinkage_value=None,
         priors=None, n_components=None, store_covariance=False,
         tol=1.0e-4):

    num_feature_cols = len(feature_cols)
    if n_components is not None and n_components >= num_feature_cols - 1:
        n_components = num_feature_cols - 2
    if n_components is None or n_components < 1:
        n_components = 1

    #validate(greater_than_or_equal_to(n_components, 1, 'n_components'))

    if solver == 'svd':
        shrinkage = None
    else:
        if shrinkage is not None and shrinkage == 'None':
            shrinkage = None
        if shrinkage is not None and shrinkage == 'float':
            if shrinkage_value is not None and 0.0 <= float(shrinkage_value) <= 1.0:
                shrinkage = float(shrinkage_value)
    store_covariance = _string2boolean(store_covariance)
    lda = LDA(solver, shrinkage, priors, n_components, store_covariance, tol)
    lda_model = lda.fit(table[feature_cols], table[label_col])

    column_names = []
    for i in range(0, n_components):
        column_names.append(new_column_name + str(i))

    # The output model does not support transform function for solver = 'lsqr'
    if solver != 'lsqr':
        lda_result = lda_model.transform(table[feature_cols])
    else:
        lda_result = None

    if lda_result is not None:
        out_df = pd.DataFrame(data=lda_result[:, :n_components], columns=[column_names])

        out_df = pd.concat([table.reset_index(drop=True), out_df], axis=1)
        out_df.columns = table.columns.values.tolist() + column_names
    else:
        out_df = None

    model = _model_dict('lda')
    res_coef = lda_model.coef_ if hasattr(lda_model, 'coef_') else None
    # res_components_df = pd.DataFrame(data=res_components[:num_feature_cols], columns=[input_cols])
    res_intercept = lda_model.intercept_ if hasattr(lda_model, 'intercept_') else None
    res_covariance = lda_model.covariance_ if hasattr(lda_model, 'covariance_') else None
    res_explained_variance_ratio = lda_model.explained_variance_ratio_ if \
        hasattr(lda_model, 'explained_variance_ratio_') else None
    res_mean = lda_model.means_ if hasattr(lda_model, 'means_') else None
    res_priors = lda_model.priors_ if hasattr(lda_model, 'priors_') else None
    res_scalings = lda_model.scalings_ if hasattr(lda_model, 'scalings_') else None
    res_xbar = lda_model.xbar_ if hasattr(lda_model, 'xbar_') else None
    res_classes = lda_model.classes_ if hasattr(lda_model, 'classes_') else None
    res_get_param = lda_model.get_params()

    # visualization
    plt.figure()
    fig_scree = _screeplot(res_explained_variance_ratio, n_components)

    table_explained_variance_ratio = pd.DataFrame(res_explained_variance_ratio, columns=['explained_variance_ratio'])
    table_explained_variance_ratio['cum_explained_variance_ratio'] = res_explained_variance_ratio.cumsum()

    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
        | ### Explained Variance Ratio
        | {fig_scree}
        | {table_explained_variance_ratio}    
        |
        | ### Parameters
        | {parameter1}
        """.format(fig_scree=fig_scree,
                   table_explained_variance_ratio=pandasDF2MD(table_explained_variance_ratio),
                   parameter1=dict2MD(res_get_param)
                   )))

    model['coef'] = res_coef
    model['n_components'] = n_components
    model['intercept'] = res_intercept
    model['covariance'] = res_covariance
    model['explained_variance_ratio'] = res_explained_variance_ratio
    model['mean'] = res_mean
    model['priors'] = res_priors
    model['scalings'] = res_scalings
    model['xbar'] = res_xbar
    model['parameters'] = res_get_param
    model['classes'] = res_classes
    model['_repr_brtc_'] = rb.get()
    model['lda_model'] = lda_model
    model['input_cols'] = feature_cols

    return {'out_table': out_df, 'model': model}


def _screeplot(explained_variance_ratio, n_components, ax=None):
    if ax is None:
        ax = plt.gca()

    n_components_range = range(1, len(explained_variance_ratio) + 1)
    cum_explained_variance_ratio = explained_variance_ratio.cumsum()
    plt.xticks(n_components_range, n_components_range)

    #ax = ax.twinx()
    ax.plot(n_components_range, cum_explained_variance_ratio, 'x-')
    ax.set_ylim([0, 1.05])
    ax.set_ylabel('Cumulative Explained Variance Ratio')
    ax.text(n_components, cum_explained_variance_ratio[n_components - 1] - 0.05,
             '%0.4f' % cum_explained_variance_ratio[n_components - 1], va='center', ha='center')
    fig_scree = plt2MD(plt)
    plt.clf()
    return fig_scree


def lda_model(table, model, **params):
    check_required_parameters(_lda_model, params, ['table', 'model'])
    if '_grouped_data' in model:
        return _function_by_group(_lda_model, table, model, **params)
    else:
        return _lda_model(table, model, **params)
    

def _lda_model(table, model, new_column_name='projected_', prediction_col='prediction'):
    new_col_names = []
    for i in range(0, model['n_components']):
        new_col_names.append(new_column_name + str(i))
    lda_result = model['lda_model'].transform(table[model['input_cols']])
    out_table = table.copy()
    df = pd.DataFrame(data=lda_result, columns=new_col_names)
    out_table[new_col_names] = df[new_col_names]
    out_table[prediction_col] = model['lda_model'].predict(table[model['input_cols']])
    return {'out_table': out_table}


def _string2boolean(in_str=None):
    if in_str is None:
        return None
    else:
        if in_str == 'False':
            return False
        else:
            return True
