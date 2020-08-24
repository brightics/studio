from pandas.util.testing import assert_frame_equal
import numpy as np


# noinspection PyPep8Naming
def table_cmp(sql, query_res, ref_table=None, print_dfs=False,
              check_dtype=False, ignore_index=True, check_row_order=True,
              ignore_field_upper_lower=True, replace_NaN_to_None=True):
    if print_dfs:
        print("")
        print("=== sql statement ===")
        print(sql)
        print("=== query result ===")
        print(query_res)
        print("=== refrence ===")
        if ref_table is not None:
            print(ref_table)
        else:
            print("No reference table.")

    if ref_table is None:
        print("Reference table not specified. Pass.")
        return

    if replace_NaN_to_None:
        query_res.replace({np.NaN: None}, inplace=True)
        ref_table.replace({np.NaN: None}, inplace=True)

    if ignore_field_upper_lower:
        query_res.columns = [f.upper() for f in query_res.columns]
        ref_table.columns = [f.upper() for f in ref_table.columns]

    if ignore_index:
        if check_row_order:
            assert_frame_equal(
                query_res.reset_index(drop=True),
                ref_table.reset_index(drop=True),
                check_dtype=check_dtype)
        else:
            # noinspection PyUnresolvedReferences
            assert_frame_equal(
                query_res.sort_values(
                    by=query_res.columns.tolist()).reset_index(drop=True),
                ref_table.sort_values(
                    by=ref_table.columns.tolist()).reset_index(drop=True),
                check_dtype=check_dtype)

    else:
        assert_frame_equal(query_res, ref_table, check_dtype=check_dtype)
