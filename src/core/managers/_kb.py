'''
Created on 28. 10. 2013

@author: casey
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
    classdocs
    '''


    def __init__(self, base_folder, kb_relative):
        '''
        Constructor
        '''
        threading.Thread.__init__(self)
        self.base_folder = base_folder
        self.kb_folder = os.path.join(base_folder, kb_relative)
        self.kb_list = {}
        self.kb_online = []
        self.do = threading.Event()
        self.quit = threading.Event()
        self.load_qeue = deque()
        self.kb_factory = KBFactory(base_folder, kb_relative)
        self.__loadKBListFromFolder()
        #print [self.kb_list[k].get_stats() for k in self.kb_list.keys()]
    
    def run(self):
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
        files = [os.path.splitext(f) for f in os.listdir(self.kb_folder) if os.path.isfile(os.path.join(self.kb_folder,f))]
        for filename in set(files):
            if filename[1] == ".kb":
                self.kb_list[filename[0]] = self.kb_factory.getKB(filename[0])
        
    def reloadKBListFromFolder(self):
        files = [os.path.splitext(f) for f in os.listdir(self.kb_folder) if os.path.isfile(os.path.join(self.kb_folder,f))]
        for kb_name in self.kb_list.keys():
            if self.kb_list[kb_name].status == 0:
                del self.kb_list[kb_name]
                
        for filename in set(files):
            if filename[1] == ".kb" and filename[0] not in self.kb_list.keys():
                self.kb_list[filename[0]] = self.kb_factory.getKB(filename[0]) 
                
            
    
    def getAvailable(self):
        return self.kb_list.keys()
    
    def getLoaded(self):
        return self.kb_online
    
    def getStatus(self):
        return [self.kb_list[k].get_stats() for k in self.kb_list.keys()]
    
    def getUnloaded(self):
        pass
    
    def load(self, kb_name):
        if kb_name in self.kb_list.keys():
            if not self.kb_list[kb_name].status > 0:
                self.kb_list[kb_name].status = KB_Basic.QUEUED
                self.load_qeue.appendleft(kb_name)
                self.do.set()
            
    
    def unload(self, kb_name):
        if kb_name in self.load_qeue:
            self.load_qeue.remove(kb_name)
        if kb_name in self.kb_list.keys():
            self.kb_list[kb_name].drop()
        if kb_name in self.kb_online: 
            self.kb_online.remove(kb_name)
        
            
    def stop(self):
        self.quit.set()
        self.join()
        
    def getKB(self, kb_name):
        if kb_name in self.kb_list.keys():
            return self.kb_list[kb_name]
        else:
            return None
        
    def autoload(self):
        for kb_name in self.kb_list.keys():
            if self.kb_list[kb_name].preload():
                self.load(kb_name);
            
        
    
    
    

        
    
    
    
