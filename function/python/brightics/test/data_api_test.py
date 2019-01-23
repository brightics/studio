from brightics.brightics_data_api import put_data, get_data_info


class SampleFunction(object):

    def test_add_data(self, key, data, label):
        put_data(key, data, label)

    def test_get_status(self, key):
        return get_data_info(key)
