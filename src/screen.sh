echo "Starting wenapiner service @ screen webapiner"
screen -d -m -S webapiner sh run.sh
sleep 2
pid=$(ps -C "python webapiner.py" -o pid=)  
echo "PID: "$pid