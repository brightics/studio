
import os

import numpy as np
import pandas as pd
 
'''
The function determines the type of an image by the content, not by the file extension.
In the case of color images, the decoded images will have the channels stored in B G R order.
On Microsoft Windows* OS and MacOSX*, the codecs shipped with an OpenCV image (libjpeg, libpng, libtiff, and libjasper) are used by default. So, OpenCV can always read JPEGs, PNGs, and TIFFs. On MacOSX, there is also an option to use native MacOSX image readers. But beware that currently these native image loaders give images with different pixel values because of the color management embedded into MacOSX.
On Linux*, BSD flavors and other Unix-like open-source operating systems, OpenCV looks for codecs supplied with an OS image. Install the relevant packages (do not forget the development files, for example, "libjpeg-dev", in Debian* and Ubuntu*) to get the codec support or turn on the OPENCV_BUILD_3RDPARTY_LIBS flag in CMake.
In the case you set WITH_GDAL flag to true in CMake and IMREAD_LOAD_GDAL to load the image, then GDAL driver will be used in order to decode the image by supporting the following formats: Raster, Vector.
If EXIF information are embedded in the image file, the EXIF orientation will be taken into account and thus the image will be rotated accordingly except if the flag IMREAD_IGNORE_ORIENTATION is passed.
from docs.opencv.org
'''
WHITE_LIST_FORMATS = ['.dib', '.bmp',  # always
                      '.jpeg', '.jpg', 'jpe',
                      '.jp2',
                      '.png',
                      '.webp',
                      '.pbm', '.pgm', '.ppm' '.pxm', '.pnm',  # always
                      '.sr', '.ras',  # always
                      '.tiff', '.tif',
                      '.exr',
                      '.hdr', '.pic']
 
 
def _get_extension(file):
    return os.path.splitext(file)[1].lower()
 
 
def _get_valid_classes(directory, white_list_formats):
    valid_classes = []
     
    for root, _, files in os.walk(directory):
        if any(_get_extension(file) in white_list_formats for file in files):
            valid_classes.append(os.path.normcase(os.path.relpath(root, directory)))
         
    return valid_classes
 
 
def _get_valid_files(directory, white_list_formats):
    classes = _get_valid_classes(directory, white_list_formats)
    classes.sort()
    num_classes = len(classes)
    class_indices = dict(zip(classes, range(num_classes)))
    result = []
    
    for root, _, files in os.walk(directory):
        for file in files:
            if _get_extension(file) in white_list_formats:
                label_text = os.path.normcase(os.path.relpath(root, directory))
                label_index = class_indices[os.path.normcase(os.path.relpath(root, directory))]
                filename = os.path.join(label_text, file)
                result.append((filename, label_index))
                
    return result, classes

 
def create_csvfile_from_directory(datadir, outfile=None, white_list_format=None):
    
    if white_list_format is None:
        white_list_format = WHITE_LIST_FORMATS
        
    if outfile is None:
        outfile = os.path.join(datadir, 'labels.csv')
                 
    assert os.path.isdir(datadir)
        
    files, classes = _get_valid_files(datadir, white_list_format)
    label_provided = len(classes) > 1
    with open(outfile, 'w', newline='') as f:
        if label_provided:
            f.write('# {}\n'.format(','.join(classes)))
        else:
            f.write('# w/o labels\n')
        pd.DataFrame(files).to_csv(f, header=False, index=False)
