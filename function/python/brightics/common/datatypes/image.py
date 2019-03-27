import io
import struct

import numpy as np

from brightics.common.datatypes import BRTC_CODE, BRTC_CODE_SIZE


class Image(object):
    _data_type = 0
    _header_format = '<{}sBIII'.format(BRTC_CODE_SIZE)
    _pack_format = ''.join([_header_format, 'I{}s', 'I{}s', 'I{}s'])

    def __init__(self, arr, origin=None, mode=None):
        if len(arr.shape) == 2:
            self.height, self.width = arr.shape
            self.n_channels = 1
            self.data = arr.reshape(self.height, self.width, 1)
        elif len(arr.shape) == 3:
            self.height, self.width, self.n_channels = arr.shape
            self.data = arr
        else:
            raise Exception("Unknown shape.")

        self.origin = None
        self.mode = 'BGR'
        if origin is not None:
            self.origin = origin
        if mode is not None:
            self.mode = mode

    def tobytes(self):
        '''
        brtc_code(40)::data_type(1)::height(4)::width(4)::n_channels(4)::
        mode_size(4)::mode(mode_size)::
        origin_size(4)::origin(origin_size)::
        data_size(4)::data(data_size)
        '''
        data_bytes = self.data.tobytes()
        data_size = len(data_bytes)
        origin_bytes = self.origin.encode('utf-8')
        origin_size = 1 if origin_bytes is None else len(origin_bytes)

        mode_bytes = self.mode.encode('utf-8')
        mode_bytes_size = len(mode_bytes)
        pack_format = self._pack_format.format(mode_bytes_size, origin_size, data_size)

        return struct.pack(pack_format,
                           BRTC_CODE, self._data_type, self.height, self.width, self.n_channels,
                           mode_bytes_size, mode_bytes,
                           origin_size, origin_bytes,
                           data_size, data_bytes)

    @classmethod
    def from_bytes(cls, b):
        buf = io.BytesIO(b)
        brtc_code, data_type, height, width, n_channels = \
            struct.unpack(cls._header_format, buf.read(BRTC_CODE_SIZE + 1 + 4 + 4 + 4))
        if brtc_code != BRTC_CODE:
            raise Exception("Unknown data")
        if data_type != cls._data_type:
            raise Exception('This is not an Image')
        mode_size = struct.unpack('<I', buf.read(4))[0]
        mode = struct.unpack('<{}s'.format(mode_size), buf.read(mode_size))[0].decode('utf-8')
        origin_size = struct.unpack('<I', buf.read(4))[0]
        origin = struct.unpack('<{}s'.format(origin_size), buf.read(origin_size))[0].decode('utf-8')
        data_size = struct.unpack('<I', buf.read(4))[0]
        data = np.frombuffer(struct.unpack('<{}s'.format(data_size),
                                           buf.read(data_size))[0], np.uint8).reshape(height, width, n_channels)

        return Image(data, origin, mode)

    @classmethod
    def is_image(cls, b):

        if not isinstance(b, bytes):
            return False

        if len(b) < 41:
            return False

        bio = io.BytesIO(b)
        header, tp = struct.unpack('40sB', bio.read(41))
        return header == BRTC_CODE and tp == 0
