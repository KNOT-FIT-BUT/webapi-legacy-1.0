function KBManager(cnt_id){
	this.container_sel = cnt_id;
	this.container = $(cnt_id);
	this.tbody = null;
	this.api_url = "/api/kb/";
	this.legend = "KnowledgeBase manager";
	this.refresh_icon = $(document.createElement("i")).addClass("icon-refresh").attr("id","kbman_irefresh");
	this.last_data = null;
	this.kb_total = 0;
	this.kb_loading = 0;
	this.kb_loaded = 0;
	this.kb_updated = 0;
	this.pbar = $(document.createElement("div")).addClass("bar").css("width","100%");
	this.pbarblock = $(document.createElement("div")).addClass("progress progress-striped active span3").append(this.pbar).hide();
	this.on_change_callback = null;
	this.time = 5000;
};
	
KBManager.prototype.init = function(){
	this.tbody = $(document.createElement('tbody'));
	this.container.append(
		$(document.createElement("div")).addClass("page-header").text(this.legend)
	);
	this.container.append(
		$(document.createElement('table')).addClass("table").addClass("table-condensed").append(
			$(document.createElement('thead')).append(
				$(document.createElement('tr')).append(
					$(document.createElement('th')).text("Name"),
					$(document.createElement('th')).text("P"),
					$(document.createElement('th')).append(
						$(document.createElement('abbr')).append($(document.createElement('i')).addClass("icon-hdd")).attr("title","Memory usage [MiB]")
					),
					$(document.createElement('th')).append(
						$(document.createElement('abbr')).append($(document.createElement('i')).addClass("icon-time")).attr("title","Load Time [s]")
					),
					$(document.createElement('th')).append(
						$(document.createElement('abbr')).append($(document.createElement('i')).addClass("icon-tasks")).attr("title","Status")
					),
					$(document.createElement('th')).append(
						$(document.createElement('abbr')).append($(document.createElement('i')).addClass("icon-wrench")).attr("title","Control")
					)
				)
			),
			this.tbody
			
		),
		this.pbarblock,
		$(document.createElement("div")).addClass("text-right").append(
			    "Reload from disk: ",
				this.refresh_icon.click($.proxy(this.reload, this))
		)
		
		);
	this.repeater();

};
	
KBManager.prototype.clear = function(){
		this.container.empty();
};
	
KBManager.prototype.setContainerId = function(cnt_id){
		this.container_sel = cnt_id;
};

KBManager.prototype.registerOnChangeCallback = function (fnc){
	this.on_change_callback = fnc;
};
	
KBManager.prototype.updateBody = function(kb_list){
	this.tbody.empty();
	kb_list.forEach(function(entry) {
		
	});
};


KBManager.prototype.repeater = function(){
	this.refresh();
	if((this.kb_updated != this.kb_loaded) && this.on_change_callback != null){
		this.on_change_callback();
		
	}
	this.kb_loaded = this.kb_updated;
	setTimeout($.proxy(this.repeater, this), this.time);	
	
	
};


KBManager.prototype.refresh = function(){
		this.refresh_icon.attr("class","icon-time");
		$.ajax({  
  			type: "GET",  
  			url: this.api_url,  
  			data: "",
  			dataType: 'json',
  			success: $.proxy(this.success,this)
		});
		
};

KBManager.prototype.reload = function(){
	this.refresh_icon.attr("class","icon-time");
	$.ajax({  
  			type: "GET",  
  			url: this.api_url+"reload/",  
  			data: "",
  			dataType: 'json',
  			success: $.proxy(this.success,this)
		});
};
	
KBManager.prototype.success = function(data){
	this.tbody.empty();
	this.kb_updated = 0;
	this.kb_total = 0;
	this.kb_loading = 0;
	for(var c in data){
		row = data[c];
		this.tbody.append(
			$(document.createElement('tr')).append(
				$(document.createElement('td')).text(row["name"]),
				$(document.createElement('td')).text(row["processor"]),
				$(document.createElement('td')).text((row["size"]/1024.0).toFixed(2)),
				$(document.createElement('td')).text(row["load_time"].toFixed(2)),
				$(document.createElement('td')).append(this.getStatusIcon(row["status"])),
				$(document.createElement('td')).append(this.getControlIcon(row["status"]).attr("data-kb",row["name"]))
			)
		);
		
	};
	this.refresh_icon.attr("class","icon-refresh");
	if(this.kb_loading > 0){
		this.pbar.css("width",(100/++this.kb_loading)+"%");
		this.pbarblock.show();
		this.time = 1000;
		
	}else{
		this.pbarblock.hide();
		this.time = 5000;
	}
	
};

KBManager.prototype.getControlIcon = function(status){
	this.kb_total++;
	icon = $(document.createElement('i')).addClass("icon-warning-sign");
	switch(status){
	case 0:
	  	icon = $(document.createElement('i')).addClass("icon-plus").click($.proxy(this.loadKB,this));
	  break;
	case 1:
		icon = $(document.createElement('i')).addClass("icon-remove").click($.proxy(this.dropKB,this));;
		this.kb_loading++;
	  break;
    case 2:
	  icon = $(document.createElement('i')).addClass("icon-lock");
	  	this.kb_loading++;
	  	//console.log(this.kb_loading);
	  break;
	case 3:
	  icon = $(document.createElement('i')).addClass("icon-lock");
	  	this.kb_loading++;
	  	//console.log(this.kb_loading);
	  break;
	case 4:
	  icon = $(document.createElement('i')).addClass("icon-remove").click($.proxy(this.dropKB,this));;
	  this.kb_updated++;
	  break;
	default:
	}
	return icon;

};

KBManager.prototype.getStatusIcon = function(status){
	this.kb_total++;
	icon = $(document.createElement('i')).addClass("icon-warning-sign");
	switch(status){
	case 0:
	  	icon = $(document.createElement('i')).addClass("icon-off");
	  break;
	case 1:
		icon = $(document.createElement('i')).addClass("icon-time");
	  break;
    case 2:
	  icon = $(document.createElement('i')).addClass("icon-arrow-up");
	  break;
	case 3:
	  icon = $(document.createElement('i')).addClass("icon-arrow-down");
	  break;
	case 4:
	  icon = $(document.createElement('i')).addClass("icon-ok");
	  break;
	default:
	}
	return icon;

};

KBManager.prototype.loadKB = function(event){
	var element = event.target;
	kbname = $(element).attr("data-kb");
	this.sendCommand("PUT",this.api_url, kbname, "text");
};
KBManager.prototype.dropKB = function(event){
	var element = event.target;
	kbname = $(element).attr("data-kb");
	this.sendCommand("DELETE",this.api_url, kbname, "text");
};
KBManager.prototype.sendCommand = function(dtype, durl, ddata, ddataType){
	var self = this;
	this.refresh_icon.attr("class","icon-time");
		$.ajax({  
  			type: dtype,  
  			url: durl+ddata,  
  			data: "",
  			dataType: ddataType,
  			success: function(){self.refresh();}
		});
};

	

	
