

from ner import knowledge_base
from ner import dates

from collections import OrderedDict
from core.adapters._kb import KBC_V1,KBC_V2




        
def select_adapter(automata):
    return AdapterCrate[automata]
            
        
        
def parse_result(result, kb, automata ='classic'):
    global ParserCrate
    results_group = group_results_by_id(result)
    adapter = select_adapter(automata)
    splitter = adapter["value_splitter"]
    return ParserCrate[automata](results_group, kb, adapter, splitter)
    


def parser_classic(result, kb, adapter, splitter):
    result_kb = []
    for key,data in result.items():

        if str(key) in ["dates", "intervals"]:
            result_kb.append({key:data})
        else:
            item_type = kb.get_field(key, 0)[0]
            kb_data = OrderedDict()
            columns = adapter[item_type]
            
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
                

            result_kb.append({"kb":kb_data,
                              "items":data
                              })

    return result_kb


def parser_new_v1(result, kb, adapter, splitter):
    result_kb = []
    for key,data in result.items():
        if str(key) in ["dates", "intervals"]:
            result_kb.append({key:data})
        else:
            kb_data = OrderedDict()
            columns = adapter['col']
            for a in range(len(columns)):
                colname = columns[a];
                field_data = kb.get_field(key,a)
                kb_data[colname] = field_data
            result_kb.append({"kb":kb_data,
                              "items":data
                              })
    return result_kb
    
    


def group_results_by_id(result):
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



AdapterCrate = {'classic': KBC_V1,
                'new_v1':KBC_V2
                }

ParserCrate = {'classic': parser_classic,
               'new_v1' : parser_new_v1 
               }

