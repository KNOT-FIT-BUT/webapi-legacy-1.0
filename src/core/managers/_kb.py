'''
Created on 28. 10. 2013

@author: xjerab13
'''

import os, gc
import threading
import glob
from core.adapters.kb import KB_Basic
import time
from core.adapters.kb.factory import KBFactory
from collections import deque

class KBManager(threading.Thread):
    '''
    KBManager coinstains and manage loading and unloading of available KB.
    '''


    def __init__(self, base_folder, kb_relative):
        '''
        @base_folder - absolute path to program folder
        @kb_relative - relative path to KB folder
        '''
        threading.Thread.__init__(self)
        self.base_folder = base_folder
        self.kb_folder = os.path.join(base_folder, kb_relative)
        self.kb_list = {}
        
        self.do = threading.Event()
        self.quit = threading.Event()
        self.kb_online = []
        self.load_qeue = deque()
        self.kb_factory = KBFactory(base_folder, kb_relative)
        self.__loadKBListFromFolder()
        #print [self.kb_list[k].get_stats() for k in self.kb_list.keys()]
    
    def run(self):
        '''
        !!! MAIN THREAD LOOP. DO NOT CALL, USE .start() METHOD INSTEAD !!!
        '''
        self.quit.clear()
        self.do.clear()
        while not self.quit.isSet():
            if self.do.isSet():
                while len(self.load_qeue) > 0:
                    k = self.load_qeue.pop()
                    self.kb_list[k].load()
                    self.kb_online.append(k)
                self.do.clear()
            time.sleep(1)
                    
    
    def __loadKBListFromFolder(self):
        '''
        Private, load list of files with .kb extension.
        '''
        files = [os.path.splitext(f) for f in os.listdir(self.kb_folder) if os.path.isfile(os.path.join(self.kb_folder,f))]
        for filename in set(files):
            if filename[1] == ".kb":
                self.kb_list[filename[0]] = self.kb_factory.getKB(filename[0])
        
    def reloadKBListFromFolder(self):
        '''
        Reload and reinitiate KB list from folder. 
        
        '''
        #TODO: fix - only loaded KBs will be untouched, others should be deleted and reiniated from folder.
        files = [os.path.splitext(f) for f in os.listdir(self.kb_folder) if os.path.isfile(os.path.join(self.kb_folder,f))]
        for kb_name in self.kb_list.keys():
            if self.kb_list[kb_name].status == 0:
                del self.kb_list[kb_name]
                
        for filename in set(files):
            if filename[1] == ".kb" and filename[0] not in self.kb_list.keys():
                self.kb_list[filename[0]] = self.kb_factory.getKB(filename[0]) 
                
            
    
    def getAvailable(self):
        '''
        @return - list of KB names of availible KBs
        '''
        return self.kb_list.keys()
    
    def getLoaded(self):
        '''
        @return - list of names of loaded KB 
        '''
        return self.kb_online
    
    def getStatus(self):
        '''
        @return - complete info about all KBs
        '''
        return [self.kb_list[k].get_stats() for k in self.kb_list.keys()]
    
    def getUnloaded(self):
        pass
    
    def load(self, kb_name):
        '''
        Add kb to load queue
        @kb_name - name of kb for load
        '''
        if kb_name in self.kb_list.keys():
            if not self.kb_list[kb_name].status > 0:
                self.kb_list[kb_name].status = KB_Basic.QUEUED
                self.load_qeue.appendleft(kb_name)
                self.do.set()
            
    
    def unload(self, kb_name):
        '''
        Unload KB from memory and mark as unloaded.
        @kb_name - name of KB for unload.
        '''
        if kb_name in self.load_qeue:
            self.load_qeue.remove(kb_name)
        if kb_name in self.kb_list.keys():
            self.kb_list[kb_name].drop()
        if kb_name in self.kb_online: 
            self.kb_online.remove(kb_name)
        
            
    def stop(self):
        '''
        Secure thread end.
        '''
        self.quit.set()
        self.join()
        
    def getKB(self, kb_name):
        '''
        @kb_name - name of KB filename without extension
        @return - instance of KB or None
        '''
        if kb_name in self.kb_list.keys():
            return self.kb_list[kb_name]
        else:
            return None
        
    def autoload(self):
        '''
        Add all KB marked for autoload to load queue.
        '''
        for kb_name in self.kb_list.keys():
            if self.kb_list[kb_name].preload():
                self.load(kb_name);
            
        
    
    
    

        
    
    
    
