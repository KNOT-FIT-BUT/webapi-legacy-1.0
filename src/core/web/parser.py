'''
Created on 10.3.2013

@author: xjerab13
'''

import cherrypy
import json
import os


from ner import recognize
from cherrypy import tools
from core.adapters import parse_result


class Parser():
    '''
    Parser class, handling requests for "/parser"
    '''
    def __init__(self, core):
        self.kb = core.getManager("kb")
        self.base_folder = core.base_folder
    
    @cherrypy.expose
    @tools.encode(encoding='UTF-8')
    def index(self, text):
        '''
        Handling request for "/parser"
        @text - string contains data from ?=text http argument
        '''
        txt = text
        print len(txt.encode('ascii','replace'))
        result = recognize(self.kb, txt.encode('ascii','replace'), False, False)
        rg =  parse_result(result, self.kb, False)
        cherrypy.response.headers['Content-Type'] = "application/json"
        return json.dumps(rg)
        
        #return rg
    
    @cherrypy.expose    
    def testFilesList(self):
        '''Retrun json of aviable text files for quick testing'''
        #print os.listdir(os.path.join(os.getcwd(),'test'))
        files = [f for f in os.listdir(os.path.join(self.base_folder,'static','example_texts')) if os.path.isfile(os.path.join(self.base_folder,'static','example_texts',f))]
        cherrypy.response.headers['Content-Type'] = "application/json"
        return json.dumps(files)
    
    @cherrypy.expose
    def testFileContent(self, filename):
        '''
        Return content of texting file.
        @filename - name of testing file for load
        @return - content of filename
        '''
        path = os.path.join(self.base_folder,'static','example_texts',filename)
        text = ""
        with open(path,'r') as f:
            text = f.read()
        return text