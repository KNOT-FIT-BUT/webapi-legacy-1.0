'''
Pakage contains group of class for handling REST API requests. 
'''
import cherrypy


from ner import recognize
import os
import json

from core.adapters import *
from core.REST.figa import FigaHandler
from core.REST.hner import NERHandler
from core.REST.kb import KBHandler

class RESTService():
    '''
    Core class for handling http request and building substructure of REST API.
    '''
    exposed = True
    
    def __init__(self, core):
        '''
        Inintialize class. 
        @core - insgtance of main Core class
        '''
        self.base_folder = core.base_folder
        self.kbmanager = core.getManager("kb")
        self.kb = KBHandler(core)
        self.figa = FigaHandler(core)
        self.ner = NERHandler(core)
        

    @cherrypy.tools.json_out()
    def GET(self, *flags, **kw):
        return self.handle_request(*flags, **kw)
    
    @cherrypy.tools.json_out()
    def POST(self, *flags, **kw):
        return self.handle_request(*flags, **kw)
        
    
    def PUT(self):
        pass
        
    
    def DELETE(self):
        pass
    
    
    def handle_request(self, *flags, **kw):
        '''Deprecated'''
        txt = kw.get("text")
        kb = self.kbmanager.getKB("KBstatsMetrics")
        result = recognize(kb, txt.encode("utf-8"), False, False)
        rg =  parse_result(result, kb, 'classic')
        return rg
        
        
    
    
    
    
