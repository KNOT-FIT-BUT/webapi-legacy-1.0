'''
Created on 24. 11. 2013

@author: xjerab13
'''

import os
import figav08.figa.marker as figa


class FSAManager(object):
    '''
    Contains and manage information about FSA automtats.
    '''


    def __init__(self, base_folder, fsa_folder):
        '''
        @base_folder - absolute path to program folder
        @fsa_folder - relative path to FSA folder
        '''
        self.base_folder = base_folder
        self.fsa_folder = os.path.join(base_folder, fsa_folder)
        self.fsa_list = {}
        self.__loadKBListFromFolder()
        
    def __loadKBListFromFolder(self):
        '''
        Private, loads list of file with .fsa extension from FSA folder.
        '''
        files = [os.path.splitext(f) for f in os.listdir(self.fsa_folder) if os.path.isfile(os.path.join(self.fsa_folder,f))]
        for filename in set(files):
            if filename[1] == ".fsa":
                self.fsa_list[filename[0]] = FSA(self.fsa_folder, filename[0])
        
    
    def getFSAList(self):
        '''
        @return - list of FSA filenames
        '''
        return self.fsa_list.keys()
    
    def isAviable(self, fsa_name):
        return fsa_name in self.fsa_list.keys()
    
    def getFSA(self, fsa_name):
        '''
        @fsa_name - name of FSA filename without extension
        @return FSA instance container or None
        '''
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
    
