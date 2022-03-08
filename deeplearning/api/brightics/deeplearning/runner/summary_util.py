from io import BytesIO
import base64
import json

import numpy as np
import itertools
import matplotlib.pyplot as plt
from sklearn.metrics import roc_curve, auc, precision_recall_curve

from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score, confusion_matrix
from pycocotools.cocoeval import COCOeval as MSCOCOeval

TEMPLATE = '''
<table>
<tbody>
<tr class='metrics'>
<th>
Metrics
</th>
</tr>
<tr class='metrics'>
<td>
accuracy
</td>
<td>
{accuracy}
</td>
</tr>
<tr class='metrics'>
<td>
f1
</td>
<td>
{f1}
</td>
</tr>
<tr class='metrics'>
<td>
precision
</td>
<td>
{precision}
</td>
</tr>
<tr class='metrics'>
<td>
recall
</td>
<td>
{recall}
</td>
</tr>
<tr class='confusion_matrix'>
<th>
Confusion Matrix
</th>
</tr>
<tr class='confusion_matrix'>
<td>
{confusion_matrix}
</td>
<td>
{normalized_confusion_matrix}
</td>
</tr>
{body}
</tbody>
</table>
'''

PLOTS = '''
<tr class='binary'>
<th>Metrics by {label}</th>
<td></td>
</tr>
<tr class='roc'>
<td><img src="{roc}" /></td>
<td><img src="{tpr_fpr}" /></td>
</tr>
<tr class='pr'>
<td><img src="{pr}" /></td>
<td><img src="{pr2}" /></td>
</tr>
'''


def create_summary(label, probability, outfile='output.html', outjson='output.json', pos_labels=None, prediction_weights=None, average='weighted', jpeg_quality=90, figsize=(6.4, 4.8), cnf_mat_overlay_text=False, json_cls=None):
    '''
    label: one-hot encoded or integer
    probability: float 2d array
    '''
    if json_cls is None:
        json_cls = json.JSONEncoder
        
    if prediction_weights is None:
        prediction_weights = [1] * np.shape(probability)[1]
    prediction_weights = np.array(prediction_weights)
    
    label = np.array(label)
    if len(label.shape) == 2:
        label = np.argmax(label, axis=1)
    
    output_dict = {}
    
    prediction = np.argmax(probability / prediction_weights, axis=1)  # todo
    accuracy = accuracy_score(label, prediction)
    f1 = f1_score(label, prediction, average=average)
    precision = precision_score(label, prediction, average=average)
    recall = recall_score(label, prediction, average=average)
    
    output_dict['metrics'] = {}
    output_dict['metrics']['accuracy'] = accuracy
    output_dict['metrics']['f1'] = f1
    output_dict['metrics']['precision'] = precision
    output_dict['metrics']['recall'] = recall
        
    plt.figure(figsize=figsize)
    cnf_matrix = _plot_confusion_matrix(label, prediction, title='Confusion Matrix', cnf_mat_overlay_text=cnf_mat_overlay_text)
    fig_cnf_matrix_base64 = _plt2jpg_base64(plt, jpeg_quality)
    
    output_dict['confusion_matrix'] = cnf_matrix
    
    plt.figure(figsize=figsize)
    _ = _plot_confusion_matrix(label, prediction, title='Normalized Confusion Matrix', normalize=True, cnf_mat_overlay_text=cnf_mat_overlay_text)
    fig_normalized_cnf_matrix_base64 = _plt2jpg_base64(plt, jpeg_quality)
    
    html_confusion_matrix = """<img src="{}"/>""".format(fig_cnf_matrix_base64)
    html_normalized_confusion_matrix = """<img src="{}"/>""".format(fig_normalized_cnf_matrix_base64)
    
    num_classes = cnf_matrix.shape[0]

    res_str = []
    if pos_labels is None or pos_labels == '':
        pos_labels = [0]
    elif pos_labels == 'all':
        pos_labels = range(num_classes) 
    
    output_dict['binary'] = {}
    output_dict['binary']['pos_labels'] = [str(idx) for idx in pos_labels]
    
    for idx in pos_labels:
        prob = [prob[idx] for prob in probability]
        lab = label
        fig_fpr_tpr_base64, fig_roc_base64, fig_pr_base64, fig_pr2_base64, binary_res = _plot_binary(lab, prob, jpeg_quality=90,
                                                                                     pos_label=idx, figsize=figsize)

        output_dict['binary'][idx] = binary_res
        res_str.append(
            PLOTS.format(label=idx, roc=fig_roc_base64, pr=fig_pr_base64, tpr_fpr=fig_fpr_tpr_base64, pr2=fig_pr2_base64))

    html_summary = TEMPLATE.format(body='\n'.join(res_str),
                                       confusion_matrix=html_confusion_matrix,
                                       normalized_confusion_matrix=html_normalized_confusion_matrix,
                                       accuracy=accuracy,
                                       f1=f1,
                                       precision=precision,
                                       recall=recall)
    
    with open(outjson, 'wb') as f:
        f.write(json.dumps(output_dict, encoding='utf-8', cls=json_cls).encode())
    
    with open(outfile, 'w') as f:
        f.write(html_summary)
    

def _get_arg_threshold(fpr, tpr, threshold_roc):
    argmin = np.argmin(np.abs(tpr + fpr - 1))
    threshold = threshold_roc[argmin]
    return argmin, threshold

    
def _plot_fpr_tpr(fpr, tpr, threshold_roc, arg, ax=None):
    if ax is None:
        ax = plt.gca()
        
    threshold = threshold_roc[arg]

    ax.plot(threshold_roc, tpr, color='blue',
             label='TPR')
    ax.plot(threshold_roc, 1 - fpr, color='red',
             label='1-FPR')
    ax.set_xlabel('Threshold')
    ax.set_ylabel('TPR or 1-FPR')
    ax.legend(loc="lower center")
    ax.axvline(threshold, linestyle='--')
    ax.text(threshold + 0.02, 0.5, 'threshold: %0.2f' % threshold, rotation=90, verticalalignment='center')
    ax.set_xlim([0.0, 1.0])
    ax.set_ylim([0.0, 1.05])

    
def _plot_roc(fpr, tpr, threshold_roc, arg, ax=None):
    if ax is None:
        ax = plt.gca()
    
    threshold = threshold_roc[arg]
    fpr_prop = fpr[arg]
    tpr_prop = tpr[arg]
    
    auc_score = auc(fpr, tpr)
    ax.plot(fpr, tpr, color='darkorange',
             label='ROC curve (area = %0.2f)' % auc_score)
    ax.plot([0, 1], [0, 1], color='navy', linestyle='--')
    ax.plot(fpr_prop, tpr_prop, 'g*', markersize=10, color="red", label='threshold: %0.2f' % threshold)
    ax.set_xlim([0.0, 1.0])
    ax.set_ylim([0.0, 1.05])
    ax.set_xlabel('False Positive Rate')
    ax.set_ylabel('True Positive Rate')
    ax.set_title('Receiver operating characteristic')
    ax.legend(loc="lower right")
    
    
def _plot_pr(precision, recall, arg, threshold, ax=None):
    from inspect import signature
    if ax is None:
        ax = plt.gca()
    
    precision_prop = precision[arg]
    recall_prop = recall[arg]

    step_kwargs = ({'step': 'post'}
                   if 'step' in signature(plt.fill_between).parameters
                   else {})
    ax.step(recall, precision, color='b', alpha=0.2, where='post')
    ax.fill_between(recall, precision, alpha=0.2, color='b', **step_kwargs)
    ax.set_xlabel('Recall')
    ax.set_ylabel('Precision')
    ax.set_ylim([0.0, 1.05])
    ax.set_xlim([0.0, 1.0])
    ax.plot(recall_prop, precision_prop, 'g*', markersize=10, color="red", label='threshold: %0.2f' % threshold)
    ax.set_title('Precision-Recall curve')  # TODO Average precision score
    ax.legend()

    
def _plot_pr2(precision, recall, threshold_pr, threshold, ax=None):
    if ax is None:
        ax = plt.gca()
    
    threshold_pr = np.append(threshold_pr, 1)
    ax.plot(threshold_pr, precision, color='blue',
             label='Precision')
    ax.plot(threshold_pr, recall, color='red',
             label='Recall')
    ax.set_xlabel('Threshold')
    ax.set_ylabel('Precision or Recall')
    ax.legend(loc="lower center")
    ax.axvline(threshold, linestyle='--')
    ax.text(threshold + 0.02, 0.5, 'threshold: %0.2f' % threshold, rotation=90, verticalalignment='center')
    ax.set_xlim([0.0, 1.0])
    ax.set_ylim([0.0, 1.05])

    
def _plot_binary(label, probability, figsize=(6.4, 4.8), pos_label=None, jpeg_quality=90):
    res_dict = {}
    
    fpr, tpr, threshold_roc = roc_curve(label, probability, pos_label=pos_label)
    arg, threshold = _get_arg_threshold(fpr, tpr, threshold_roc)
    
    res_dict['fpr'] = fpr
    res_dict['tpr'] = tpr
    res_dict['thresholds_roc'] = threshold_roc
    
    plt.figure(figsize=figsize)
    _plot_fpr_tpr(fpr, tpr, threshold_roc, arg)
    fig_fpr_tpr_base64 = _plt2jpg_base64(plt, jpeg_quality)

    plt.figure(figsize=figsize)
    _plot_roc(fpr, tpr, threshold_roc, arg)
    fig_roc_base64 = _plt2jpg_base64(plt, jpeg_quality)

    precision, recall, threshold_pr = precision_recall_curve(label, probability, pos_label=pos_label)
    res_dict['precision'] = precision
    res_dict['recall'] = recall
    res_dict['thresholds_pr'] = threshold_pr
    
    plt.figure(figsize=figsize)
    _plot_pr(precision, recall, arg, threshold)
    fig_pr_base64 = _plt2jpg_base64(plt, jpeg_quality)
    
    plt.figure(figsize=figsize)
    _plot_pr2(precision, recall, threshold_pr, threshold)
    fig_pr2_base64 = _plt2jpg_base64(plt, jpeg_quality)
    
    return fig_fpr_tpr_base64, fig_roc_base64, fig_pr_base64, fig_pr2_base64, res_dict


def _plot_confusion_matrix(label, predict, classes=None,
                           normalize=False,
                           title='Confusion matrix',
                           cmap=plt.cm.Blues,
                           jpeg_quality=90, ax=None,
                           cnf_mat_overlay_text=True):
    """
    This function prints and plots the confusion matrix.
    Normalization can be applied by setting `normalize=True`.
    """
    if ax is None:
        ax = plt.gca()
    
    # #This code is from http://scikit-learn.org/stable/auto_examples/model_selection/_plot_confusion_matrix.html
    cnf_matrix = confusion_matrix(label, predict)
    if classes is None:
        classes = range(cnf_matrix.shape[0])

    if normalize:
        cnf_matrix = cnf_matrix.astype('float') / cnf_matrix.sum(axis=1)[:, np.newaxis]

    cax = ax.imshow(cnf_matrix, interpolation='nearest', cmap=cmap)
    ax.set_title(title)
    
    fig = plt.gcf()
    fig.colorbar(cax)

    tick_marks = np.arange(len(classes))
    ax.set_xticks(tick_marks, classes)
    ax.set_yticks(tick_marks, classes)

    if cnf_mat_overlay_text:
        fmt = '.2f' if normalize else 'd'
        thresh = cnf_matrix.max() / 2.
        for i, j in itertools.product(range(cnf_matrix.shape[0]), range(cnf_matrix.shape[1])):
            ax.text(j, i, format(cnf_matrix[i, j], fmt),
                     horizontalalignment="center",
                     color="white" if cnf_matrix[i, j] > thresh else "black")

    ax.set_ylabel('True label')
    ax.set_xlabel('Predicted label')
    
    return cnf_matrix


def _plt2jpg_base64(plt, jpeg_quality):
    img = BytesIO()
    plt.savefig(img, format='jpg', jpeg_quality=jpeg_quality)
    plt.clf()  # clear the current figure

    image_str = b'data:image/jpg;base64,' + base64.b64encode(img.getvalue().strip())
    image_str = image_str.decode('ascii')
    return image_str


class COCOeval(MSCOCOeval):

        def summarize(self, ious=None):
            '''
            Modified version from https://github.com/cocodataset/cocoapi/blob/master/PythonAPI/pycocotools/cocoeval.py
            '''
            if ious is None:
                ious = [0.5, 0.75]

            def _summarize(ap=1, iouThr=None, areaRng=None, maxDets=None):
                p = self.params
                if areaRng is None:
                    areaRng = p.areaRngLbl[0]
                if maxDets is None:
                    maxDets = p.maxDets[-1]

                iStr = ' {:<18} {} @[ IoU={:<9} | area={:>6s} | maxDets={:>3d} ] = {:0.3f}'
                titleStr = 'Average Precision' if ap == 1 else 'Average Recall'
                typeStr = '(AP)' if ap == 1 else '(AR)'
                iouStr = '{:0.2f}:{:0.2f}'.format(p.iouThrs[0], p.iouThrs[-1]) \
                    if iouThr is None else '{:0.2f}'.format(iouThr)

                aind = [i for i, aRng in enumerate(p.areaRngLbl) if aRng == areaRng]
                mind = [i for i, mDet in enumerate(p.maxDets) if mDet == maxDets]
                if ap == 1:
                    # dimension of precision: [TxRxKxAxM]
                    s = self.eval['precision']
                    # IoU
                    if iouThr is not None:
                        t = np.where(iouThr == p.iouThrs)[0]
                        s = s[t]
                    s = s[:, :, :, aind, mind]
                else:
                    # dimension of recall: [TxKxAxM]
                    s = self.eval['recall']
                    if iouThr is not None:
                        t = np.where(iouThr == p.iouThrs)[0]
                        s = s[t]
                    s = s[:, :, aind, mind]
                if len(s[s > -1]) == 0:
                    mean_s = -1
                else:
                    mean_s = np.mean(s[s > -1])
                print(iStr.format(titleStr, typeStr, iouStr, areaRng, maxDets, mean_s))
                return mean_s

            def _summarizeDets():
                stats = []
                stats.append(_summarize(1))
                for iou in ious:
                    stats.append(_summarize(1, iouThr=iou))
                for rngLbl in self.params.areaRngLbl:
                    stats.append(_summarize(1, areaRng=rngLbl))
                for max_dets in self.params.maxDets:
                    stats.append(_summarize(0, maxDets=max_dets))
                for rngLbl in self.params.areaRngLbl:
                    stats.append(_summarize(0, areaRng=rngLbl))
                return np.array(stats)

            def _summarizeKps():
                stats = np.zeros((10,))
                stats[0] = _summarize(1, maxDets=20)
                stats[1] = _summarize(1, maxDets=20, iouThr=.5)
                stats[2] = _summarize(1, maxDets=20, iouThr=.75)
                stats[3] = _summarize(1, maxDets=20, areaRng='medium')
                stats[4] = _summarize(1, maxDets=20, areaRng='large')
                stats[5] = _summarize(0, maxDets=20)
                stats[6] = _summarize(0, maxDets=20, iouThr=.5)
                stats[7] = _summarize(0, maxDets=20, iouThr=.75)
                stats[8] = _summarize(0, maxDets=20, areaRng='medium')
                stats[9] = _summarize(0, maxDets=20, areaRng='large')
                return stats

            if not self.eval:
                raise Exception('Please run accumulate() first')
            iouType = self.params.iouType
            if iouType == 'segm' or iouType == 'bbox':
                summarize = _summarizeDets
            elif iouType == 'keypoints':
                summarize = _summarizeKps
            self.stats = summarize()
