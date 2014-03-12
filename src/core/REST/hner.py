# -*- coding: utf-8 -*-
'''
Created on 28. 10. 2013

@author: xjerab13
'''

import cherrypy


from ner import recognize
import os
import json
from core.adapters import *


class NERHandler():
    '''
    NERHandler serve data about available KB for NER and parsing text via NER tool.
    '''

    exposed = True
    def __init__(self, core):
        '''
        @ore - instance of main Core class.
        '''
        self.core = core
        self.kb_manager = core.getManager("kb")
        self.proc_manager = core.getManager("proc")
        self.asset_manger = core.getManager("asset")
        
    @cherrypy.tools.json_out()
    def GET(self, *flags, **kw):
        '''
        On GET return info about all available KB.
        '''
        kblist = self.asset_manger.getStatus("ner")
        result = []
        for kb in kblist:
            #if kb["processor"] == "ner":
            result.append({"name":kb["name"],
                       "status": 0 if kb["status"] < 3 else 1
                       })
        return result
    
    
    @cherrypy.tools.json_out()
    def POST(self, *flags, **kw):
        '''
        Paring text via NER tool.
        @return - data JSON to client.
         '''
        txt = kw.get("text").replace(u"–",u"-").replace(u"“",u'"').replace(u"”",u'"')
        kb_name = flags[0] if len(flags) > 0 else None
        error_msg = []
        if txt is None:
            error_msg.append("No input text specified or wrong parameter. Use ?text=")
        if kb_name is None:
            error_msg.append("No Knowledge Base specified!")
        if len(flags) > 0 and len(error_msg) == 0:
            kb = self.asset_manger.getAsset(flags[0],"kb")
            if kb is None:
                error_msg.append("Cant find Knowledge base: " + flags[0])
            elif kb.status < 4:
                error_msg.append("Knowledge base is not loaded! - : " + flags[0])
            else:
                txt = txt+"\n" if not txt.endswith("\n") else txt
                return self.proc_manager.recognize(txt.encode("utf-8"), kb, None)
        
        return {"header":{"status":1,
                            "msg":error_msg  },
                }
            
    
    def PUT(self):
        pass
        
    
    def DELETE(self):
        pass

        
        