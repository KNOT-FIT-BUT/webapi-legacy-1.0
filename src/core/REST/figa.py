'''
Created on 23. 10. 2013

@author: casey
'''
import os
import cherrypy


class FigaHandler():
    '''
    classdocs
    '''

    exposed = True
    
    def __init__(self, core):
        '''
        Constructor
        '''
        self.core = core
        self.fsa_manager = core.getManager("fsa")
        self.kb_manager = core.getManager("kb")
        self.proc_manager = core.getManager("proc")
        
    @cherrypy.tools.json_out()
    def GET(self, *flags, **kw):
        fsalist = self.fsa_manager.getFSAList()
        kblist = self.kb_manager.getLoaded()
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
        txt = kw.get("text")
        kb_name = flags[0] if len(flags) > 0 else None
        error_msg = []
        if txt is None:
            error_msg.append("No input text specified or wrong parameter. Use ?text=")
        if kb_name is None:
            error_msg.append("No Knowledge Base / FSA specified!")
        if len(flags) > 0:
            kb = self.kb_manager.getKB(flags[0])
            fsa = self.fsa_manager.getFSA(flags[0])
            if fsa is None:
                error_msg.append("Cant find FSA: " + flags[0])
            if kb is None:
                error_msg.append("Cant find Knowledge base: " + flags[0])
            elif kb.status < 4:
                error_msg.append("Knowledge base is not loaded! - : " + flags[0])
            else:
                return self.proc_manager.recognize(txt.encode("utf-8"), kb, fsa)
            #result = recognize(kb, txt.encode("utf-8"), False, False)
            #rg =  parse_result(result, kb, 'classic')
        return {"header":{"status":1,
                            "msg":error_msg  },
                }
        
    @cherrypy.tools.json_out()
    def PUT(self, kbname):
        pass
        
    @cherrypy.tools.json_out()
    def DELETE(self, kbname):
        pass
    
        