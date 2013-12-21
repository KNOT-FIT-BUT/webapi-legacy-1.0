function EntityTab(cnt_id){

	this.cnt_id = cnt_id;
	this.container = $(cnt_id);
	this.legend="Entity list";
	this.tab_list = null;
	this.tab_content = null;
	this.tab_content_named = new Array();
	this.callback = new function(){};
	this.tab_cnt = 1;

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

EntityTab.prototype.generateTabs = function(prefix_desc){
	

	var item = $(document.createElement("li"));
	item.addClass("active").attr("id","estt-all").append(
		$(document.createElement("a")).attr({"href":"#est_filter-ALL","data-toggle":"tab"}).text("All")
	);
	var datadiv = $(document.createElement("div")).attr({"id":"est_filter-ALL"}).addClass("tab-pane").addClass("active").append(
		$(document.createElement("ul")).attr({"id":"est_ul-ALL"}).addClass("results")
	);
	
	this.tab_content_named["all"] = datadiv;
	
	this.tab_list.append(item);
	this.tab_content.append(datadiv);
	
	if(prefix_desc != null && prefix_desc != undefined){
		for(var e in prefix_desc){
			item = $(document.createElement("li"));
			var name = prefix_desc[e];
			item.attr("id","estt-"+e).append(
				$(document.createElement("a")).attr({"href":"#est_filter-"+e,"data-toggle":"tab"}).text(name)
			);
			datadiv = $(document.createElement("div")).attr("id","est_filter-"+e).addClass("tab-pane").append(
				$(document.createElement("ul")).attr({"id":"est_ul-"+e}).addClass("results")
			);
			this.tab_content_named[e] = datadiv;
			this.tab_list.append(item);
			this.tab_content.append(datadiv);
			this.tab_cnt++;
		}
		
	}
	

	
};

EntityTab.prototype.registerOnSelectCallback = function(fnc){
	this.callback = fnc;
	
};

EntityTab.prototype.focusEntity = function(ent_id){

	
	var div;
	if(this.tab_cnt == 1){
		div = this.tab_content_named["all"];
	}else{
		var prefix = ent_id.split("-")[0];
		//alert(prefix);
		div = this.tab_content_named[prefix];
		this.tab_list.find('a[href="#est_filter-'+prefix+'"]').tab('show');
	}
	
		
	div.children().first().animate({
        scrollTop: div.children().first().offset().top
    }, 0);

	div.children().first().animate({
    	scrollTop: div.find('li.'+ent_id).offset().top
    }, 0);
};


EntityTab.prototype.update = function(prefix_desc, kb_data){

	this.clear();
	this.generateTabs(prefix_desc);
	var divlist = this.tab_content_named;
	 
	
	
	for(var i in kb_data){
		var kb_row = kb_data[i];
		var i_id = kb_row["id"];
		var ci_id = i;
		var prefix = null;
		var i_data = "";
		if(prefix_desc != null && prefix_desc != undefined){
			/*if(kb_row.hasOwnProperty("display term")){
				i_data = kb_row["display term"];
				if(i_data == "" && kb_row.hasOwnProperty("preferred term")){
						i_data = kb_row["preferred term"];
					}
			}else if(kb_row.hasOwnProperty("name")){
				i_data = kb_row['name'];
			}*/
			prefix = i_id.charAt(0);
			if(prefix == "a" ){
				if(i_data == ""){
					i_data = kb_row["preferred term"];
				}
				if(i_data == ""){
					i_data = kb_row["name"];
				}
			}else if(prefix == "s" || prefix == "t"){
				i_data = kb_row['name'];
				
			}else{
				i_data = kb_row['name'];
			}
			divlist[prefix].children().first().append($(document.createElement('li')).addClass(ci_id).text(i_data).addClass(i).click(this.callback));
			divlist["all"].children().first().append($(document.createElement('li')).addClass(ci_id).text(i_data).addClass(i).click(this.callback));
		}else{
			i_data = kb_row["name"];	
			divlist["all"].children().first().append($(document.createElement('li')).addClass(ci_id).text(i_data).addClass(i).click(this.callback));
		}
		
		

		
		
	}

};