import cherrypy
import os

from core.REST import RESTService
from core.web import Root
from core import Core



current_dir = os.path.dirname(os.path.abspath(__file__))


def main():
    #cherrypy.config.update({'error_page.404': error_page_404})
    cherrypy.config.update('webapiner.ini')
    
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
    core.getManager("kb").autoload()
    cherrypy.quickstart(Root(core), config = conf)

    
    
if __name__ == '__main__':
    main()    
    
