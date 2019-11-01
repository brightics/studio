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

import statsmodels.api as sm
from brightics.common.repr import BrtcReprBuilder, strip_margin
from brightics.function.utils import _model_dict
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.common.validation import raise_runtime_error
from brightics.common.classify_input_type import check_col_type

def glm_train(table, group_by=None, **params):
    check_required_parameters(_glm_train, params, ['table'])
    if group_by is not None:
        grouped_model = _function_by_group(_glm_train, table, group_by=group_by, **params)
        return grouped_model
    else:
        return _glm_train(table, **params)


def _glm_train(table, feature_cols, label_col, family="Gaussian", link="auto", fit_intercept=True):
    feature_names, features = check_col_type(table,feature_cols)
    label = table[label_col]

    if label_col in feature_cols:
        raise_runtime_error("%s is duplicated." % label_col)
    
    if link == "auto":
        sm_link = None
    elif link == "ident":
        sm_link = sm.families.links.identity
    elif link == "log":
        sm_link = sm.families.links.log
    elif link == "logit":
        sm_link = sm.families.links.logit
    elif link == "probit":
        sm_link = sm.families.links.probit
    elif link == "cloglog":
        sm_link = sm.families.links.CLogLog
    elif link == "pow":
        sm_link = sm.families.links.Power
    elif link == "nbinom":
        sm_link = sm.families.links.binom 
        
    if family == "Gaussian": 
        sm_family = sm.families.Gaussian(sm_link)
    elif family == "inv_Gaussian":
        sm_family = sm.families.InverseGaussian(sm_link)
    elif family == "binomial":
        sm_family = sm.families.Binomial(sm_link)
    elif family == "Poisson":
        sm_family = sm.families.Poisson(sm_link)
    elif family == "neg_binomial":
        sm_family = sm.families.NegativeBinomial(sm_link)
    elif family == "gamma":
        sm_family = sm.families.Gamma(sm_link)
    elif family == "Tweedie":
        sm_family = sm.families.Tweedie(sm_link)


    if fit_intercept == True:
        glm_model = sm.GLM(label, sm.add_constant(features), family=sm_family).fit()
    else:
        glm_model = sm.GLM(label, features, family=sm_family).fit()
    summary = glm_model.summary().as_html()

    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ## GLM Result
    | ### Summary
    |
    """))
    rb.addHTML(summary)

    model = _model_dict('glm_model')
    model['features'] = feature_cols
    model['label'] = label_col
    model['family'] = family
    model['link'] = link
    model['coefficients'] = glm_model.params.values
    model['aic'] = glm_model.aic
    model['bic'] = glm_model.bic
    model['tvalues'] = glm_model.tvalues.values
    model['pvalues'] = glm_model.pvalues.values
    model['fit_intercept'] = fit_intercept
    glm_model.remove_data()
    model['glm_model'] = glm_model
    model['_repr_brtc_'] = rb.get()

    return {'model' : model}


def glm_predict(table, model, **params):
    check_required_parameters(_glm_predict, params, ['table', 'model'])
    if '_grouped_data' in model:
        return _function_by_group(_glm_predict, table, model, **params)
    else:
        return _glm_predict(table, model, **params)       


def _glm_predict(table, model, prediction_col='prediction'):
    feature_cols = model['features']
    feature_names, features = check_col_type(table,feature_cols)

    fit_intercept = model['fit_intercept']
    glm_model = model['glm_model']

    if fit_intercept == True:
        prediction = glm_model.predict(sm.add_constant(features))
    else:
        prediction = glm_model.predict(features)

    result = table.copy()
    result[prediction_col] = prediction
    
    return {'out_table' : result}
