'''
Created on 24. 11. 2013

@author: casey
'''

import os
import figav08.figa.marker as figa


class FSAManager(object):
    '''
    classdocs
    '''


    def __init__(self, base_folder, fsa_folder):
        '''
        Constructor
        '''
        self.base_folder = base_folder
        self.fsa_folder = os.path.join(base_folder, fsa_folder)
        self.fsa_list = {}
        self.__loadKBListFromFolder()
        
    def __loadKBListFromFolder(self):
        files = [os.path.splitext(f) for f in os.listdir(self.fsa_folder) if os.path.isfile(os.path.join(self.fsa_folder,f))]
        for filename in set(files):
            if filename[1] == ".fsa":
                self.fsa_list[filename[0]] = FSA(self.fsa_folder, filename[0])
        
    
    def getFSAList(self):
        return self.fsa_list.keys()
    
    def isAviable(self, fsa_name):
        return fsa_name in self.fsa_list.keys()
    
    def getFSA(self, fsa_name):
        if fsa_name in self.fsa_list.keys():
            return self.fsa_list[fsa_name]
        else:
            return None
    
    
        
    
    
class FSA():
    
    def __init__(self, fsaf, ff):
        self.fsa_folder = fsaf
        self.filename = ff
        
        
        
    def recognize(self, text):
        dictionary = figa.myList()
        lang_file = None
        dictionary.insert(os.path.join(self.fsa_folder,self.filename + ".fsa"))
        seek_names = figa.marker(dictionary, lang_file)
        output = seek_names.lookup_string(text)
        return output 
    
