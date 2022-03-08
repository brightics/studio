import os

from brightics.deeplearning.dataflow.image.loader.classification.common import ImageClassificationIN_MEMORY
from brightics.deeplearning.dataflow.image.loader.classification.common import n_hot_encode
from brightics.deeplearning.dataflow.image.loader.classification.common import path_type_chk

from tensorpack.dataflow.dataset.mnist import extract_images
from tensorpack.dataflow.dataset.mnist import extract_labels

class ImageClassificationMNIST(ImageClassificationIN_MEMORY):

    def __init__(self, datadir, mode='train', shuffle=True, retain_original_image=False):
        datadir = path_type_chk(datadir)
        assert os.path.isdir(datadir), 'Not a directory : {}'.format(datadir)

        if mode == 'train':
            image_file = os.path.join(datadir, 'train-images-idx3-ubyte.gz')
            label_file = os.path.join(datadir, 'train-labels-idx1-ubyte.gz')
        else:
            image_file = os.path.join(datadir, 't10k-images-idx3-ubyte.gz')
            label_file = os.path.join(datadir, 't10k-labels-idx1-ubyte.gz')

        images = extract_images(image_file)
        labels = extract_labels(label_file)

        num_label_texts_list = [1] * len(images)
        label_texts_list = [[str(idx)] for idx in labels]
        
        ImageClassificationIN_MEMORY.__init__(self, images, labels, label_texts_list, num_label_texts_list, shuffle, retain_original_image)
        self.labels = n_hot_encode(self.labels, 10, False)

