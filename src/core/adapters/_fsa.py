import os
import figav08.figa.marker as figa


class FSA():
    
    def __init__(self, filepath):
        #self.fsa_folder = fsaf
        #self.filename = ff
        self.fsa_path = filepath
        
        
    def recognize(self, text):
        #print self.fsa_path
        dictionary = figa.myList()
        lang_file = None
        dictionary.insert(self.fsa_path.encode("utf-8"))
        seek_names = figa.marker(dictionary, lang_file)
        output = seek_names.lookup_string(text)
        return output 