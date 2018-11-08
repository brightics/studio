import brightics.common.json as data_json
from brightics.brightics_java_gateway import brtc_java_gateway as gateway


class KVStoreClient:
    @staticmethod
    def set(key, data):
        gateway.put_kv_data(key, data_json.to_json(data, for_redis=True))

    @staticmethod
    def get(key):
        return data_json.from_json(gateway.get_kv_data(key))
