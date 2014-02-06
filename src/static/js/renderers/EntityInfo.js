function EntityInfo(cnt_id){

	this.cnt_id = cnt_id;
	this.container = $(cnt_id);
	this.legend="Entity Info";
	this.info_list = $(document.createElement("ul"));
	this.gender_list = {'M':'Male','F':'Female','U':'Unknown','O':'Others'};
	this.group_btn = null;
	this.kb_row = null;
};

EntityInfo.prototype.init = function(){
	this.group_btn = $(document.createElement("div")).addClass("btn-group").append(
		$(document.createElement("button")).addClass("btn").text("<"),
		$(document.createElement("button")).addClass("btn dropdown-toggle").attr("data-toggle","dropdown").text("5/8"),
		$(document.createElement("button")).addClass("btn").text(">"),
		$(document.createElement("ul")).addClass("dropdown-menu").append(
			$(document.createElement("li")).append($(document.createElement("a")).attr("href","#").text("a")),
			$(document.createElement("li")).append($(document.createElement("a")).attr("href","#").text("a")),
			$(document.createElement("li")).append($(document.createElement("a")).attr("href","#").text("a"))
		)
	);
	this.container.append(
		$(document.createElement("div")).addClass("page-header").text(this.legend),
		this.group_btn,
		this.info_list
	);
	
		
};

	
EntityInfo.prototype.clear = function(){
	this.info_list.empty();

};


EntityInfo.prototype.listNext = function(){

};

EntityInfo.prototype.listPrev = function(){

};

EntityInfo.prototype._update = function(kb_item){
	this.clear();
	if("kb_data" in kb_item){
		this._update(kb_item["kb_data"]);
	}else if ("kb_row" in kb_item){
		this._update(kb_item["kb_row"]);
	}
};

EntityInfo.prototype.update = function(kb_row){
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


