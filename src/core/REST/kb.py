'''
Created on 28. 10. 2013

@author: casey
'''
import cherrypy

class KBHandler():
    '''
    classdocs
    '''
    
    exposed = True

    def __init__(self, core):
        '''
        Constructor
        '''
        self.core = core
        self.kbmanager = core.getManager("kb")
        
    @cherrypy.tools.json_out()
    def GET(self, *flags, **kw):
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

        self.kbmanager.load(kbname)
        
    @cherrypy.tools.json_out()
    def DELETE(self, kbname):

        self.kbmanager.unload(kbname)
    
    