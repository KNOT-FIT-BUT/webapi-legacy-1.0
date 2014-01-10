'''
Created on 28. 10. 2013

@author: xjerab13
'''
import cherrypy

class KBHandler():
    '''
    KBHandler controling and server info about available Knowledge Bases
    '''
    
    exposed = True

    def __init__(self, core):
        '''
        @core - instance of main Core class
        '''
        self.core = core
        self.kbmanager = core.getManager("kb")
        
    @cherrypy.tools.json_out()
    def GET(self, *flags, **kw):
        '''
        Return info about KB. Info type is determined by flags variable
        @flags - contains url parameters 
        @return - data JSON with info about KB 
        '''
        if "reload" in flags:
            self.kbmanager.reloadKBListFromFolder()  
            return self.kbmanager.getStatus()
        elif "loaded" in flags:
            return self.kbmanager.kb_online
        else:
            return self.kbmanager.getStatus()
    
    @cherrypy.tools.json_out()
    def POST(self, *flags, **kw):
        pass
        
    @cherrypy.tools.json_out()
    def PUT(self, kbname):
        '''
        Add KB to load queue.
        @kbname - KB filename without extension
        '''
        self.kbmanager.load(kbname)
        
    @cherrypy.tools.json_out()
    def DELETE(self, kbname):
        '''
        Add KB to unload queue.
        @kbname - KB filename without extension.
        '''
        self.kbmanager.unload(kbname)
    
    