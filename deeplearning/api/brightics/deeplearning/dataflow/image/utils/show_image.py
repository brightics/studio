import copy

import cv2
import matplotlib.pyplot as plt
from matplotlib import patches
import numpy as np

from brightics.deeplearning.dataflow.image.standard_fileds import InputDataFields
from brightics.deeplearning.dataflow.image.mapper.augmenter import augment


def augment_and_show2(dp, augmenters, ncols=5, nrows=5, box_color=(255, 0, 0), bgr2rgb=False, fontcolor=(255, 255, 255),
                      fontsize=8):
    assert isinstance(augmenters, list)

    images = []
    for i in range(nrows):
        for j in range(ncols):
            if i == 0 and j == 0:
                images.append(copy.deepcopy(dp))
            else:
                dp_copy = copy.deepcopy(dp)
                images.append(augment(dp_copy, augmenters))

    hmax = max([image[InputDataFields.image].shape[0] for image in images])
    wmax = max([image[InputDataFields.image].shape[1] for image in images])

    hmax = max(hmax, 224)
    wmax = max(wmax, 224)

    f, axarr = plt.subplots(nrows, ncols, squeeze=False)
    f.set_size_inches(wmax / 100.0 * ncols, hmax / 100.0 * nrows)

    k = 0
    for i in range(nrows):
        for j in range(ncols):
            if i == 0 and j == 0:
                ax = axarr[i, j]
                image_show(images[k], ax, box_color, bgr2rgb, fontcolor, fontsize)
                shape = images[k]['image'].shape
                label = dp.get('label_texts', None)
                if label is None:
                    label_str = ', {}'.format(shape)
                else:
                    label_str = ': {}, {}'.format(label, shape)
                ax.set_title('original{}'.format(label_str))
            else:
                ax = axarr[i, j]
                image_show(images[k], ax, box_color, bgr2rgb, fontcolor, fontsize)
                shape = images[k]['image'].shape
                ax.set_title('{}'.format(shape))

            k = k + 1
    plt.tight_layout()


def image_classification_simulate(images, filenames, labels, predictions, ncols=5, box_color=(255, 0, 0), bgr2rgb=False,
                                  fontcolor=(255, 255, 255), fontsize=8):
    nrows = np.math.ceil(len(images) / ncols)

    hmax = max([image.shape[0] for image in images])
    wmax = max([image.shape[1] for image in images])

    f, axarr = plt.subplots(nrows, ncols,
                            gridspec_kw={'wspace': 0.05, 'hspace': 0.1, 'left': 0.02, 'right': 0.98, 'top': 0.98,
                                         'bottom': 0.01}, squeeze=False)
    f.set_size_inches(wmax / 100.0 * ncols, hmax / 100.0 * nrows)
    size = len(images)

    k = 0
    for i in range(nrows):
        for j in range(ncols):
            ax = axarr[i, j]

            if k < size:
                dp = {'image': images[k],
                      'label': labels[k],
                      'filename': filenames[k],
                      'prediction': predictions[k]}
            else:
                dp = {}

            image_show(dp, ax, box_color, bgr2rgb, fontcolor, fontsize)

            titles = []
            if 'filename' in dp and dp['filename'] is not None:
                titles.append('filename: {}'.format(dp['filename']))

            if 'label' in dp and dp['label'] is not None:
                titles.append('label: {}'.format(dp['label']))

            if 'prediction' in dp and dp['prediction'] is not None:
                titles.append('prediction: {}'.format(dp['prediction']))

            image_show(dp, ax, box_color, bgr2rgb, fontcolor, fontsize)
            ax.set_title('{}'.format('\n'.join(titles)))

            k = k + 1


def augment_and_show(dp, augmenters, ax=None, box_color=(255, 0, 0), bgr2rgb=True, fontcolor=(255, 255, 255),
                     fontsize=8):
    assert isinstance(augmenters, list)

    nrows = len(augmenters)
    h, w, _ = dp['image'].shape
    longest = max(h, w)
    f, axarr = plt.subplots(nrows, 1, gridspec_kw={'wspace': 0, 'hspace': 0.1}, squeeze=True)
    f.set_size_inches(longest / 100.0, longest / 100.0 * nrows)
    for i in range(nrows):
        if i == 0:
            ax = axarr[i]
            image_show(dp, ax, box_color, bgr2rgb, fontcolor, fontsize)
            ax.set_title('original')
        else:
            ax = axarr[i]
            image_show(augment(dp, [augmenters[i]]), ax, box_color, bgr2rgb, fontcolor, fontsize)
            ax.set_title(type(augmenters[i]).__name__)


def image_show(dp, ax=None, box_color=(255, 0, 0), bgr2rgb=True, fontcolor=(255, 255, 255), fontsize=8):
    if ax is None:
        ax = plt.gca()

    if not dp:
        ax.axis('off')
        return

    if bgr2rgb:
        image = cv2.cvtColor(dp['image'], cv2.COLOR_BGR2RGB)
    else:
        image = dp['image']

    h = image.shape[0]
    w = image.shape[1]
    if len(image.shape) == 3 and image.shape[2] == 1:
        image = np.squeeze(image, -1)
    ax.axis('off')
    ax.imshow(image)

    if InputDataFields.groundtruth_boxes in dp:
        bboxes = dp[InputDataFields.groundtruth_boxes]
        labels_text = dp[InputDataFields.groundtruth_classes]
        fontcolor_plt = tuple(val / 255.0 for val in fontcolor)
        boxcolor_plt = tuple(val / 255.0 for val in box_color)

        for bbox, label_text in zip(bboxes, labels_text):
            x_min, y_min, x_max, y_max = tuple(bbox)
            x_min = int(x_min * w)
            x_max = int(x_max * w)
            y_min = int(y_min * h)
            y_max = int(y_max * h)

            rect = patches.Rectangle((x_min, y_min), x_max - x_min, y_max - y_min, linewidth=1, edgecolor=boxcolor_plt,
                                     facecolor='none')
            ax.add_patch(rect)
            ax.text(x_min, y_min, label_text, fontsize=fontsize, color=fontcolor_plt, horizontalalignment='left',
                    verticalalignment='bottom', bbox=dict(edgecolor=boxcolor_plt, facecolor=boxcolor_plt, pad=0))
