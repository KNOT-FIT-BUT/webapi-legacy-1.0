'''
Pakage contains group of class for handling webpage requests. 
'''


from core.web.parser import Parser

class Root():
    '''
    Root page, handling all request for "/" path.
    '''
    

    def __init__(self, core):
        '''
        @core - instance of main core class.
        '''
        self.core = core
        self.parser = Parser(core)

    
    