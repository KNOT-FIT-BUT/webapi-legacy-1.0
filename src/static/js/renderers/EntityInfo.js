function EntityInfo(cnt_id){

	this.cnt_id = cnt_id;
	this.container = $(cnt_id);
	this.legend="Entity Info";
	this.info_list = $(document.createElement("ul"));
	
};

EntityInfo.prototype.init = function(){
	this.container.append(
		$(document.createElement("div")).addClass("page-header").text(this.legend),
		this.info_list
	);
	
		
};

	
EntityInfo.prototype.clear = function(){
	this.info_list.empty();

};


EntityInfo.prototype.update = function(kb_row){
	this.clear();
	
	for(var i in kb_row){
		liitem = $(document.createElement('li'));
		if(kb_row[i] == ""){
			continue;
		}else if(i.endsWith("url")){
			liitem.text(i + ": ");
			liitem.append($(document.createElement('a')).attr('href',kb_row[i]).text(kb_row[i]));
		}else if(i == "image"){
			//updateImagePane(kb_row[i]);
			liitem.text(i + ": "  + kb_row[i].join(", "));
		}else{
			if(Array.isArray(kb_row[i])){
				data = kb_row[i].join(", ");	
			}else{
				data = kb_row[i];
			}
			liitem.append(i + ": " + data);
		}
		this.info_list.append(liitem);
	}

};

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};


