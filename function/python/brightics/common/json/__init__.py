def to_json(data, for_redis=False):
    from .encoder import encode
    return encode(data, for_redis)


def from_json(json_str):
    from .decoder import decode
    return decode(json_str)
