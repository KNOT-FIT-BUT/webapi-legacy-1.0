var core;

$(document).ready(
function() {
  core = new GUICore();
});


function GUICore(){
  this.gKBManager = new KBManager("#kbmanagerblock");
  this.gAPI = new APISwitches("#apiswitches");
  this.gInput = new Input("#inputblock");
  
  this.gEntityTab = new EntityTab("#EntityTabContainer");
  this.gOutputTab = new OutputTabs("#OutputTabContainer");
  this.gEntityInfo = new EntityInfo("#EntityInfoContainer");
  this.gCarousel = new EntityImg("#EntityTabContainer");
  
  this.gbRV = new ResultVisual();
  this.gbRR = new ResultRaw();
  
  
  
  this.gKBManager.init();
  this.gAPI.init();
  this.gInput.init();
  this.gEntityTab.init();
  this.gOutputTab.init();
  this.gEntityInfo.init();
  this.gCarousel.init();


  this.gOutputTab.addTab("Visual",this.gbRV);
  this.gOutputTab.addTab("Json",this.gbRR);  
  
  this.gEntityTab.registerOnSelectCallback($.proxy(this.onEntitySelectFromList,this));
  this.gbRV.registerOnSelectCallback($.proxy(this.onEntitySelectFromText,this));
  

  this.gInput.addAnnotateCallback($.proxy(this.onAnnotate,this));
  this.gKBManager.registerOnChangeCallback($.proxy(this.onKbChange,this));
  
  this.item_list = null;
  this.kb_data = null;
  
};



GUICore.prototype.onAnnotate = function(){
	url = this.gAPI.getFormatedURL();
	data = this.gAPI.getFormatedData();
	text = this.gInput.getInputText();
	
	if(url == null || text == null){
		return false;
	}
	
	$.ajax({  
  			type: "POST",  
  			url: url,  
  			data: {"text":text},
  			dataType: 'json',
  			success: $.proxy(this.outputGenerator,this)
		});
	
};

GUICore.prototype.onKbChange = function(){
	this.gAPI.refreshAll();
	
};


GUICore.prototype.outputGenerator = function(raw_data){
	
	var datesID = 0;
	var interID = 0;
	this.item_list = [];
	this.kb_data = [];
	
	data = raw_data["result"];
  
    this.gbRR.clear();
    this.gbRV.clear();
    	
    
	for(var i in data){
		var item = data[i];
		if(item.hasOwnProperty("kb_data")){
			kbID = item.kb_data.id.replace(":","-");
			var iitems = item.items;
			for(var d in iitems){
				var i = iitems[d];
				i.push(kbID);
				this.item_list.push(i);
			}
			this.kb_data[kbID] = item.kb_data;
			
		}else if (item.hasOwnProperty("dates")){
			dateList = item["dates"];
			for(var d in dateList){
				var date = dateList[d];
				var id ="s-" + datesID.toString();
				date.push(id);
				this.item_list.push(date);
				this.kb_data[id] = {'id':id,'name':date[2], 'type':'Date'};
				datesID++;
			}
		}else if (item.hasOwnProperty("intervals")){ 
			dateList = item["intervals"];
			for(var d in dateList){
				var date = dateList[d];
				var id = "t-" + datesID.toString();
				date.push(id);
				this.item_list.push(date);
				this.kb_data[id] = {'id':id,'name':date[2],'type':'Interval'};
				datesID++;
			}

		}else{continue;}
	}
	
	this.item_list.sort(function(a,b){
    return a[0] - b[0];
	});
	
	
	
	this.gbRR.update(JSON.stringify(raw_data, null, "  "));
	this.gbRV.update(this.gInput.getInputText(),this.item_list);
	
	$('#myTab a[href="#output"]').tab('show');
	
	this.gEntityTab.update(raw_data["header"]["groups"], this.kb_data);
	
};

GUICore.prototype.onEntitySelectFromText = function(event){
	
	

	var element = event.target;
	var group_id = $(element).attr("class").split(/\s+/)[1];
	
	this.gEntityTab.focusEntity(group_id);
	
	this.onEntitySelect(group_id);
	
	
};

GUICore.prototype.onEntitySelectFromList = function(event){
	var element = event.target;
	var group_id = $(element).attr("class");
	this.gbRV.focusEntity(group_id);
	this.onEntitySelect(group_id);
	

};

GUICore.prototype.onEntitySelect = function(group_id){
	$(".sel").each(function(){
	  $(this).removeClass("sel");
	});
	
	$("."+group_id).each(function(){
		$(this).addClass("sel");
	})	;
	
	this.gEntityInfo.update(this.kb_data[group_id]);
	this.gCarousel.update(this.kb_data[group_id]);
};





