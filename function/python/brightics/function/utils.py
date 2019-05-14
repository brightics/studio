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

from brightics.common.repr import pandasDF2MD


def _model_dict(_type):
    return {'_type':_type, '_context':'python', '_version': 3.6}


def dataframe_to_md(table, n=20, precision=None, max_width=None):
    return pandasDF2MD(table, num_rows=n)

# if __name__ == "__main__":
#     df = pd.DataFrame(np.random.random([1000,3]), columns=['A', 'B', 'C'])
#     df['D'] = 'A92083r5uawhef;awshed;fkawjs;dfkglasd'
#     print(dataframe_to_md(df, precision=6, max_width=20))
