'''
Created on 20. 1. 2014

@author: casey
'''
import os
import cherrypy
import json
import traceback
import sys
import time

from threading import Thread, Event
from collections import deque

from core.adapters.kb.factory import KBFactory
from core.adapters._fsa import FSA
from core.adapters.kb._ner import KB_NER
from core.adapters.kb._basic import KB_Basic

class AssetsManager(Thread):
    '''
    classdocs
    '''
    

    def __init__(self, base_folder, asset_folder):
        '''
        Constructor
        '''
        Thread.__init__(self)
        self.kb_list = {}
        self.fsa_list = {}
        self.conf_list = {}
        self.base_folder = base_folder
        self.asset_folder = asset_folder if os.path.isabs(asset_folder) else os.path.join(base_folder,asset_folder)
        self.kb_factory = KBFactory(self.base_folder,self.asset_folder)
        self.do = Event()
        self.quit = Event()
        self.kb_online = []
        self.load_qeue = deque()
        
        
    def loadFromFolder(self, folder):
        files = [f for f in os.listdir(folder) if os.path.isfile(os.path.join(folder,f))]
        for filename in set(files):
            asset_name, extension = os.path.splitext(filename)
            if extension == ".json":
                self.loadConfig(os.path.join(folder,filename), asset_name)
                
    
    def loadConfig(self, config, asset_name):
        try:
            conf = self.__loadKBJson(os.path.join(self.asset_folder,config))
            conf["conf"]["name"] = os.path.splitext(config)[0] 
            
            
            kb = self.__loadKB(conf)
            fsa = self.__loadFSA(conf)
            
            if kb is not None:
                self.kb_list[asset_name] = kb
                #print "kb",kb.kb_path
            if fsa is not None:
                self.fsa_list[asset_name] = fsa
                #print "fsa", fsa.fsa_path
        except IOError:
            pass
        except TypeError:
            pass
        except Exception:
            ex_type, ex, tb = sys.exc_info()
            traceback.print_tb(tb)
            del tb
        finally:
            pass
        
    def __getPath(self, path):
        if os.path.isabs(path):
            return path
        else:
            return os.path.normpath(os.path.join(self.asset_folder,path))
    
    def __loadKB(self, conf):
        processors = conf["conf"]["processor"]
        kb_path = self.__getPath(conf["conf"]["kb_path"])
        kb = None
        if not os.path.exists(kb_path) or not os.path.isfile(kb_path):
            raise IOError("File not found.")
        
        if (isinstance(processors,list) and "ner" in processors) or (processors == "ner"):
            kb = KB_NER(self.base_folder, kb_path)
        elif "figa" == processors: 
            kb = KB_Basic(self.base_folder, kb_path)
        
        if kb is not None:
            kb.setConf(conf["conf"])
            columns = conf["columns"] if "columns" in conf else {}
            if "columns" in conf and "external_file" in conf["columns"]:
                columns = self.loadColumsFromFile(self.__getPath(conf["columns"]["external_file"]))
            kb.setColumns(columns)
        return kb
        
    
    def __loadFSA(self, conf):
        processors = conf["conf"]["processor"]
        if (isinstance(processors,list) and "figa" in processors) or (processors == "figa"):
            fsa_path = self.__getPath(conf["conf"]["fsa_path"])
            if not os.path.exists(fsa_path) or not os.path.isfile(fsa_path):
                raise IOError("File not found.")
            return FSA(fsa_path)
        else:
            return None
    
    
    def run(self):
        self.loadFromFolder(self.asset_folder)
        self.quit.clear()
        self.do.clear()
        self.autoload()
        while not self.quit.isSet():
            if self.do.isSet():
                while len(self.load_qeue) > 0:
                    k = self.load_qeue.pop()
                    self.kb_list[k].load()
                    self.kb_online.append(k)
                self.do.clear()
            time.sleep(1)
    
    def stop(self):
        self.quit.set()
        self.join()
    
    
    def getAssetList(self, a_filter=None, available_only = False):
        '''
        @return - list of FSA filenames
        '''
        out = []
        if a_filter == "kb":
            out = self.kb_list.keys() if not available_only else [k for k in self.kb_list.keys() if self.kb_list[k] == 4] 
        elif a_filter == "fsa":
            out = self.fsa_list.keys() if not available_only else [k for k in self.fsa_list.keys() if self.kb_list[k] == 4]
        return out
    
    def getAsset(self, a_name, a_type=None):
        '''
        @a_name - name of asset 
        @return asset instance container or None
        '''
        if a_type is None:
            return [self.kb_list[a_name],self.fsa_list[a_name]]
        elif a_type == "kb":
            return self.kb_list[a_name]
        elif a_type == "fsa":
            return self.fsa_list[a_name]
        else:
            return None 
        
    
        
    def getStatus(self, asset = None):
        '''
        @return - complete info about all KBs
        '''
        
        out = []
        if asset is None:
            for kbname, kb in self.kb_list.iteritems():
                data = kb.get_stats()
                data["name"] = kbname
                out.append(data)
        elif asset == "ner":
            for kbname, kb in self.kb_list.iteritems():
                if "ner" in kb.conf["processor"]:
                    data = kb.get_stats()
                    data["name"] = kbname
                    out.append(data)
        return out
        
    
    def getLoaded(self):
        '''
        @return - list of names of loaded KB 
        '''
        return [k for k in self.kb_list.keys() if self.kb_list[k].status == 4]
    
    
    def loadKB(self, kb_name):
        if kb_name in self.kb_list.keys():
            if not self.kb_list[kb_name].status > 0:
                self.kb_list[kb_name].status = KB_Basic.QUEUED
                self.load_qeue.appendleft(kb_name)
                self.do.set()
    
    def dropKB(self, kb_name):
        if kb_name in self.load_qeue:
            self.load_qeue.remove(kb_name)
        if kb_name in self.kb_list.keys():
            self.kb_list[kb_name].drop()
        if kb_name in self.kb_online: 
            self.kb_online.remove(kb_name)
    
    def __loadKBJson(self, config):
        '''
        Load config json from KB confign, parse it and return as dict
        @return - loaded config as dict
        '''

        f = open(config)
        data = json.loads(f.read())
        f.close()
        return data
    
    def autoload(self):
        '''
        Add all KB marked for autoload to load queue.
        '''
        for kb_name in self.kb_list.keys():
            if self.kb_list[kb_name].preload():
                self.loadKB(kb_name);
    
    
    def loadColumsFromFile(self, filename):
        column_ext_def = {"g":{"type":"image"},
                          "u":{"type":"url"}
                          }
        
        columns = {}
        columns_ext = {}
        prefix_desc = {}
        with open(filename,'r') as f:
            raw_colums = f.read().strip()
            
        for row in raw_colums.split("\n"):
            column = []
            row_split = row.split("\t")
            row_head = row_split.pop(0)
            row_prefix, row_head, row_id = row_head.split(":")
            prefix_desc[row_prefix] = row_head.lower()
            column.append(row_id.lower())
            for col_name in row_split:
                prefix = ""
                url = ""
                if ':' in col_name:
                    col_split = col_name.split(":")
                    prefix = ":".join(col_split[:-1])
                    if "[" in prefix:
                        prefix,url = prefix.split("[")
                    col_name = col_split[-1]
                    for k in prefix:
                        if k in column_ext_def:
                            if row_prefix not in columns_ext:
                                columns_ext[row_prefix] = {}
                            columns_ext[row_prefix][col_name.lower()] = {"type":column_ext_def[k]["type"],
                                                                         "data":url[:-1]
                                                                         }
                    if "m" in prefix:
                        col_name = "*" + col_name
                column.append(col_name.lower())
            columns[row_prefix] = column  
        columns["prefix_desc"] = prefix_desc
        columns["columns_ext"] = columns_ext
        return columns
        
        
        