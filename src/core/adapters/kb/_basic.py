import sys, gc
import commands
import os
from ctypes import cdll, POINTER, c_char_p, c_int, c_void_p
import time
from core.adapters.kb.abstract import KnowledgeBaseAdapter

class KB_Basic(KnowledgeBaseAdapter):
    
    
    
    def __init__(self, base_folder, kb_folder_rel, filename, extension=".kb"):
        super(KB_Basic, self).__init__(base_folder, kb_folder_rel, filename, extension)
        self.lines = None
        
        
        
    
    def _load(self):
        count = commands.getoutput('wc -l ' + self.kb_path + ' | cut -d" " -f1')
        self.items_number = int(count)
        maxitem = 33 
        lib = cdll.LoadLibrary( os.path.join(self.base_folder, "api","NER","figav08","figa","kb_loader.so"))
        lib.queryTree.restype = POINTER(POINTER(c_char_p))
        lib.queryTree.argtypes = [c_char_p,c_int,c_int]

        self.lines = lib.queryTree(self.kb_path, self.items_number, maxitem);
        #time.sleep(5)
        self.status = KB_Basic.LOADED
    
    def _drop(self):
        maxitem = 33 
        lib = cdll.LoadLibrary(os.path.join(self.base_folder, "api","NER","figav08","figa","kb_loader.so"))
        lib.queryTree.restype = c_void_p
        lib.queryTree.argtypes = [POINTER(POINTER(c_char_p)),c_int,c_int]

        lib.freeTree(self.lines, self.kb_path,self.items_number, maxitem);
        del(self.lines)
        self.lines = None
        self.status = KB_Basic.OFFLINE
        gc.collect()
        
        
    def get_field(self, line, column):
        """Returns a column of a line in the knowledge base"""
        #KB lines are indexed from one
        return self.lines[int(line) - 1][column]
    
    
    def get_row(self, line):
        return self.lines[int(line) -1 ]
    
    def get_full_row(self, line):
        pass
    
    def isLoaded(self):
        return True if self.lines else False


    
    
        
 
    
    