function OutputTabs(cnt_id){

	this.cnt_id = cnt_id;
	this.container = $(cnt_id);
	this.legend="Output";
	this.tab_list = null;
	this.tab_content = null;

	
	

};
	
OutputTabs.prototype.init = function(){
	
	this.tab_list = $(document.createElement("ul")).addClass("nav nav-tabs");
	this.tab_content = $(document.createElement("div")).addClass("tab-content");
	
	this.container.append(
			$(document.createElement("div")).addClass("page-header").text(this.legend),
			$(document.createElement("div")).addClass("tabbable tabs-up").attr("id","ot-tabControl").append(this.tab_list, this.tab_content)		
		);
	
	//this.container.hide();
		
};

	
OutputTabs.prototype.clear = function(){
	this.tab_list.empty();
	this.tab_content.empty();
};

OutputTabs.prototype.addTab = function(name, pane){
	var id = "ot-"+name;
	var li = $(document.createElement("li")); 
	var div = $(document.createElement("div"));
	
	div.attr("id",id).addClass("tab-pane");
	
	if(this.tab_list.children().length == 0){
		li.addClass("active");
		div.addClass("active");
	}
	
	li.append(
		$(document.createElement("a")).attr({"href":"#"+id,"data-toggle":"tab"}).text(name)
	);
	
	this.tab_list.append(
		li
	);
	this.tab_content.append(
		div
	);
	
	pane.init("#"+id);
};

OutputTabs.prototype.tabSwitch = function(tab_name){
	
	$('#ot-tabControl a[href=#ot-'+tab_name+']');
};

