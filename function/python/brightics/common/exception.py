
class BrighticsCoreException(Exception):
    def __init__(self, code, message):
        super().__init__(code, message)

        self.code = code
        self.message = message
