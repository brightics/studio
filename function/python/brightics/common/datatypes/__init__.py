import hashlib

BRTC_CODE = hashlib.sha1('brightics-studio v1.0'.encode('utf-8')).hexdigest().encode() #83c78ba730ba09fa13c8559f2a616e887005e021
BRTC_CODE_SIZE = len(BRTC_CODE) # 40
