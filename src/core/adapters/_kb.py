'''
DEPRECATED!
'''
KBC_V1 = {
        "p" :["id","type","name","*alias",
                       "description", "*image", "*period of movement", "date of birth", "place of birth",
                       "date of death", "place of death", "*profession","*places lived", "gender","nationality" ,"freebase url",
                       "wikipedia url"],
        "a" :["id","type","display term","preferred term",
                       "*other terms", "preferred role", "*other roles", "preferred nationality",
                       "*other nationalities", "description", "date of birth", "place of birth",
                       "date of death", "place of death", "gender", "note", "freebase url",
                       "wikipedia url", "*period of movement", "*influenced", "*influenced by",
                       "*places lived", "*art form", "*image", "*training", "*movement", "*influences",
                       "dbpedia url"],
        "l":["id","type","name","*alternative names", "latitude", "longitude", "feature code",
                       "country", "population", "elevation", "wikipedia url", "dbpedia url", "freebase url",
                       "*settlement type", "*timezone", "description", "*image"],
        "w":["id","type","name","*alias","description","*image","*artist","*art subject","art form","*art genre",
                      "*media", "*support", "*location", "date begun", "date completed", "*owner", "height", "width",
                      "depth", "freebase url", "wikipedia url", "*painting alignment", "movement"],
        "c":["id", "type", "name", "*alias", "description", "*image", "*type of museum", "established",
                      "director", "*visitors", "city town", "postal code", "state province region", "street address",
                      "latitude", "longitude", "freebase url", "wikipedia url"],
        "e":["id", "type", "name", "*alias", "description", "*image", "start date", "end date", "*locations", "notable types"
                    "freebase url", "wikipedia url"],
          
        "f":["id", "type", "name", "*alias", "description", "*image", "freebase url", "wikipedia url"],
        "d":["id", "type", "name", "*alias", "description", "*image", "freebase url", "wikipedia url"],
        "m":["id", "type", "name", "*alias", "description", "*image", "freebase url", "wikipedia url"],
        "g":["id", "type", "name", "*alias", "description", "*image", "freebase url", "wikipedia url"],
        "n":["id", "type", "name", "*alias", "description", "*image", "short name","country name",
                          "*adjectival form", "freebase url", "wikipedia url"],
        
        "value_splitter" : "_"
        
        }


KBC_V2 = {"col":["id", "name", "wikipedia url","description"],
          "value_splitter" : None,
          
          }