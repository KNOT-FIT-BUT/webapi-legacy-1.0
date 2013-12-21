import cherrypy
import os

from core.REST import RESTService
from core.web import Root
from core import Core



current_dir = os.path.dirname(os.path.abspath(__file__))


def main():
    #cherrypy.config.update({'error_page.404': error_page_404})
    cherrypy.config.update({'server.socket_host': "127.0.0.1",
                            'server.socket_port': 8090,
                            'server.thread_pool': 8,
                            'log.screen': True,
                            'log.access_file':"./logs/access.log",
                            'log.error_file':"./logs/errors.log",
                            'engine.autoreload_on':False,
                            'tools.caching.on' : False
                            })
    
    #os.chdir("./api/NER")
    #kb = knowledge_base.KnowledgeBase("./api/NER/KBstatsMetrics.all")
    core = Core(current_dir)
    core.loadConfig("")
    core.initManagers()
    rest_service = RESTService(core)

    cherrypy.tree.mount(rest_service, "/api/", config = {'/':{'request.dispatch':cherrypy.dispatch.MethodDispatcher()}})
    
    conf = {
        '/static':
        { 'tools.staticdir.on':True,
          'tools.staticdir.dir': current_dir + "/static"
        },
    }
    

    Root._cp_config = {'tools.staticdir.on' : True,
                  'tools.staticdir.dir' : os.path.join(current_dir, "static"),
                  'tools.staticdir.index' : 'index.html',}

    with open("webapiner.pid","w") as f:
        f.write(str(os.getpid()))
    
    
    cherrypy.engine.subscribe("stop", core.getManager("kb").stop)
    core.getManager("kb").start()
    #kbManager.load("DUMP_FLTRD.ascii")
    cherrypy.quickstart(Root(core), config = conf)

    
    
if __name__ == '__main__':
    #sys.path.append(os.path.abspath(os.path.join(current_dir,"tools","NER","nlputils")))
    #sys.path.append(os.path.abspath(os.path.join(current_dir,"tools","NER","gazetteer","figa")))
    main()    
    
