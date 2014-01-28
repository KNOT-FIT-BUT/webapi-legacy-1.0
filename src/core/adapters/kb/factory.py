'''
Created on 25. 11. 2013

@author: xjerab13
'''
import os
import json
from _basic import KB_Basic
from _ner import KB_NER


class KBFactory():
    '''
    Simple KB factory. Return reference to class by type of tool.
    '''
    factories = {"ner":KB_NER,
                 "figa":KB_Basic
                 }
    
    def __init__(self, base_folder, kb_folder):
        self.base_folder = base_folder
        self.kb_folder = os.path.join(base_folder,kb_folder)
        
        
    def getKB(self, kb_name):
        '''
        Load kb confing from file, instantiate proper class with loaded data.
        @kb_name - KB filename without extension.
        @return - instance of KB_Basic or KB_NER
        '''
        conf = self.__loadKBJson(kb_name)
        factory = conf["conf"]["processor"]
        kb = KBFactory.factories[factory](self.base_folder, self.kb_folder, kb_name)
        kb.kb_conf = conf["conf"]
        kb.kb_columns = conf["columns"]
        #print type(conf["conf"]["value_splitter"])
        return kb
    
    def __loadKBJson(self, kb_name):
        '''
        Load config json from KB confign, parse it and return as dict
        @return - loaded config as dict
        '''
        filename = kb_name + ".json"
        f = open(os.path.join(self.kb_folder, filename))
        conf = json.loads(f.read())
        f.close()
        return conf
        
        
    