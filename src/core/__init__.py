'''
Created on 28. 10. 2013

@author: xjerab13
'''
import os
from core.managers._kb import KBManager
from core.managers._figa import FSAManager
from core.managers._processor import ProcesssorManager
from core.managers._assets import AssetsManager

class Core(object):
    '''
    Core is a main class containing and controling Knowledge base and FSA managers. 
    '''


    def __init__(self, base_folder):
        '''
        @base_folder - absolute path to project folder. Requied for proper managers init.
        '''
        self.base_folder = base_folder
        self.managers = {}

    
    
    def loadConfig(self, filename):
        '''
        loading paths to KB and FSA folders from config. Config is not used yet, so paths are hardcoded.
        @filename - absolute path to config.ini. Unused.
        '''
        self.kb_folder = os.path.join("api","automats")
        self.fsa_folder = os.path.join("api","automats")
        self.asset_folder = os.path.join("api","automats")
    
    def initManagers(self):
        '''
        Initialize all managers core managers.
        '''
        #self.addManager("kb", KBManager(self.base_folder, self.kb_folder))
        #self.addManager("fsa", FSAManager(self.base_folder, self.fsa_folder))
        self.addManager("proc", ProcesssorManager())
        self.addManager("asset", AssetsManager(self.base_folder, self.asset_folder))


    def addManager(self, name, instance):
        '''
        Add manager class into internal storage.
        '''
        self.managers[name] = instance
        
    def getManager(self, name):
        '''
        Return manager by name
        @name - manager name key
        @return - instance of manager
        '''
        if name in self.managers.keys():
            return self.managers[name]
        else:
            return None
        
    def delManager(self, name):
        '''
        Delete manager instance by name from internal storage.
        @name - manager name key
        
        '''
        if name in self.managers.keys():
            del self.managers[name]
        
    def getConf(self, key, section):
        '''
        Unused. Shall return key=value tuple from parsed configuration ini file.
        '''
        pass
    
    
    
    
        
        
        
        
        