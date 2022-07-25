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
from sklearn.base import BaseEstimator, RegressorMixin
from brightics.common.repr import BrtcReprBuilder, strip_margin
from brightics.function.utils import _model_dict
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.common.validation import raise_runtime_error
from brightics.common.classify_input_type import check_col_type


class GLMScikitLearnWrapper(BaseEstimator, RegressorMixin):
    # Wrapped Statsmodels GLM model as a Scikit model class for grid search CV
    def __init__(self, fit_intercept=True, family="Gaussian", link="auto"):
        self.GLM = sm.GLM
        self.fit_intercept = fit_intercept
        self.family = family
        self.link = link

        if link == "auto":
            self.sm_link = None
        elif link == "ident":
            self.sm_link = sm.families.links.identity
        elif link == "log":
            self.sm_link = sm.families.links.log
        elif link == "logit":
            self.sm_link = sm.families.links.logit
        elif link == "probit":
            self.sm_link = sm.families.links.probit
        elif link == "cloglog":
            self.sm_link = sm.families.links.CLogLog
        elif link == "pow":
            self.sm_link = sm.families.links.Power
        elif link == "nbinom":
            self.sm_link = sm.families.links.binom
        else:
            raise ValueError("{} is not a supported link type.".format(link))

        if family == "Gaussian":
            self.sm_family = sm.families.Gaussian(self.sm_link)
        elif family == "inv_Gaussian":
            self.sm_family = sm.families.InverseGaussian(self.sm_link)
        elif family == "binomial":
            self.sm_family = sm.families.Binomial(self.sm_link)
        elif family == "Poisson":
            self.sm_family = sm.families.Poisson(self.sm_link)
        elif family == "neg_binomial":
            self.sm_family = sm.families.NegativeBinomial(self.sm_link)
        elif family == "gamma":
            self.sm_family = sm.families.Gamma(self.sm_link)
        elif family == "Tweedie":
            self.sm_family = sm.families.Tweedie(self.sm_link)
        else:
            raise ValueError("{} is not a supported family type.".format(family))

    def add_constant_if_fit_intercept(self, X):
        if self.fit_intercept:
            X = sm.add_constant(X)
        return X

    def fit(self, X, y):
        self.model_ = self.GLM(y, self.add_constant_if_fit_intercept(X), family=self.sm_family)
        self.results_ = self.model_.fit()
        return self

    def predict(self, X):
        return self.results_.predict(self.add_constant_if_fit_intercept(X))


def glm_train(table, group_by=None, **params):
    check_required_parameters(_glm_train, params, ['table'])
    if group_by is not None:
        grouped_model = _function_by_group(_glm_train, table, group_by=group_by, **params)
        return grouped_model
    else:
        return _glm_train(table, **params)


def preprocess_(feature_cols, label_col):
    if label_col in feature_cols:
        raise_runtime_error("%s is duplicated." % label_col)
    preprocess_result = {'estimator_class': GLMScikitLearnWrapper,
                         'estimator_params': ['fit_intercept', 'family', 'link']}
    return preprocess_result


def postprocess_(regressor):
    summary = regressor.results_.summary().as_html()
    postprocess_result = {'update_md': {'Summary': (summary, 'html')},
                          'type': 'glm_model'}
    return postprocess_result


def _glm_train(table, feature_cols, label_col, family="Gaussian", link="auto", fit_intercept=True):
    feature_names, features = check_col_type(table,feature_cols)
    label = table[label_col]

    preprocess_(feature_cols, label_col)

    glm_sklearn_model = GLMScikitLearnWrapper(fit_intercept=fit_intercept, family=family, link=link)
    glm_sklearn_model.fit(features, label)
    glm_model = glm_sklearn_model.results_

    postprocess_result = postprocess_(glm_sklearn_model)
    summary = postprocess_result['update_md']['Summary']

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
    model['regressor'] = glm_sklearn_model
    model['_repr_brtc_'] = rb.get()
    model['feature_cols'] = feature_cols

    return {'model': model}


def glm_predict(table, model, **params):
    check_required_parameters(_glm_predict, params, ['table', 'model'])
    if '_grouped_data' in model:
        return _function_by_group(_glm_predict, table, model, **params)
    else:
        return _glm_predict(table, model, **params)       


def _glm_predict(table, model, prediction_col='prediction'):
    if 'features' in model:
        feature_cols = model['features']
    else:  # model from Grid Search CV
        feature_cols = model['feature_cols']
    feature_names, features = check_col_type(table,feature_cols)

    if 'glm_model' in model:
        fit_intercept = model['fit_intercept']
        glm_model = model['glm_model']
        if fit_intercept:
            prediction = glm_model.predict(sm.add_constant(features))
        else:
            prediction = glm_model.predict(features)
    else:  # model from Grid Search CV
        glm_sklearn_model = model['regressor']
        prediction = glm_sklearn_model.predict(features)

    result = table.copy()
    result[prediction_col] = prediction
    
    return {'out_table': result}
