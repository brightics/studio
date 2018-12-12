import statsmodels.api as sm
from brightics.common.repr import BrtcReprBuilder, strip_margin
from brightics.function.utils import _model_dict
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.function.validation import raise_runtime_error


def glm_train(table, group_by=None, **params):
    check_required_parameters(_glm_train, params, ['table'])
    if group_by is not None:
        grouped_model = _function_by_group(_glm_train, table, group_by=group_by, **params)
        grouped_model['model']['_grouped_key'] = group_by 
        return grouped_model
    else:
        return _glm_train(table, **params)


def _glm_train(table, feature_cols, label_col, family="Gaussian", link="ident", fit_intercept=True):
    features = table[feature_cols]
    label = table[label_col]

    if label_col in feature_cols:
        raise_runtime_error("%s is duplicated." % label_col)

    if family == "Gaussian": 
        sm_family = sm.families.Gaussian()
    elif family == "inv_Gaussian":
        sm_family = sm.families.InverseGaussian()
    elif family == "binomial":
        sm_family = sm.families.Binomial()
    elif family == "Poisson":
        sm_family = sm.families.Poisson()
    elif family == "neg_binomial":
        sm_family = sm.families.NegativeBinomial()
    elif family == "gamma":
        sm_family = sm.families.Gamma()
    elif family == "Tweedie":
        sm_family = sm.families.Tweedie()

    if link == "ident":
        sm_link = sm.families.links.identity
    elif link == "log":
        sm_link = sm.families.links.log
    elif link == "logit":
        sm_link = sm.families.links.logit
    elif link == "probit":
        sm_link = sm.families.links.probit
    elif link == "cloglog":
        sm_link = sm.families.links.cLogLog
    elif link == "pow":
        sm_link = sm.families.links.Power
    elif link == "nbinom":
        sm_link = sm.families.links.binom

    if fit_intercept == True:
        glm_model = sm.GLM(label, sm.add_constant(features), family=sm_family, link=sm_link).fit()
    else:
        glm_model = sm.GLM(label, features, family=sm_family, link=sm_link).fit()
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
    model['coefficients'] = glm_model.params
    model['aic'] = glm_model.aic
    model['bic'] = glm_model.bic
    model['tvalues'] = glm_model.tvalues
    model['pvalues'] = glm_model.pvalues
    model['fit_intercept'] = fit_intercept
    model['glm_model'] = glm_model
    model['_repr_brtc_'] = rb.get()

    return {'model' : model}


def glm_predict(table, model, **params):
    check_required_parameters(_glm_predict, params, ['table', 'model'])
    if '_grouped_key' in model:
        group_by = model['_grouped_key']
        return _function_by_group(_glm_predict, table, model, group_by=group_by, **params)
    else:
        return _glm_predict(table, model, **params)       


def _glm_predict(table, model, prediction_col='prediction'):
    feature_cols = model['features']
    features = table[feature_cols]

    fit_intercept = model['fit_intercept']
    glm_model = model['glm_model']

    if fit_intercept == True:
        prediction = glm_model.predict(sm.add_constant(features))
    else:
        prediction = glm_model.predict(features)

    result = table.copy()
    result[prediction_col] = prediction
    
    return {'out_table' : result}
