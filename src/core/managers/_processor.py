'''
Created on 1. 12. 2013

@author: casey
'''
import os
from ner import recognize
from ner import dates
from ner import Entity
from collections import OrderedDict
import re


class ProcesssorManager(object):
    '''
    Encapsulate text parsing and output generating methods. 
    '''


    def __init__(self):
        '''
        Constructor
        '''
        self.__column_enh = {"s":"Dates", "t":"Intervals"}
        
        
    def recognize(self, text, kb, fsa=None):
        '''
        Public universal recognize method. Parse text via selected parser and generate final output.
        @return - data JSON of parsed text. 
        '''
        result = None
        if fsa is not None:
            
            result = self.__FIGArecpgnizer(text, kb, fsa)
        else:
            result = self.__NERrecognizer(text, kb)
        
        return self.bake_output(result, kb)
            
    
    
    
    def bake_output(self, proc_res, kb):
        '''
        Bake output with KB config and KB data. Pair KB column names from KB config and row data from KB.
        @proc_res - raw data from processing tools
        @kb - instance of KB class
        '''
        result = self.groupResultItems(proc_res)
        splitter = kb.conf["value_splitter"] if kb.conf["value_splitter"] is not None else ""
        splitter = splitter.encode("utf-8")
        result_kb = []
        for key,data in result.items():
            if str(key) in ["dates", "intervals"]:
                result_kb.append({key:data})
            else:
                item_type = kb.get_field(key, 0)[0]
                kb_data = OrderedDict()
                if item_type in kb.columns:
                    columns = kb.columns[item_type]
                else:
                    columns = kb.columns["col"]
                
                for a in range(len(columns)):
                    colname = columns[a];
                    field_data = kb.get_field(key,a)
                    if colname.startswith('*'):
                        if colname == "*image":
                            fdata = field_data.split(splitter)
                            try:
                                il = iter(fdata)
                                field_data = []
                                while True:
                                    item = il.next()
                                    if len(item) != 11:
                                        item = "".join([item,'_',il.next()])
                                    field_data.append(item)
                            except StopIteration:
                                pass
                                
                        else:
                            field_data = field_data.split(splitter) if len(field_data) > 0 else ""
                        colname = colname[1:]
                    kb_data[colname] = field_data
                    
    
                result_kb.append({
                                  "kb_row":kb_data,
                                  "items":data
                                  })

    
        return {"header":{"status":0,
                            "msg":"",
                            "processor":"",
                            "groups": dict(kb.columns["prefix_desc"].items() + self.__column_enh.items()) if kb.columns["prefix_desc"] is not None else None
                          },
                "result":result_kb
                }
        
    
    def __NERrecognizer(self, text, kb):
        '''
        Call NER tool.
        @text - input text for processing
        @kb - instance of loaded KB
        '''
        return recognize(kb, text, False, False)

        
    
    def __FIGArecpgnizer(self, text, kb, fsa):
        '''
        Call figa tool.
        @text - input text for protessing
        @kb - instance of loaded KB
        @fsa - FSA instance with automat
        '''
        output = fsa.recognize(text)
        entities = []
        for line in output.split("\n")[:-1]:
            se = SimpleEntity(line,kb)
            if se.preferred_sense is not None:
                entities.append(se)
                print se.source, se.senses
                
        
        if len(entities) > 0:
            new_entities = [entities[0]]
            for ent in entities:
                if ent.mutual_position(new_entities[-1].begin,
                                       new_entities[-1].end) != 0:
                    new_entities.append(ent)
            
            entities = new_entities
        
        return entities
        
    def groupResultItems(self, result):
        '''
        Group the same entities items into one container - saving bandwith data.
        '''
        results_group = {}
        for item in result:
            if isinstance(item, dates.Date):
                if item.class_type == item.Type.DATE:
                    item_id = "dates"
                    item_data= [item.s_offset, item.end_offset, item.source, str(item.iso8601)]
                elif item.class_type == item.Type.INTERVAL:
                    item_id = "intervals"
                    item_data= [item.s_offset, item.end_offset, item.source, str(item.date_from), str(item.date_to) ]
                else:
                    continue
            else:
                if item.preferred_sense:
                    item_id = item.preferred_sense
                    item_data = [item.begin, item.end, item.source]
                else:
                    continue
                
            if item_id not in results_group.keys():
                results_group[item_id] = [item_data]
            else:
                data = results_group.get(item_id)
                data.append(item_data)
                results_group[item_id] = data
                
        return results_group
   
class SimpleEntity():
    
    """A text entity refering to a knowledge base item."""
    
    def __init__(self, entity_str, kb):

        """
        Create an entity by parsing a line of figa output from entity_str. 
        Entity will be referring to an item of an knowledge base object kb.
        """

        entity_attributes = entity_str.split('\t')
        self.senses = []
        for sense in entity_attributes[0].split(';'):
            #sense 0 marks a coreference
            if sense != '0':
                self.senses.append(int(sense))
        #start offset is indexed differntly from figa
        self.begin = int(entity_attributes[1]) - 1
        self.s_offset = self.begin
        self.end = int(entity_attributes[2])
        self.source = entity_attributes[3]
        #convert utf codes
        self.source = re.sub("&#x([A-F0-9]{2});","\\x\g<1>", self.source)
        self.source = re.sub("&#x([A-F0-9]{2})([A-F0-9]{2});","\\x\g<1>\\x\g<2>", self.source)
        self.source = re.sub("&#x([A-F0-9]{2})([A-F0-9]{2})([A-F0-9]{2});","\\x\g<1>\\x\g<2>\\x\g<3>", self.source)
        self.source = re.sub("&#x([A-F0-9]{2})([A-F0-9]{2})([A-F0-9]{2})([A-F0-9]{2});","\\x\g<1>\\x\g<2>\\x\g<3>\\x\g<4>", self.source)
        self.source = re.sub("&#x([A-F0-9]{2})([A-F0-9]{2})([A-F0-9]{2})([A-F0-9]{2})([A-F0-9]{2});","\\x\g<1>\\x\g<2>\\x\g<3>\\x\g<4>\\x\g<5>", self.source)
        self.source = re.sub("&#x([A-F0-9]{2})([A-F0-9]{2})([A-F0-9]{2})([A-F0-9]{2})([A-F0-9]{2})([A-F0-9]{2});","\\x\g<1>\\x\g<2>\\x\g<3>\\x\g<4>\\x\g<5>\\x\g<6>", self.source)
        self.source = eval("\"" + self.source + "\"")
        self.kb = kb
        self.preferred_sense = self.senses[0] if len(self.senses)> 0 else None
        
    
    def mutual_position (self, begin_offset, end_offset):
        """
        Evaluates mutual position in a source text of self and a entity starting
        at begin_offset and ending at end_offset. If self stands entirely before
        the other entity returns -1. If entities overlap, returns 0. If self 
        stands entirely after the other entity, returns 1.
        """
        if int(self.end) < int(begin_offset):
            return -1
        elif int(self.begin) > int(end_offset):
            return 1
        else:
            return 0




   

    

   

     
    