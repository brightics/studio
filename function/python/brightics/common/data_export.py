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

import abc
import base64
import io
from collections import namedtuple
import matplotlib
matplotlib.rcParams['axes.unicode_minus'] = False
import matplotlib.pyplot as plt
import statsmodels.api as sm
import seaborn as sns


PNG_URL_PREFIX = b"data:image/png;base64,"

figData = namedtuple('figData', "id figname content")


class PlotArgsBase(abc.ABC):
    @abc.abstractmethod
    def plot(self): ...


class ScatterArgs(PlotArgsBase):
    def __init__(self, xdata, ydata, **kwargs):
        self.xdata = xdata
        self.ydata = ydata
        self.kwargs = kwargs

    def plot(self):
        plt.scatter(self.xdata, self.ydata, **self.kwargs)


class PlotArgs(PlotArgsBase):
    def __init__(self, *args, **kwargs):
        self.args = args
        self.kwargs = kwargs

    def plot(self):
        plt.plot(*self.args, **self.kwargs)


class AxHlineArgs(PlotArgsBase):
    def __init__(self, y=0, xmin=0, xmax=1, **kwargs):
        self.y = y
        self.xmin = xmin
        self.xmax = xmax
        self.kwargs = kwargs

    def plot(self):
        plt.axhline(self.y, self.xmin, self.xmax, **self.kwargs)


class QqPlotArgs_sm(PlotArgsBase):
    def __init__(self, data, **kwargs):
        self.data = data
        self.kwargs = kwargs

    def plot(self):
        sm.qqplot(self.data, **self.kwargs)


class DistPlotArgs_sns(PlotArgsBase):
    def __init__(self, a, **kwargs):
        self.a = a
        self.kwargs = kwargs

    def plot(self):
        sns.distplot(self.a, **self.kwargs)


class BarHArgs(PlotArgsBase):
    def __init__(self, y, width, **kwargs):
        self.y = y
        self.width = width
        self.kwargs = kwargs

    def plot(self):
        plt.barh(self.y, self.width, **self.kwargs)


class BarArgs(PlotArgsBase):
    def __init__(self, x, height, **kwargs):
        self.x = x
        self.height = height
        self.kwargs = kwargs

    def plot(self):
        plt.bar(self.x, self.height, **self.kwargs)


class ImShowArgs(PlotArgsBase):
    def __init__(self, x, **kwargs):
        self.x = x
        self.kwargs = kwargs

    def plot(self):
        plt.imshow(self.x, **self.kwargs)


class TextArgs(PlotArgsBase):
    def __init__(self, x, y, s, fontdict=None, **kwargs):
        self.x = x
        self.y = y
        self.s = s
        self.fontdict = fontdict
        self.kwargs = kwargs

    def plot(self):
        plt.text(self.x, self.y, self.s, fontdict=self.fontdict, **self.kwargs)


class TightLayout(PlotArgsBase):
    def plot(self):
        plt.tight_layout()


class ColorBar(PlotArgsBase):
    def plot(self):
        plt.colorbar()


class BoxPlotArgs_sns(PlotArgsBase):
    def __init__(self, *args, **kwargs):
        self.args = args
        self.kwargs = kwargs

    def plot(self):
        sns.boxplot(*self.args, **self.kwargs)


class Set_xticklabelsArgs(PlotArgsBase):
    def __init__(self, labels='self', **kwargs):
        self.labels = labels
        self.kwargs = kwargs

    def plot(self):
        ax = plt.gca()
        if self.labels == 'self':
            ax.set_xticklabels(ax.get_xticklabels(), **self.kwargs)
        else:
            ax.set_xticklabels(self.labels, **self.kwargs)


class Set_ylim(PlotArgsBase):
    def __init__(self, ylim, **kwargs):
        self.ylim = ylim
        self.kwargs = kwargs

    def plot(self):
        ax = plt.gca()
        ax.set_ylim(self.ylim, **self.kwargs)


class PyPlotMeta:
    def __init__(self, figname, title=None, xlabel=None, ylabel=None, xticks=None, yticks=None, **kwargs):
        self.figname = figname
        self.title = title
        self.meta = []
        self.xlabel = xlabel
        self.ylabel = ylabel
        self.xticks = xticks
        self.yticks = yticks

    def scatter(self, xdata, ydata, **kwargs):
        self.meta.append(ScatterArgs(xdata, ydata, **kwargs))

    def plot(self, *args, **kwargs):
        self.meta.append(PlotArgs(*args, **kwargs))

    def axhline(self, y=0, xmin=0, xmax=1, **kwargs):
        self.meta.append(AxHlineArgs(y, xmin, xmax, **kwargs))

    def qqplot_sm(self, data, **kwargs):
        self.meta.append(QqPlotArgs_sm(data, **kwargs))

    def distplot_sns(self, a, **kwargs):
        self.meta.append(DistPlotArgs_sns(a, **kwargs))

    def bar(self, x, height, **kwargs):
        self.meta.append(BarArgs(x, height, **kwargs))

    def barh(self, y, width, **kwargs):
        self.meta.append(BarHArgs(y, width, **kwargs))

    def text(self, x, y, s, **kwargs):
        self.meta.append(TextArgs(x, y, s, **kwargs))

    def tight_layout(self):
        self.meta.append(TightLayout())

    def imshow(self, x, **kwargs):
        self.meta.append(ImShowArgs(x, **kwargs))

    def colorbar(self):
        self.meta.append(ColorBar())

    def boxplot_sns(self, *args, **kwargs):
        self.meta.append(BoxPlotArgs_sns(*args, **kwargs))

    def set_xticklabels(self, labels='self', **kwargs):
        self.meta.append(Set_xticklabelsArgs(labels, **kwargs))

    def set_ylim(self, ylim, **kwargs):
        self.meta.append(Set_ylim(ylim, **kwargs))

    def compile(self, addurl=True):
        """returns a bytes string representation of pyplot figure of png format"""
        plt.figure()
        if self.title is not None:
            plt.title(self.title)
        if self.xlabel is not None:
            plt.xlabel(self.xlabel)
        if self.ylabel is not None:
            plt.ylabel(self.ylabel)
        if self.xticks is not None:
            plt.xticks(**self.xticks)
        if self.yticks is not None:
            plt.yticks(**self.yticks)
        for m in self.meta:
            m.plot()
        ret = self.plt2str(plt)
        plt.close()
        return ret

    @staticmethod
    def plt2str(pltfig, addurl=True):
        bytesio = io.BytesIO()
        pltfig.savefig(bytesio, format='png')
        bstr = base64.b64encode(bytesio.getvalue().strip())
        if addurl:
            bstr = PNG_URL_PREFIX + bstr
        return bstr.decode('ascii')

    @staticmethod
    def png2str(pngfig, addurl=True):
        bstr = base64.b64encode(pngfig)
        if addurl:
            bstr = PNG_URL_PREFIX + bstr
        return bstr.decode('ascii')


class PyPlotData:

    def __init__(self):
        self.last_idx = -1
        self.data = {}
        self._plotmeta = []

    def getid(self):
        self.last_idx += 1
        return 'figure' + str(self.last_idx)

    def addstr(self, strname, content):
        self.data[strname] = content

    def addpltfig(self, figname, pltfig, addurl=True):
        self.data[figname] = figData(
            self.getid(), figname, PyPlotMeta.plt2str(pltfig, addurl))

    def addpngfig(self, figname, pngfig, addurl=True):
        self.data[figname] = figData(
            self.getid(), figname, PyPlotMeta.png2str(pngfig, addurl))

    def getMD(self, figname):
        if isinstance(self.data[figname], figData):
            return f'![image]({self.data[figname].content})'
        else:
            return self.data[figname]

    def addmeta(self, meta):
        self._plotmeta.append(meta)

    def compile(self):
        for m in self._plotmeta:
            self.data[m.figname] = figData(
                self.getid(), m.figname, m.compile())

    def tojson(self):
        return dict((v.id, v.content) for v in self.data.values() if isinstance(v, figData))