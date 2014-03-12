function EntityTab(cnt_id, settings){

	this.cnt_id = cnt_id;
	this.container = $(cnt_id);
	this.legend="Entity list";
	this.tab_list = null;
	this.tab_content = null;
	this.tab_content_named = {};
	this.callback = new function(){};
	this.color_callback = new function(){};
	this.tab_cnt = 1;
	this.colors = {};
	this.color_picker_enabled = settings["entity_select_color_btn"];
	this.color_buttons = {};
};
	
EntityTab.prototype.init = function(){
	
	this.tab_list = $(document.createElement("ul")).addClass("nav nav-tabs");
	this.tab_content = $(document.createElement("div")).addClass("tab-content");
	
	this.container.append(
			$(document.createElement("div")).addClass("page-header").text(this.legend),
			$(document.createElement("div")).addClass("tabbable tabs-left").append(this.tab_list, this.tab_content)		
		);
	
		
};

	
EntityTab.prototype.clear = function(){
	this.tab_list.empty();
	this.tab_content.empty();
	this.tab_content_named = new Array();
};

EntityTab.prototype.setColors  = function(colors){
	this.colors = colors;
};

EntityTab.prototype.generateTabs = function(prefix_desc){
	
	var first_tag = (prefix_desc == undefined || prefix_desc == null) ? "undf" : "ALL";
	//console.log(first_tag);

	var item = $(document.createElement("li"));
	item.addClass("active").attr("id","estt-"+first_tag).append(
		$(document.createElement("a")).attr({"href":"#est_filter-"+first_tag,"data-toggle":"tab"}).text("All")
	);

	var datadiv = $(document.createElement("div")).attr({"id":"est_filter-"+first_tag}).addClass("tab-pane").addClass("active").append(
		$(document.createElement("ul")).attr({"id":"est_ul-"+first_tag}).addClass("results")
	);
	
	this.tab_content_named[first_tag] = datadiv;
	
	this.tab_list.append(item);
	this.tab_content.append(datadiv);
	var ccalbck = this.color_callback;
	var QQ;
	if(prefix_desc != null && prefix_desc != undefined){
		for(var e in prefix_desc){
			item = $(document.createElement("li"));
			var name = prefix_desc[e];
			QQ = e;
			var color = (e in this.colors) ? this.colors[e] : "#000000";
			item.attr("id","estt-"+e).append(
				$(document.createElement("a")).attr({"href":"#est_filter-"+e,"data-toggle":"tab"}).text(name)
			);
			var btn = $(document.createElement("button")).addClass("btn btn-mini").attr("data-group",e).text("select color").colorpicker({"color":color});
			btn.on("hidePicker",function(ev){
						var id = $(ev.target).attr("data-group");
						ccalbck(id,ev.color.toHex());
					});
			if(this.color_picker_enabled == false){
				btn.hide();
			}
			datadiv = $(document.createElement("div")).attr("id","est_filter-"+e).addClass("tab-pane").append(
				$(document.createElement("div")).addClass("centered").append(
					btn
				),
				$(document.createElement("ul")).attr({"id":"est_ul-"+e}).addClass("results").css("background-color","white")
			);
			//datadiv.colorpicker({"color":color});
			this.tab_content_named[e] = datadiv;
			this.tab_list.append(item);
			this.tab_content.append(datadiv);
			this.tab_cnt++;
		}
		
	}else{
		var color = ("undf" in this.colors) ? this.colors["undf"] : "#000000";
		var btn = $(document.createElement("button")).addClass("btn btn-mini").attr("data-group","undf").text("select color").colorpicker({"color":color});
		btn.on("hidePicker",function(ev){
						var id = $(ev.target).attr("data-group");
						ccalbck(id,ev.color.toHex());
					});
		if(this.color_picker_enabled == false){
				btn.hide();
		}
		datadiv.prepend(
			$(document.createElement("div")).addClass("centered").append(
						btn
					)
		);
	}
	

	
};



EntityTab.prototype.registerOnSelectCallback = function(fnc){
	this.callback = fnc;
	
};

EntityTab.prototype.registerOnColorChangeCallback = function(fnc){
	this.color_callback = fnc;
};

EntityTab.prototype.focusEntity = function(ent_id){

	
	var div;
	//console.log(this.tab_content_named["undf"]);
	if(this.tab_cnt == 1){
		div = this.tab_content_named["undf"];
	}else{
		var prefix = ent_id.split("-")[0];
	
		div = this.tab_content_named[prefix];
		this.tab_list.find('a[href="#est_filter-'+prefix+'"]').tab('show');
	}
	
    if(div != undefined){		
		div.children().eq(1).animate({
	        scrollTop: div.children().eq(1).offset().top
	    }, 0);
	
		div.children().eq(1).animate({
	    	scrollTop: div.find('li.'+ent_id).offset().top
	    }, 0);
    }
};


EntityTab.prototype.update = function(prefix_desc, kb_data){

	this.clear();
	this.generateTabs(prefix_desc);
	var divlist = this.tab_content_named;
	var first_tag = (prefix_desc == undefined || prefix_desc == null) ? "undf" : "ALL";
	var prefix_cnt = {};
	prefix_cnt[first_tag] = 0;
	var undef_cnt = 0;
	if(prefix_desc != null && prefix_desc != undefined){
		for(var e in prefix_desc){
			prefix_cnt[e] = 0;
		}
		
	} 
	
	kb_data_sorted = this.KBserializeAndsort(kb_data);
	//console.log(kb_data_sorted);
	for(var i in kb_data_sorted){
		var kb_row = kb_data_sorted[i];
		//console.log(kb_row);
		var i_id = kb_row["id"];
		var ci_id = i_id.replace(":","-");
		var prefix = null;
		var i_data = "";
		if(prefix_desc != null && prefix_desc != undefined){
			prefix = i_id.charAt(0);
			prefix_cnt[prefix]++;
			prefix_cnt[first_tag]++;
			/*if(prefix == "a" ){
				i_data = kb_row["preferred term"];
				console.log(i_data);
				if(i_data == "" || i_data == undefined){
					i_data = kb_row["name"];
				}
				console.log(i_data);
				if(i_data == "" || i_data == undefined){
					i_data = kb_row["display term"];
				}
				console.log(i_data);
			}else if(prefix == "s" || prefix == "t"){
				i_data = kb_row['name'];
				
			}else{
				i_data = kb_row['name'];
			}*/
			i_data = this.getBestTextField(kb_row, true);
			divlist[prefix].find(".results").append($(document.createElement('li')).addClass(ci_id).text(i_data).click(this.callback));
			divlist[first_tag].find(".results").append($(document.createElement('li')).addClass(ci_id).text(i_data).click(this.callback));
		}else{
		    i_data = this.getBestTextField(kb_row, true);	
			divlist[first_tag].find(".results").append($(document.createElement('li')).addClass(ci_id).text(i_data).click(this.callback));
			prefix_cnt[first_tag]++;

		}
		
				
		
	}
	
		this.hideEmptyTabs(prefix_cnt);	

};

EntityTab.prototype.getBestTextField = function(kb_item, show_count){
	var fields = ["hidden text","preferred term","name","display term"];
	var field = "";
	var text = "";
	for(var i in fields){
		field = fields[i];
		if(kb_item[field] != "" && kb_item[field] != undefined){
			text = kb_item[field];
			break;
		}
	}
	if(show_count == true && kb_item.hasOwnProperty("hidden rows")){
		text = text + " (" + kb_item["hidden rows"] + ")";
		//console.log(text);
	}
	return text;
	

};


EntityTab.prototype.KBserializeAndsort = function(kb_data){

	var s_kb_data = new Array();
	var s_dates = new Array();
	var s_intervals = new Array();
	var self = this;
	
	for(var i in kb_data){
		var kb_row = kb_data[i];
		if(Array.isArray(kb_row)){
			kb_row = kb_data[i][0];	
			kb_row["hidden rows"] = kb_data[i].length;
			
		}
		
		var i_id = kb_row["id"];
		prefix = i_id.charAt(0);
		if(prefix == "s"){
			s_dates.push(kb_row);
		}else if(prefix == "t"){
		 	s_intervals.push(kb_row);
		}else{
			s_kb_data.push(kb_row);
		}
	}
	
	s_kb_data.sort(function(a,b){
		/*var sa = a["name"];
		var sb = b["name"];
		if(a["id"].charAt(0) == "a"){
			sa = a["preferred term"];
		}
		if(b["id"].charAt(0) == "a"){
			sb = b["preferred term"];
		}*/
		var sa = self.getBestTextField(a, false);
		var sb = self.getBestTextField(b, false);
		var upA = sa.toUpperCase();
    	var upB = sb.toUpperCase();
    	return (upA < upB) ? -1 : (upA > upB) ? 1 : 0;
		//return sa > sb;
	});
	
	s_dates.sort(function(a,b){
		var da = a["normalized"].split("-");
		var db = b["normalized"].split("-");
		var date_a = new Date(da[0],(da[1]-1),da[2]);
		var date_b = new Date(db[0],(db[1]-1),db[2]);
		return (date_a < date_b) ? -1 : (date_a > date_b) ? 1 : 0;
		//return a["normalized"] > b["normalized"];
	});

	s_intervals.sort(function(a,b){
		var da = a["normalized-from"].split("-");
		var db = b["normalized-from"].split("-");
		var date_a = new Date(da[0],(da[1]-1),da[2]);
		var date_b = new Date(db[0],(db[1]-1),db[2]);
		return (date_a < date_b) ? -1 : (date_a > date_b) ? 1 : 0;
		//return a["normalized-from"] > b["normalized-from"];
	});
	var ret = new Array();
	ret = ret.concat(s_kb_data);
	ret = ret.concat(s_dates);
	ret = ret.concat(s_intervals);

	return ret;
};

EntityTab.prototype.hideEmptyTabs = function(data){
	var text;
	var item;
	var total = 0;
	
	for(e in data){
		//console.log([e,data[e]]);
		if(data[e] == 0){
			$("#estt-"+e).hide();
		}else{
			item = $("#estt-"+e +" > a");
			text = item.text();
			text += "  (" + data[e] +")";
			item.text(text);
			//item.append($(document.createElement('span')).addClass("badge badge-inverse").text(data[e]));

		}
		
	}
	
};
