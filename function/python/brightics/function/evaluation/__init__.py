import pandas as pd
import numpy as np
import itertools
from brightics.common.repr import BrtcReprBuilder, strip_margin, pandasDF2MD, plt2MD
import matplotlib.pyplot as plt
from sklearn.metrics import explained_variance_score, mean_absolute_error, mean_squared_error, median_absolute_error, r2_score
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score, confusion_matrix
from sklearn.metrics import roc_curve, auc, precision_recall_curve, average_precision_score
from sklearn.utils.fixes import signature
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters


def evaluate_regression(table, group_by=None, **params):
    check_required_parameters(_evaluate_regression, params, ['table'])
    if group_by is not None:
        return _function_by_group(_evaluate_regression, table, group_by=group_by, **params)
    else:
        return _evaluate_regression(table, **params)


def _evaluate_regression(table, label_col, prediction_col):
    label = table[label_col]
    predict = table[prediction_col]
    
    # compute metrics
    evs = explained_variance_score(label, predict)
    mae = mean_absolute_error(label, predict)
    mse = mean_squared_error(label, predict)
    mdae = median_absolute_error(label, predict)
    r2 = r2_score(label, predict)
                    
    # json  
    summary = dict()
    summary['label_col'] = label_col
    summary['prediction_col'] = prediction_col
    summary['r2_score'] = r2
    summary['mean_squared_error'] = mse
    summary['mean_absolute_error'] = mae
    summary['median_absolute_error'] = mdae
    summary['explained_variance_score'] = evs
    
    # report
    all_dict_list = [{'r2_score': r2, 'mean_squared_error': mse, 'mean_absolute_error': mae, 'median_absolute_error': mdae, 'explained_variance_score': evs}]
    all_df = pd.DataFrame(all_dict_list)
    all_df = all_df[['r2_score', 'mean_squared_error', 'mean_absolute_error', 'median_absolute_error', 'explained_variance_score']]
    summary['all'] = all_df
            
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ## Evaluate Regression Result
    | ### Metrics
    | {table1}
    |
    |
    """.format(table1=pandasDF2MD(all_df)            
               )))     
    summary['_repr_brtc_'] = rb.get()   
               
    return {'result' : summary}


def evaluate_classification(table, group_by=None, **params):
    check_required_parameters(_evaluate_classification, params, ['table'])
    if group_by is not None:
        return _function_by_group(_evaluate_classification, table, group_by=group_by, **params)
    else:
        return _evaluate_classification(table, **params)


def _evaluate_classification(table, label_col, prediction_col):
    
    label = table[label_col]
    predict = table[prediction_col]
    
    # compute metrics
    accuracy = accuracy_score(label, predict)
    f1 = f1_score(label, predict, average="weighted")
    precision = precision_score(label, predict, average="weighted")
    recall = recall_score(label, predict, average="weighted")
    class_names = np.unique(np.union1d(label.values, predict.values))
    
    # Plot non-normalized confusion matrix
    plt.figure()
    _plot_confusion_matrix(label, predict, classes=class_names,
                          title='Confusion matrix, without normalization')
    fig_cnf_matrix = plt2MD(plt)
    # Plot normalized confusion matrix
    plt.figure()
    _plot_confusion_matrix(label, predict, classes=class_names, normalize=True,
                          title='Normalized confusion matrix')
    fig_cnf_matrix_normalized = plt2MD(plt)
    plt.clf()
                    
    # json  
    summary = dict()
    summary['label_col'] = label_col
    summary['prediction_col'] = prediction_col
    summary['f1_score'] = f1
    summary['accuracy_score'] = accuracy
    summary['precision_score'] = precision
    summary['recall_score'] = recall
    
    # report    
    all_dict_list = [{'f1': f1, 'accuracy': accuracy, 'precision': precision, 'recall': recall}]
    all_df = pd.DataFrame(all_dict_list)
    all_df = all_df[['f1', 'accuracy', 'precision', 'recall']]
    summary['all'] = all_df
            
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ## Evaluate Classification Result
    | ### Metrics
    | {table1}
    |
    | ### Confusion matrix
    | {fig_confusion_matrix}
    |
    | {fig_confusion_matrix_normalized}
    |
    """.format(table1=pandasDF2MD(all_df),
               fig_confusion_matrix=fig_cnf_matrix,
               fig_confusion_matrix_normalized=fig_cnf_matrix_normalized           
               )))     
    summary['_repr_brtc_'] = rb.get()   
               
    return {'result' : summary}
        

def _plot_confusion_matrix(label, predict, classes,
                          normalize=False,
                          title='Confusion matrix',
                          cmap=plt.cm.Blues):
    """
    This function prints and plots the confusion matrix.
    Normalization can be applied by setting `normalize=True`.
    """
    # #This code is from http://scikit-learn.org/stable/auto_examples/model_selection/_plot_confusion_matrix.html
    cnf_matrix = confusion_matrix(label, predict)
    
    if normalize:
        cnf_matrix = cnf_matrix.astype('float') / cnf_matrix.sum(axis=1)[:, np.newaxis]
        # print("Normalized confusion matrix")
    # else:
    #    print('Confusion matrix, without normalization')

    # print(cnf_matrix)

    plt.imshow(cnf_matrix, interpolation='nearest', cmap=cmap)
    plt.title(title)
    plt.colorbar()
    tick_marks = np.arange(len(classes))
    plt.xticks(tick_marks, classes, rotation=45)
    plt.yticks(tick_marks, classes)

    fmt = '.2f' if normalize else 'd'
    thresh = cnf_matrix.max() / 2.
    for i, j in itertools.product(range(cnf_matrix.shape[0]), range(cnf_matrix.shape[1])):
        plt.text(j, i, format(cnf_matrix[i, j], fmt),
                 horizontalalignment="center",
                 color="white" if cnf_matrix[i, j] > thresh else "black")

    plt.ylabel('True label')
    plt.xlabel('Predicted label')
    plt.tight_layout()
    

def _plot_binary(label, probability, threshold=None, fig_size=(6.4, 4.8), pos_label=None):
    fpr, tpr, threshold_roc = roc_curve(label, probability, pos_label=pos_label)
    # tpf 1-fpr
    if threshold is None:
        argmin = np.argmin(np.abs(tpr + fpr - 1))
        threshold = threshold_roc[argmin]
    
    fpr_prop = fpr[argmin]
    tpr_prop = tpr[argmin]
    plt.plot(threshold_roc, tpr, color='blue',
             label='TPR')
    plt.plot(threshold_roc, 1 - fpr, color='red',
             label='1-FPR')
    plt.xlabel('Threshold')
    plt.ylabel('TPR or 1-FPR')
    plt.legend(loc="lower center")
    plt.axvline(threshold, linestyle='--')
    plt.text(threshold + 0.02, 0.5, 'threshold: %0.2f' % threshold, rotation=90, verticalalignment='center')
    plt.xlim([0.0, 1.0])
    plt.ylim([0.0, 1.05])
    fig_tpr_fpr = plt2MD(plt)
    plt.clf()
    
    # roc
    auc_score = auc(fpr, tpr)
    plt.figure(figsize=fig_size)
    plt.plot(fpr, tpr, color='darkorange',
             label='ROC curve (area = %0.2f)' % auc_score)
    plt.plot([0, 1], [0, 1], color='navy', linestyle='--')
    plt.plot(fpr_prop, tpr_prop, 'g*', markersize=10, color="red", label='threshold: %0.2f' % threshold)
    plt.xlim([0.0, 1.0])
    plt.ylim([0.0, 1.05])
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate')
    plt.title('Receiver operating characteristic')
    plt.legend(loc="lower right")
    fig_roc = plt2MD(plt)
    plt.clf()
    
    # pr
    precision, recall, threshold_pr = precision_recall_curve(label, probability, pos_label=pos_label)
    precision_prop = precision[argmin]
    recall_prop = recall[argmin]
    
    step_kwargs = ({'step': 'post'}
                   if 'step' in signature(plt.fill_between).parameters
                   else {})
    plt.step(recall, precision, color='b', alpha=0.2, where='post')
    plt.fill_between(recall, precision, alpha=0.2, color='b', **step_kwargs)
    plt.xlabel('Recall')
    plt.ylabel('Precision')
    plt.ylim([0.0, 1.05])
    plt.xlim([0.0, 1.0])
    plt.plot(recall_prop, precision_prop, 'g*', markersize=10, color="red", label='threshold: %0.2f' % threshold)
    plt.title('Precision-Recall curve')  # TODO Average precision score
    plt.legend()
    fig_pr = plt2MD(plt)
    plt.clf()

    threshold_pr = np.append(threshold_pr, 1) 
    plt.plot(threshold_pr, precision, color='blue',
             label='Precision')
    plt.plot(threshold_pr, recall, color='red',
             label='Recall')
    plt.xlabel('Threshold')
    plt.ylabel('Precision or Recall')
    plt.legend(loc="lower center")
    plt.axvline(threshold, linestyle='--')
    plt.text(threshold + 0.02, 0.5, 'threshold: %0.2f' % threshold, rotation=90, verticalalignment='center')
    plt.xlim([0.0, 1.0])
    plt.ylim([0.0, 1.05])
    fig_precision_recall = plt2MD(plt)
    plt.clf()
    
    classes = label.unique()
    neg_label = [cls for cls in classes if cls != pos_label][0]
    predict = probability.apply(lambda x: pos_label if x >= threshold else neg_label)
    
    _plot_confusion_matrix(label, predict, [pos_label, neg_label],
                          normalize=False,
                          title='Confusion matrix',
                          cmap=plt.cm.Blues)
    fig_confusion = plt2MD(plt)
    plt.clf()

    return threshold, fig_tpr_fpr, fig_roc, fig_precision_recall, fig_pr, fig_confusion


def plot_roc_pr_curve(table, group_by=None, **params):
    check_required_parameters(_plot_roc_pr_curve, params, ['table'])
    if group_by is not None:
        return _function_by_group(_plot_roc_pr_curve, table, group_by=group_by, **params)
    else:
        return _plot_roc_pr_curve(table, **params)    


def _plot_roc_pr_curve(table, label_col, probability_col, fig_w=6.4, fig_h=4.8, pos_label=None):
    label = table[label_col]
    probability = table[probability_col]
    
    threshold, fig_tpr_fpr, fig_roc, fig_precision_recall, fig_pr, fig_confusion = _plot_binary(label, probability, fig_size=(fig_w, fig_h), pos_label=pos_label)

    summary = dict()
    summary['threshold'] = threshold
    summary['label_col'] = label_col
    summary['probability_col'] = probability_col
    
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ## Plot ROC Curve and PR Curve Result
    |
    | ### ROC Curve
    | {fig_tpr_fpr}
    | {fig_roc}
    |
    | ### PR Curve
    | {fig_precision_recall}
    | {fig_pr}
    |
    | ### Confusion Matrix
    | {fig_confusion}
    """.format(fig_roc=fig_roc,
               fig_tpr_fpr=fig_tpr_fpr,
               fig_pr=fig_pr,
               fig_precision_recall=fig_precision_recall,
               fig_confusion=fig_confusion
               )))     
    summary['_repr_brtc_'] = rb.get()
                   
    return {'result' : summary}
