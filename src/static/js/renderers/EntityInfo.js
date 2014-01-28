function EntityInfo(cnt_id){

	this.cnt_id = cnt_id;
	this.container = $(cnt_id);
	this.legend="Entity Info";
	this.info_list = $(document.createElement("ul"));
	this.gender_list = {'M':'Male','F':'Female','U':'Unknown','O':'Others'};
	
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
	var data="";
	for(var i in kb_row){
		liitem = $(document.createElement('li'));
		//i_bold = $(document.createElement('b')).text(i + ": ");
		if(kb_row[i] == ""){
			continue;
		}else if(i.endsWith("url")){
			//liitem.text(i + ": ");
			liitem.append($(document.createElement('b')).text(i + ": "));
			liitem.append($(document.createElement('a')).attr('href',kb_row[i]).text(kb_row[i]));
		}else if(i == "ulan id"){
				//liitem.text(i + ": ");
				liitem.append($(document.createElement('b')).text(i + ": "));
			    liitem.append($(document.createElement('a')).attr('href','http://www.getty.edu/vow/ULANFullDisplay?find=&role=&nation=&subjectid='+kb_row[i]).text(kb_row[i]));
		}else if(i == "image"){
			//updateImagePane(kb_row[i]);
			liitem.append($(document.createElement('b')).text(i + ": "));
			//liitem.text(i + ": "  + kb_row[i].join(", "));
			liitem.append(kb_row[i].join(", "));
		//}else if(i == "gender"){
			//liitem.append($(document.createElement('b')).text(i + ": "));
			//liitem.text(i + ": "  + this.gender_list[kb_row[i]]);
			//liitem.append(this.gender_list[kb_row[i]]);
		}else{
			if(Array.isArray(kb_row[i])){
				data = kb_row[i].join("; ");
				if(i == "timezone"){
					data = "UTC "+data;
				}	
			}else{
				data = kb_row[i];
				if(i == "gender"){
					data = this.gender_list[data];
				}
			}
			liitem.append($(document.createElement('b')).text(i + ": "));
			//liitem.append(i + ": " + data);
			d = data.replace(/\\n/g, '<br />');
			liitem.append(d);
		}
		this.info_list.append(liitem);
	}

};

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};


