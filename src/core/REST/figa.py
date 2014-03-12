# -*- coding: utf-8 -*-
'''
Created on 23. 10. 2013

@author: xjerab13
'''
import os
import cherrypy


class FigaHandler():
    '''
    Figa handler server data about aviable FSA automas and parse text via figa tool.
    '''

    exposed = True
    
    def __init__(self, core):
        '''
        @core - instance of main Core class
        '''
        self.core = core

        self.proc_manager = core.getManager("proc")
        self.asset_manger = core.getManager("asset")
        
    @cherrypy.tools.json_out()
    def GET(self, *flags, **kw):
        '''
        On GET request return json with info about available FSA automats for use.
        @return - JSON to client 
        '''
        fsalist = self.asset_manger.getAssetList("fsa")
        kblist = self.asset_manger.getLoaded()
        result = []
        for fsa in fsalist:
            kbo = 0
            if fsa in kblist:
                kbo = 1
            result.append({"name":fsa,
                          "status": kbo
                        })
        return result
        
    
    @cherrypy.tools.json_out()
    def POST(self, *flags, **kw):
        '''
        Performin text parsing via figa tool.
        '''
        txt = kw.get("text").replace("–","-").replace("“",'"').replace("”",'"')
        kb_name = flags[0] if len(flags) > 0 else None
        error_msg = []
        
        if txt is None:
            error_msg.append("No input text specified or wrong parameter. Use ?text=")
        if kb_name is None:
            error_msg.append("No Knowledge Base / FSA specified!")
        if len(flags) > 0 and len(error_msg) == 0:
            kb, fsa = self.asset_manger.getAsset(flags[0])
            if fsa is None:
                error_msg.append("Cant find FSA: " + flags[0])
            if kb is None:
                error_msg.append("Cant find Knowledge base: " + flags[0])
            elif kb.status < 4:
                error_msg.append("Knowledge base is not loaded! - : " + flags[0])
            else:
                txt = txt+"\n" if not txt.endswith("\n") else txt
                return self.proc_manager.recognize(txt.encode("utf-8"), kb, fsa)
            #result = recognize(kb, txt.encode("utf-8"), False, False)
            #rg =  parse_result(result, kb, 'classic')
        return {"header":{"status":1,
                            "msg":error_msg  },
                }
        
    @cherrypy.tools.json_out()
    def PUT(self, kbname):
        '''
        Unused.
        '''
        pass
        
    @cherrypy.tools.json_out()
    def DELETE(self, kbname):
        '''
        Unused
        '''
        pass
    
        