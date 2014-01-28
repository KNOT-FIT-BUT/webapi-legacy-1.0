'''
Created on 22. 1. 2014

@author: casey
'''

import cherrypy
from core.REST.kb import KBHandler

class AssetHandler(object):
    '''
    classdocs
    '''
        
    exposed = True
    
    def __init__(self, core):
        '''
        @core - instance of main Core class
        '''
        self.core = core
        self.asset_manger = core.getManager("asset")
        self.kb = None
        self.fsa = None
        self.texts = None
        
    @cherrypy.tools.json_out()
    def GET(self, *flags, **kw):
        return []
        
    
    @cherrypy.tools.json_out()
    def POST(self, *flags, **kw):
        pass
        
    @cherrypy.tools.json_out()
    def PUT(self, kbname):
        pass
        
    @cherrypy.tools.json_out()
    def DELETE(self, kbname):
        pass