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

from .correlation import correlation
from .pairplot import pairplot
from .anova import bartletts_test
from .anova import oneway_anova
from .anova import twoway_anova
from .anova import tukeys_range_test
from .ttest import one_sample_ttest
from .ttest import two_sample_ttest_for_stacked_data
from .ttest import paired_ttest
from .ftest import ftest_for_stacked_data
from .chi_square_test import chi_square_test_of_independence
from .summary import statistic_summary, statistic_derivation, string_summary
from .cross_table import cross_table
from .cross_table import cross_table2
from .levene import levenes_test
from .duncan_test import duncan_test
from .ljung_box_test import ljung_box_test
from .mann_whitney_test import mann_whitney_test
from .wilcoxon_test import wilcoxon_test
from .wilcoxon_test2 import wilcoxon_test2
from .friedman_test import friedman_test
from .kruskal_wallis_test import kruskal_wallis_test
from .normality_test import normality_test
from .kernel_density_estimation import kernel_density_estimation
