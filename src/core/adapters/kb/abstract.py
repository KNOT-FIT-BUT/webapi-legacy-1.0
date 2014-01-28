'''
Created on 28. 11. 2013

@author: xjearb13
'''

import time, os
import json

class KnowledgeBaseAdapter(object):
    '''
    Base class for KB_Basic and KB_NER
    '''
    
    OFFLINE = 0
    QUEUED = 1
    LOADING = 2
    UNLOADING = 3
    LOADED = 4

    def __init__(self, base_folder, kb_path, kb_name="undefined"):
        '''
        Constructor
        '''
        self.base_folder = base_folder
        self.kb_path = kb_path
        self.status = 0
        self.columns = None
        self.conf = None
        self.kb_name = kb_name
        
    def setConf(self, conf):
        self.conf = conf
        
    def setColumns(self, columns):
        self.columns = columns
        
    def load(self):
        '''
        Load KB into memory and generate statistics. Loading implementation is overried inhereid class.
        '''
        self.status = 2
        mem_start = _VmB('VmSize:')
        time_start = time.time()
        self._load()
        mem_stop = _VmB('VmSize:')
        time_stop = time.time()
        self.updateStats(time_stop - time_start, mem_stop - mem_start)
        self.status = 4
        
        
    def drop(self):
        '''
        
        '''
        self.status = 3
        self._drop()
        self.status = 0
        
        
    def get_stats(self):
        '''
        @return dict with info about KB.
        '''
        return {
                "size":self.conf["memusage"],
                "load_time":self.conf["loadtime"],
                "status":self.status,
                "processor":self.conf["processor"]
                } if self.conf else {}
        
    def updateStats(self, loading, memory):
        '''
        Update statistics info in KB config file.
        '''
        if self.conf["memusage"] <= 0:
            self.conf["memusage"] = memory
        else:
            self.conf["memusage"] += memory
            self.conf["memusage"] /= 2
        if self.conf["loadtime"] <= 0:
            self.conf["loadtime"] = loading
        else:
            self.conf["loadtime"] += loading
            self.conf["loadtime"] /= 2
    
        #with open(os.path.join(self.kb_folder, self.kb_name+".json"),"w") as f:
        #        f.write(json.dumps({"columns":self.kb_columns,"conf":self.kb_conf},indent=2, separators=(',', ': ')))
                
    def preload(self):
        '''
        @return - True if KB is marked for autoload at program startup.
        '''
        if self.conf is not None and "preload" in self.conf.keys():
            return self.conf["preload"]
        else:
            return False

def _VmB(VmKey):
    '''
    Measure RAM usage of whole process.
    '''
    _proc_status = '/proc/%d/status' % os.getpid()

    # get pseudo file  /proc/<pid>/status
    try:
        t = open(_proc_status)
        v = t.read()
        t.close()
    except:
        return 0.0  # non-Linux?
    # get VmKey line e.g. 'VmRSS:  9999  kB\n ...'
    i = v.index(VmKey)
    v = v[i:].split(None, 3)  # whitespace
    if len(v) < 3:
        return 0.0  # invalid format?
    # convert Vm value to kbytes
    return float(v[1])
        
    