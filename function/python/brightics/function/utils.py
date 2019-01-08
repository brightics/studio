from brightics.common.repr import pandasDF2MD


def _model_dict(_type):
    return {'_type':_type, '_context':'python', '_version': 3.6}


def dataframe_to_md(table, n=20, precision=None, max_width=None):
    return pandasDF2MD(table, num_rows=n)

# if __name__ == "__main__":
#     df = pd.DataFrame(np.random.random([1000,3]), columns=['A', 'B', 'C'])
#     df['D'] = 'A92083r5uawhef;awshed;fkawjs;dfkglasd'
#     print(dataframe_to_md(df, precision=6, max_width=20))
