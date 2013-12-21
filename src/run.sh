current=`pwd`
apifolder=$current"/api/NER"
echo ${PYTHONPATH}
export PYTHONPATH=${PYTHONPATH}:$apifolder
python webapiner.py