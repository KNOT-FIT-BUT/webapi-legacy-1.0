'''
Created on 10.3.2013

@author: Casey
'''

import cherrypy
import json
import os


from ner import recognize
from cherrypy import tools
from core.adapters import parse_result


class Parser():
    
    def __init__(self, core):
        self.kb = core.getManager("kb")
        self.base_folder = core.base_folder
    
    @cherrypy.expose
    @tools.encode(encoding='UTF-8')
    def index(self, text):
        txt = text
        print len(txt.encode('ascii','replace'))
        result = recognize(self.kb, txt.encode('ascii','replace'), False, False)
        rg =  parse_result(result, self.kb, False)
        cherrypy.response.headers['Content-Type'] = "application/json"
        return json.dumps(rg)
        
        #return rg
    
    @cherrypy.expose    
    def testFilesList(self):
        #print os.listdir(os.path.join(os.getcwd(),'test'))
        files = [f for f in os.listdir(os.path.join(self.base_folder,'static','example_texts')) if os.path.isfile(os.path.join(self.base_folder,'static','example_texts',f))]
        cherrypy.response.headers['Content-Type'] = "application/json"
        return json.dumps(files)
    
    @cherrypy.expose
    def testFileContent(self, filename):
        path = os.path.join(self.base_folder,'static','example_texts',filename)
        text = ""
        with open(path,'r') as f:
            text = f.read()
        return text