'''
Created on 28. 11. 2013

@author: casey
'''

import time, os
import json

class KnowledgeBaseAdapter(object):
    '''
    classdocs
    '''
    
    OFFLINE = 0
    QUEUED = 1
    LOADING = 2
    UNLOADING = 3
    LOADED = 4

    def __init__(self, base_folder, kb_folder_rel, filename, extension=".kb"):
        '''
        Constructor
        '''
        self.base_folder = base_folder
        self.kb_folder = os.path.join(self.base_folder, kb_folder_rel)
        self.kb_name = filename
        self.kb_path = os.path.join(self.kb_folder, self.kb_name+extension)
        self.status = 0
        self.kb_columns = None
        self.kb_conf = None
        
    def load(self):
        self.status = 2
        mem_start = _VmB('VmSize:')
        time_start = time.time()
        self._load()
        mem_stop = _VmB('VmSize:')
        time_stop = time.time()
        self.updateStats(time_stop - time_start, mem_stop - mem_start)
        self.status = 4
        
        
    def drop(self):
        self.status = 3
        self._drop()
        self.status = 0
        
        
    def get_stats(self):
        return {"name":self.kb_name,
                "size":self.kb_conf["memusage"],
                "load_time":self.kb_conf["loadtime"],
                "status":self.status,
                "processor":self.kb_conf["processor"]
                } if self.kb_conf else {}
        
    def updateStats(self, loading, memory):
        if self.kb_conf["memusage"] <= 0:
            self.kb_conf["memusage"] = memory
        else:
            self.kb_conf["memusage"] += memory
            self.kb_conf["memusage"] /= 2
        if self.kb_conf["loadtime"] <= 0:
            self.kb_conf["loadtime"] = loading
        else:
            self.kb_conf["loadtime"] += loading
            self.kb_conf["loadtime"] /= 2
    
        with open(os.path.join(self.kb_folder, self.kb_name+".json"),"w") as f:
                f.write(json.dumps({"columns":self.kb_columns,"conf":self.kb_conf},indent=2, separators=(',', ': ')))
                
    def preload(self):
        if self.kb_conf is not None and "preload" in self.kb_conf.keys():
            return self.kb_conf["preload"]
        else:
            return False

def _VmB(VmKey):
    '''Private.
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
        
    