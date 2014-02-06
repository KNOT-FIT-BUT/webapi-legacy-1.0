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
        self.asset_manger = core.getManager("asset")
        
    @cherrypy.tools.json_out()
    def GET(self, *flags, **kw):
        '''
        Return info about KB. Info type is determined by flags variable
        @flags - contains url parameters 
        @return - data JSON with info about KB 
        '''
        if "reload" in flags:
            pass
            #reload from folder
        elif "loaded" in flags:
            pass
            #return list of loaded KBs
        else:
            return self.asset_manger.getStatus()
            
    
    @cherrypy.tools.json_out()
    def POST(self, *flags, **kw):
        pass
        
    @cherrypy.tools.json_out()
    def PUT(self, kbname):
        '''
        Add KB to load queue.
        @kbname - KB filename without extension
        '''
        self.asset_manger.loadKB(kbname)
        pass
        
    @cherrypy.tools.json_out()
    def DELETE(self, kbname):
        '''
        Add KB to unload queue.
        @kbname - KB filename without extension.
        '''
        self.asset_manger.dropKB(kbname)
        pass
    
    