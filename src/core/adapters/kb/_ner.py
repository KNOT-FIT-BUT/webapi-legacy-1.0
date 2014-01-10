'''
Created on 25. 11. 2013

@author: xjerab13
'''

import gc
from ctypes import cdll, POINTER, c_char_p, c_int, c_void_p

import time, random, os
from core.adapters.kb.abstract import KnowledgeBaseAdapter
from knowledge_base import KnowledgeBase



class KB_NER(KnowledgeBaseAdapter):
    '''
    Adapter for Knowledge_Base class from NER library. This class encapsulate behavior for webapi loading
    and unloading KB, all other calls are passed to original NER class.
    '''
    
    def __init__(self, base_folder, kb_folder_rel, filename, extension=".kb"):
        super(KB_NER, self).__init__(base_folder, kb_folder_rel, filename, extension)
        self._kb = None

        
    def _load(self):
        '''
        Load KB into memory.
        '''
        self._kb = KnowledgeBase(self.kb_path)
        
    def _drop(self):
        '''
        Dealocate KB from memory.
        '''
        maxitem = 33 
        lib = cdll.LoadLibrary(os.path.join(self.base_folder, "api","NER","figav08","figa","kb_loader.so"))
        lib.queryTree.restype = c_void_p
        lib.queryTree.argtypes = [POINTER(POINTER(c_char_p)),c_int,c_int]

        lib.freeTree(self._kb.lines, self.kb_path,self._kb.items_number, maxitem);
        del(self._kb.lines)
        self._kb.lines = None
        self.status = 0
        gc.collect()
        
    
    
    def __getattr__(self, attr):
        '''
        Pass all method calls or variable requests to instance of NER KnowledgeBase class.
        '''
        attribute = getattr(self._kb, attr)
        if callable(attribute): 
            def wrapper(*args, **kw):
                return attribute(*args, **kw)
            return wrapper
        else:
            return attribute
        
    
        