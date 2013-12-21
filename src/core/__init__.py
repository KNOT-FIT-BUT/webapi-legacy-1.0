'''
Created on 28. 10. 2013

@author: casey
'''
import os
from core.managers._kb import KBManager
from core.managers._figa import FSAManager
from core.managers.kb._processor import ProcesssorManager


class Core(object):
    '''
    classdocs
    '''


    def __init__(self, base_folder):
        '''
        Constructor
        '''
        self.base_folder = base_folder
        self.managers = {}

    
    def loadConfig(self, filename):
        self.kb_folder = os.path.join("api","automats")
        self.fsa_folder = os.path.join("api","automats")
    
    def initManagers(self):
        self.addManager("kb", KBManager(self.base_folder, self.kb_folder))
        self.addManager("fsa", FSAManager(self.base_folder, self.fsa_folder))
        self.addManager("proc", ProcesssorManager())


    def addManager(self, name, instance):
        self.managers[name] = instance
        
    def getManager(self, name):
        if name in self.managers.keys():
            return self.managers[name]
        
    def delManager(self, name):
        if name in self.managers.keys():
            del self.managers[name]
        
    def getConf(self, key, section):
        pass
    
    
    
    
        
        
        
        
        