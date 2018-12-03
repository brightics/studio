from brightics.brightics_data_api import _generate_matplotlib_data, _png2uri
import re
import pandas as pd


class BrtcReprBuilder:

    def __init__(self):
        self.res = {'contents':[]}
    
    def addPlt(self, plt):
        self.res['contents'].append({'text':plt2MD(plt), 'type':'md'})
    
    def addMD(self, str_):
        self.res['contents'].append({'text':str_, 'type':'md'})
        
    def addRawTextMD(self, str_):
        self.res['contents'].append({'text':"""```
        {str_}
        ```""".format(str_=str_), 'type':'md'})
    
    def addHTML(self, str_):
        self.res['contents'].append({'text':str_, 'type':'html'})
    
    def addMDFront(self, str_):
        self.res['contents'] = [{'text':str_, 'type':'md'}] + self.res['contents']
    
    def addHTMLFront(self, str_):
        self.res['contents'] = [{'text':str_, 'type':'html'}] + self.res['contents']
    
    def get(self):
        return self.res
    
    def merge(self, other_res):
        self.res['contents'].extend(other_res['contents'])


def plt2MD(plt):
    return '![image]({image})'.format(image=_generate_matplotlib_data(plt))


def png2MD(png):
    return '![image]({image})'.format(image=_png2uri(png))

            
def strip_margin(text):
    return re.sub('\n[ \t]*\|', '\n', text)
    

def pandasDF2MD(df, num_rows=20):
    # # pandas df
    fmt = ['---' for _ in range(len(df.columns))]
    df_fmt = pd.DataFrame([fmt], columns=df.columns)
    df_formatted = pd.concat([df_fmt, df[0:num_rows]])

    return df_formatted.to_csv(sep="|", index=False)


def keyValues2MD(keys, values, precision=6):
    return '\n'.join(['- {key}: {value}'.format(key=key, value=_display_value(value, precision)) for key, value in zip(keys, values)])


def dict2MD(dict_, precision=6):  # 
    return '\n'.join(['- {key}: {value}'.format(key=key, value=_display_value(value, precision)) for key, value in dict_.items()])

    
def _display_value(value, precision=6):
    if isinstance(value, float):
        return '{:.{prec}f}'.format(value, prec=precision)
    else:
        return value
            
