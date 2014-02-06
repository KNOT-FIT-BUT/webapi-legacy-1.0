import sys, gc
import commands
import os
from ctypes import cdll, POINTER, c_char_p, c_int, c_void_p
import time
from core.adapters.kb.abstract import KnowledgeBaseAdapter

class KB_Basic(KnowledgeBaseAdapter):
    '''
    Simple KB container for NON NER USAGE!
    '''
    
    
    def __init__(self, base_folder, kb_path):
        super(KB_Basic, self).__init__(base_folder, kb_path)
        self.lines = None
        
        
        
    
    def _load(self):
        '''
        Load KB from file via kb_loader.so.
        '''
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
        '''
        Dealoc KB from memory via kb_loader.so
        '''
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
        print int(line) - 1, column
        return self.lines[int(line) - 1][column] if (self.items_number >= int(line)) else ""
    
    
    def get_row(self, line):
        '''
        @return - list of KB row data
        '''
        return self.lines[int(line) -1]
    
    def get_full_row(self, line):
        pass
    
    def isLoaded(self):
        '''
        Return True if KB is loaded into memory or False.
        '''
        return True if self.lines else False


    
    
        
 
    
    