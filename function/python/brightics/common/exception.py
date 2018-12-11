
class BrighticsCoreException(Exception):
    def __init__(self, code, message):
        super().__init__(code, message)

        self.code = code
        self.message = message
        
    def add_detail_message(self, detailed_cause):
    	self.detailed_cause = detailed_cause
    	return self

class BrighticsFunctionException(Exception):
    def __init__(self, code, params=None):
        super().__init__(code)
        
        self.errors = []
        self.add_error(code, params)

    @classmethod
    def from_errors(cls, errors):
        new_instance = cls('0000')
        new_instance.errors.clear()
        for error in errors :
            for code, params in error.items():
                new_instance.add_error(code, params)
        return new_instance
        
    def add_error(self, code, params=None):
        params_list = params if isinstance(params, list) else [params] if params else []
        self.errors.append({code: params_list})
	
    def add_detail_message(self, detailed_cause):
        self.detailed_cause = detailed_cause
        return self