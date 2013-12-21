#!/bin/bash
# webapiner daemon
# chkconfig: 345 20 80
# description: myapp daemon
# processname: myapp

DAEMON_PATH="/home/xjerab13/webapiner2/src/"

NAME=webapiner
DESC="Webapi init.d script."
PIDFILE=/home/xjerab13/webapiner2/$NAME.pid
SCRIPTNAME=/home/xjerab13/webapiner2/$NAME

case "$1" in
start)
	printf "%-50s" "Starting $NAME..."
	cd $DAEMON_PATH
	screen -dmS webapiner sh run.sh
	sleep 2
	cd ..
	#PID=$(ps -C "python webapiner.py" -o pid=) 
	PID=$(ps x | grep webapiner.py | grep -v "grep" | cut -f1 -d " ")
	echo $PID > $PIDFILE
	#echo "Saving PID" $PID " to " $PIDFILE
        if [ -z $PID ]; then
            printf "%s\n" "Fail"
        else
            echo $PID > $PIDFILE
            printf "%s\n" "Done"
 	    printf "%s %s %s %s\n" "PID:",$PID,"saved to",$PIDFILE

        fi
;;
status)
        printf "%-50s" "Checking $NAME..."
        if [ -f $PIDFILE ]; then
            PID=`cat $PIDFILE`
            if [ -z "`ps axf | grep ${PID} | grep -v grep`" ]; then
                printf "%s\n" "Process dead but pidfile exists"
            else
                echo "Running"
            fi
        else
            printf "%s\n" "Service not running."
        fi
;;
stop)
        printf "%-50s" "Stopping $NAME..."
        if [ -f $PIDFILE ]; then
            PID=`cat $PIDFILE`
            kill -SIGINT $PID
            printf "%s\n" "Done"
            rm -f $PIDFILE
     
        else
            printf "%s\n" "pidfile not found"
        fi
;;

restart)
  	$0 stop
  	$0 start
;;

*)
        echo "Usage: $0 {status|start|stop|restart}"
        exit 1
esac
