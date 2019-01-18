import pandas as pd

'''
*** NOTE *** 
This is a deprecated module. Use brightics.common.validation alternatively.
'''
from brightics.common.datasets import load_iris


def get_iris():
    return load_iris()
