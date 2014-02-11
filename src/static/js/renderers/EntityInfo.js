function EntityInfo(cnt_id){

	this.cnt_id = cnt_id;
	this.container = $(cnt_id);
	this.legend="Entity Info";
	this.info_list = $(document.createElement("ul"));
	this.gender_list = {'M':'Male','F':'Female','U':'Unknown','O':'Others'};
	this.group_btn = null;
	this.kb_row = null;
	this.kb_row_pos = 0;
	this.kb_toggle_btn =$(document.createElement("button")).addClass("btn dropdown-toggle").attr("data-toggle","dropdown").text("0/0"); 
	this.kb_toggle_menu = $(document.createElement("ul")).addClass("dropdown-menu");
};

EntityInfo.prototype.init = function(){
	this.group_btn = $(document.createElement("div")).addClass("btn-group").append(
		$(document.createElement("button")).addClass("btn").text("<").click($.proxy(this.listPrev, this)),
		this.kb_toggle_btn,
		$(document.createElement("button")).addClass("btn").text(">").click($.proxy(this.listNext, this)),
		this.kb_toggle_menu
	);
	this.container.append(
		$(document.createElement("div")).addClass("page-header").append(
			$(document.createElement("span")).text(this.legend),
			$(document.createElement("div")).addClass("pull-right").append(
				this.group_btn				
			)
		),
		
		this.info_list
	);
	
    this.group_btn.hide();
};

	
EntityInfo.prototype.clear = function(){
	this.info_list.empty();
	this.group_btn.hide();
};


EntityInfo.prototype.listNext = function(){
	//console.log((this.kb_row_pos -1) % this.kb_row.length);
	this.kb_row_pos = (this.kb_row_pos + 1) % this.kb_row.length;
	//console.log(this.kb_row_pos);
	this._update(this.kb_row[this.kb_row_pos]);
	this.kb_toggle_btn.text((this.kb_row_pos + 1)+"/"+this.kb_row.length);
	this.group_btn.show();
};

EntityInfo.prototype.listPrev = function(){
	//console.log((this.kb_row_pos -1) % this.kb_row.length);
	this.kb_row_pos = (this.kb_row_pos -1) < 0 ? this.kb_row.length-1 : ((this.kb_row_pos -1) % this.kb_row.length);
	//console.log(this.kb_row_pos);
	this._update(this.kb_row[this.kb_row_pos]);
	this.kb_toggle_btn.text((this.kb_row_pos + 1)+"/"+this.kb_row.length);
	this.group_btn.show();
};

EntityInfo.prototype.listSelect = function(event){
	var element = event.target;
	this.kb_row_pos = parseInt($(element).attr("data-position"));
	this._update(this.kb_row[this.kb_row_pos]);
	this.kb_toggle_btn.text((this.kb_row_pos + 1)+"/"+this.kb_row.length);
	this.group_btn.show();
};

EntityInfo.prototype.update = function(kb_item){
	this.clear();
	//console.log(kb_item);
	this.group_btn.hide();
	if(Array.isArray(kb_item)){
		console.log(this.kb_row_pos);
		this.kb_row = kb_item;
		this.kb_row_pos = 0;
		this.kb_toggle_btn.text("1/"+this.kb_row.length);
		this.kb_toggle_menu.empty();
		for(var i in kb_item){
			var txt = this.getBestTextField(kb_item[i]);
			
			this.kb_toggle_menu.append(
				$(document.createElement("li")).append(
					$(document.createElement("a")).attr({"href":"#","data-position":i}).text(txt).click($.proxy(this.listSelect,this))
				)
			);
		}
		
		this._update(this.kb_row[this.kb_row_pos]);
		this.group_btn.show();
	}else{
		this._update(kb_item);
	}
};

EntityInfo.prototype.getBestTextField = function(kb_item){
	var fields = ["preferred term","name","display term","hidden text"];
	var field = "";
	var text = "";
	for(var i in fields){
		field = fields[i];
		if(kb_item[field] != "" && kb_item[field] != undefined){
			text = kb_item[field];
			break;
		}
	}
	
	return text;
	

};


EntityInfo.prototype._update = function(kb_row){
	this.clear();
	var data="";
	for(var i in kb_row){
		liitem = $(document.createElement('li'));
		if(kb_row[i] == "" || i.endsWith("escaped") || i == "hidden text"){
			continue;
		}else if(i.endsWith("url")){
			liitem.append($(document.createElement('b')).text(i + ": "));
			liitem.append($(document.createElement('a')).attr('href',kb_row[i]).text(kb_row[i]));
		}else if(i == "ulan id"){
				liitem.append($(document.createElement('b')).text(i + ": "));
			    liitem.append($(document.createElement('a')).attr('href','http://www.getty.edu/vow/ULANFullDisplay?find=&role=&nation=&subjectid='+kb_row[i]).text(kb_row[i]));
		}else if(i == "image"){
			liitem.append($(document.createElement('b')).text(i + ": "));
			liitem.append(kb_row[i].join(", "));
		}else if(i == "geonames id"){
			liitem.append($(document.createElement('b')).text(i + ": "));
			liitem.append($(document.createElement('a')).attr('href','http://www.geonames.org/'+kb_row[i]).text(kb_row[i]));
		
		}else if(i == "feature code"){
			liitem.append($(document.createElement('b')).text(i + ": "));		
			liitem.append(kb_row[i][1]+ " ("+ kb_row[i][0]+ ")");	
		}else{
			if(Array.isArray(kb_row[i])){
				data = kb_row[i].join("; ");
				if(i == "timezone"){
					data = "UTC"+data;
				}else if(i == "freebase types"){
					//console.log(data);
					data = Array();
					for (index = 0; index < kb_row[i].length; index++) {
    					item = kb_row[i][index];
    					data.push($(document.createElement('a')).attr("href", item.substring(1, item.length-1)).text(item));
    					data.push("; ");
    					//console.log(item.substring(1, item.length-1));
					}
					data.pop();
					liitem.append($(document.createElement('b')).text(i + ": "));
					liitem.append(data);
					this.info_list.append(liitem);
					continue;
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
			d = d.replace(/_/g, ' ');
			var r = /\\u([\d\w]{4})/gi;
			d = d.replace(r, function (match, grp) {
    			return String.fromCharCode(parseInt(grp, 16)); } );
			d = unescape(d);
			liitem.append(d);
		}
		this.info_list.append(liitem);
	}

};

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};


