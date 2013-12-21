#!/bin/bash
SCRIPT_PATH="/home/xjerab13/webapiner2"

cd $SCRIPT_PATH/sec
git pull

if [ $? -ne 0 ]; then
 echo "Repository updating failed"
 exit 1
else
 echo "Repository updated" 
fi



if [ ! -d $SCRIPT_PATH"/src/api/NER_OLD" ]; then
 echo "NER backup not found, skipping."
else
 echo -ne "Deleting NER backup..."
 rm -r $SCRIPT_PATH/src/api/NER_OLD 
 echo "Done!"
fi

 echo -ne "Creating new backup ..."
 mv $SCRIPT_PATH/src/api/NER $SCRIPT_PATH/src/api/NER_OLD
 echo "Done!"
 echo  "Copying new NER..."
 cp -r $SCRIPT_PATH/sec/NER $SCRIPT_PATH/src/api/NER
 echo "Done!"

../webapiner start

#&& rm -r ../src/api/NER &&  mv ../src/api/NER ../src/api/NER_OLD && cp -r ./NER ../src/api/NER 
