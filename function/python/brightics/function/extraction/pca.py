from sklearn.decomposition import PCA
import pandas as pd
import matplotlib.pyplot as plt
from brightics.common.repr import BrtcReprBuilder, strip_margin, pandasDF2MD, plt2MD, dict2MD
from brightics.function.utils import _model_dict
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
import seaborn as sns
import numpy as np
import matplotlib.cm as cm
from matplotlib.patches import Patch
from brightics.function.validation import validate, greater_than_or_equal_to


def pca(table, group_by=None, **params):
    check_required_parameters(_pca, params, ['table'])
    if group_by is not None:
        grouped_model = _function_by_group(_pca, table, group_by=group_by, **params)
        grouped_model['model']['_grouped_key'] = group_by
        return grouped_model
    else:
        return _pca(table, **params)
    
    
def _pca(table, input_cols, new_column_name='projected_', n_components=None, copy=True, whiten=False, svd_solver='auto',
            tol=0.0, iterated_power='auto', random_state=None, hue=None, alpha=0, key_col=None):
    
    num_feature_cols = len(input_cols)
    if n_components is None:
        n_components = num_feature_cols
    
    validate(greater_than_or_equal_to(n_components, 1, 'n_components'))
        
    pca = PCA(None, copy, whiten, svd_solver, tol, iterated_power, random_state)
    pca_model = pca.fit(table[input_cols])
        
    column_names = []
    for i in range(0, n_components):
        column_names.append(new_column_name + str(i))
    # print(column_names)

    pca_result = pca_model.transform(table[input_cols])
    out_df = pd.DataFrame(data=pca_result[:, :n_components], columns=[column_names])
    
    out_df = pd.concat([table.reset_index(drop=True), out_df], axis=1)
    out_df.columns = table.columns.values.tolist() + column_names
        
    res_components = pca_model.components_
    res_components_df = pd.DataFrame(data=res_components[:n_components], columns=[input_cols])
    res_explained_variance = pca_model.explained_variance_
    res_explained_variance_ratio = pca_model.explained_variance_ratio_
    res_singular_values = pca_model.singular_values_
    res_mean = pca_model.mean_
    res_n_components = pca_model.n_components_
    res_noise_variance = pca_model.noise_variance_
    
    res_get_param = pca_model.get_params()    
    res_get_covariance = pca_model.get_covariance()
    res_get_precision = pca_model.get_precision()
            
    # visualization
    plt.figure()
    if n_components == 1:
        sns.scatterplot(column_names[0], column_names[0], hue=hue, data=out_df)
        plt_two = plt2MD(plt)
        plt.clf()
    else:
        plt_two = _biplot(0, 1, pc_columns=column_names, columns=input_cols, singular_values=res_singular_values,
                          components=res_components, explained_variance_ratio=res_explained_variance_ratio, alpha=alpha,
                          hue=hue, data=out_df, ax=plt.gca(), key_col=key_col)

    plt.figure()
    fig_scree = _screeplot(res_explained_variance, res_explained_variance_ratio, n_components)
    
    table_explained_variance = pd.DataFrame(res_explained_variance, columns=['explained_variance'])
    table_explained_variance['explained_variance_ratio'] = res_explained_variance_ratio
    table_explained_variance['cum_explained_variance_ratio'] = res_explained_variance_ratio.cumsum()
                
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ## PCA Result
    | ### Plot
    | {image1}
    |
    | ### Explained Variance
    | {fig_scree}
    | {table_explained_variance}    
    |
    | ### Components
    | {table2}
    |
    | ### Parameters
    | {parameter1}
    """.format(image1=plt_two,
               fig_scree=fig_scree,
               table_explained_variance=pandasDF2MD(table_explained_variance),
               parameter1=dict2MD(res_get_param),
               table2=pandasDF2MD(res_components_df)
               )))        
    
    model = _model_dict('pca')
    model['components'] = res_components
    model['explained_variance'] = res_explained_variance
    model['explained_variance_ratio'] = res_explained_variance_ratio
    model['singular_values'] = res_singular_values
    model['mean'] = res_mean
    model['n_components'] = res_n_components
    model['noise_variance'] = res_noise_variance
    model['parameters'] = res_get_param
    model['covariance'] = res_get_covariance
    model['precision'] = res_get_precision
    model['_repr_brtc_'] = rb.get()
    model['pca_model'] = pca_model
    model['input_cols'] = input_cols
    
    return {'out_table': out_df, 'model' : model}


def _screeplot(explained_variance, explained_variance_ratio, n_components, ax=None):
    if ax is None:
        ax = plt.gca()
    
    n_components_range = range(1, len(explained_variance) + 1)
    cum_explained_variance = explained_variance_ratio.cumsum()
    plt.xticks(n_components_range, n_components_range)
    ax.plot(n_components_range, explained_variance, 'o--')
    ax.set_ylabel('Explained Variance')
    
    ax2 = ax.twinx()
    ax2.plot(n_components_range, cum_explained_variance, 'x-')
    ax2.set_ylim([0, 1.05])
    ax2.set_ylabel('Cumulative Explained Variance Ratio')
    ax2.text(n_components, cum_explained_variance[n_components - 1] - 0.05, '%0.4f' % cum_explained_variance[n_components - 1], va='center', ha='center')
    fig_scree = plt2MD(plt)
    plt.clf()
    return fig_scree


def _biplot(xidx, yidx, data, pc_columns, columns, singular_values, components,
            explained_variance_ratio, alpha=1, ax=None, hue=None, key_col=None):
    if ax is None:
        ax = plt.gca()
    
    xs = data[pc_columns[xidx]] * singular_values[xidx] ** alpha
    ys = data[pc_columns[yidx]] * singular_values[yidx] ** alpha
    
    if key_col is not None and hue is not None:
        groups = data[hue].unique()
        k = len(data[hue].unique())
        colors = cm.viridis(np.arange(k).astype(float) / k)
        for j, color in zip(range(k), colors):
            group_data = data[data[hue] == groups[j]]
            for idx in group_data.index:
                ax.text(xs[idx], ys[idx], data[key_col][idx], color=color, va='center', ha='center')
        ax.legend([Patch(color=colors[i]) for i, _ in enumerate(groups)], groups.tolist())
    elif key_col is not None and hue is None:
        for i in range(data.shape[0]):
            ax.text(xs[i], ys[i], data[key_col][i], color='black', va='center', ha='center')
    elif hue is not None:
        sns.scatterplot(xs, ys, hue=data[hue], data=data, ax=ax)
    else:
        sns.scatterplot(xs, ys, data=data, ax=ax)
        
    ax.set_xlabel('%s (%0.4f)' % (pc_columns[xidx], explained_variance_ratio[xidx]))
    ax.set_ylabel('%s (%0.4f)' % (pc_columns[yidx], explained_variance_ratio[yidx]))
    
    axs = components[xidx] * singular_values[xidx] ** (1 - alpha)
    ays = components[yidx] * singular_values[yidx] ** (1 - alpha)
    
    xmax = np.amax(np.concatenate((xs, axs * 1.5)))
    xmin = np.amin(np.concatenate((xs, axs * 1.5)))
    ymax = np.amax(np.concatenate((ys, ays * 1.5)))
    ymin = np.amin(np.concatenate((ys, ays * 1.5)))
    
    for i, col in enumerate(columns):
        x, y = axs[i], ays[i]
        ax.arrow(0, 0, x, y, color='r', width=0.001, head_width=0.05)
        ax.text(x * 1.3, y * 1.3, col, color='r', ha='center', va='center')
    
    ys, ye = ax.get_ylim()
    xs, xe = ax.get_xlim()

    m = 1.2
    ax.set_xlim(xmin * m, xmax * m)
    ax.set_ylim(ymin * m, ymax * m)
    
    # plt.title('PCA result with two components')
    # plt.show()
    plt_two = plt2MD(plt)
    plt.clf()
    
    return plt_two


def pca_model(table, model, group_by=None, **params):
    check_required_parameters(_pca_model, params, ['table', 'model'])
    if '_grouped_key' in model:
        group_by = model['_grouped_key']
        return _function_by_group(_pca_model, table, model, group_by=group_by, **params)
    else:
        return _pca_model(table, model, **params)
    

def _pca_model(table, model, new_column_name='projected_'):
    new_col_names = []
    for i in range(0, model['n_components']):
        new_col_names.append(new_column_name + str(i))
    pca_result = model['pca_model'].transform(table[model['input_cols']])
    out_table = pd.concat([table.reset_index(drop=True), pd.DataFrame(data=pca_result, columns=[new_col_names])], axis=1)
    out_table.columns = table.columns.values.tolist() + new_col_names
    
    return {'out_table' : out_table}
