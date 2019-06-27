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

import unittest
import numpy as np
import numpy.testing as npt
from brightics.common.datasets import load_iris
from brightics.function.timeseries import timeseries_decomposition


class TestTimeSeriesDecomposition(unittest.TestCase):

    def setUp(self):
        print("*** Time Series Decomposition UnitTest Start ***")
        self.iris = load_iris()

    def tearDown(self):
        print("*** Time Series Decomposition UnitTest End ***")

    def test_time_series_decomposition1(self):
        input_dataframe = self.iris
        
        res = timeseries_decomposition(table=input_dataframe, input_col='sepal_length', frequency=4)['out_table']
        
        print(res)
        
        table = res.values.tolist()
        npt.assert_array_equal(table[0], [5.1, 3.5, 1.4, 0.2, 'setosa', np.NaN, 0.013989771021021011, np.NaN])
        npt.assert_array_equal(table[1], [4.9, 3.0, 1.4, 0.2, 'setosa', np.NaN, -0.0537185623123123, np.NaN])
        npt.assert_array_equal(table[2], [4.7, 3.2, 1.3, 0.2, 'setosa', 4.8125, -0.017128847597597585, -0.09537115240240224])
        npt.assert_array_equal(table[3], [4.6, 3.1, 1.5, 0.2, 'setosa', 4.8625, 0.056857638888888874, -0.3193576388888891])
        npt.assert_array_equal(table[4], [5.0, 3.6, 1.4, 0.2, 'setosa', 4.9125000000000005, 0.013989771021021011, 0.07351022897897845])
        
        
    def test_time_series_decomposition2(self):
        input_dataframe = self.iris
        
        res = timeseries_decomposition(table=input_dataframe, input_col='sepal_length', frequency=4, model_type='multiplicative', filteration=[0.25, 0.5, 0.25], two_sided=False, extrapolate_trend=4)['out_table']
        
        print(res)
        
        table = res.values.tolist()
        npt.assert_array_equal(table[0], [5.1, 3.5, 1.4, 0.2, 'setosa', 4.179999999999994, 1.000622730612832, 1.2193363756914233])
        npt.assert_array_equal(table[1], [4.9, 3.0, 1.4, 0.2, 'setosa', 4.234499999999995, 0.9880047985824841, 1.1712103158501297])
        npt.assert_array_equal(table[2], [4.7, 3.2, 1.3, 0.2, 'setosa', 4.41, 1.0008477641165767, 1.064856889727808])
        npt.assert_array_equal(table[3], [4.6, 3.1, 1.5, 0.2, 'setosa', 4.255000000000001, 1.010524706688107, 1.069821523339311])
        npt.assert_array_equal(table[4], [5.0, 3.6, 1.4, 0.2, 'setosa', 4.265, 1.000622730612832, 1.1716033492839903])


if __name__ == '__main__':
    unittest.main()
