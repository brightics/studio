# import numpy as np
#
# from ..funcrunner.regression import (
#     LinearRegressionTrain, DecisionTreeRegressionTrain)
# from ..funcrunner.classification import (
#     DecisionTreeClassificationTrain
# )
#
# _regression = {
#     'linear_regression': LinearRegressionTrain,
#     'decision_tree_regression': DecisionTreeRegressionTrain
# }
#
# _classification = {
#     'decision_tree_classification': DecisionTreeClassificationTrain}
#
# _mlmodels = {}
# _mlmodels.update(_regression)
# _mlmodels.update(_classification)
#
#
# def mltrain(table, **kwargs):
#     params = {}
#     for k, v in kwargs.items():
#         if not (v.rex_typename == 'RexCall' and v.operator.kind == 'DEFAULT'):
#             val = v().value
#             if isinstance(val, np.ndarray):
#                 val = [it for it in val]
#             params[k] = val
#     model_type = params.pop('model_type')
#     model = _mlmodels[model_type](**params)
#     res = model(**{'table': table})
#     return {'res': res}


userdefined_functions = {
    # 'MLTRAIN': mltrain
}
