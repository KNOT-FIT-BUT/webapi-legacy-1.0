function APISwitches(cnt_id){
	
	
	this.container_sel = cnt_id;
	this.container = $(cnt_id);
	this.api_url_ner = "/api/ner/";
	this.api_url_figa = "/api/figa/";
	this.legend="API Switches";
	this.uni_sel = $(document.createElement("select")).attr("multiple","multiple").attr("id","proc_select"); 
	this.uni_sel_block = $(document.createElement("div")).append(
				this.uni_sel
			);
			
	this.ner_list = null;
	this.figa_list = null;
	
	this.resultForm={
		"RAW":{"type":"radio","name":"fResult","id":"","value":"raw","disabled":"disabled"},
		"Enhanced":{"type":"radio","name":"fResult","id":"","value":"enh","checked":""}
	};
	
	this.outputForm={
		"JSON":{"type":"radio","name":"fOutput","id":"","value":"json","checked":""},
		"XML":{"type":"radio","name":"fOutput","id":"","value":"xml","disabled":"disabled"},
		"YAML":{"type":"radio","name":"fOutput","id":"","value":"yaml","disabled":"disabled"}
	};
	
	this.parserForm={
		"NER":{"type":"radio","name":"fParser","id":"","value":"ner","checked":""},
		"FIGA":{"type":"radio","name":"fParser","id":"","value":"figa",}
	};
	
	
};

APISwitches.prototype.init = function(){
		this.container.append(
			$(document.createElement("div")).addClass("page-header").text(this.legend)
		);
		this.container.append(
			$(document.createElement('form')).addClass("form-horizontal").append(
				this.createControlGroup("Restul type:", this.resultForm),
				this.createControlGroup("Output type:", this.outputForm),
				this.createControlGroup("Parser:", this.parserForm)				
				
			)
		);
		this.container.append(
			this.uni_sel_block
		);
		
		$("input[name=fParser]").change($.proxy(this.updateUIList,this));
		this.refreshAll();
	};

	
APISwitches.prototype.createControlGroup = function(blockname, data){
	var cg = $(document.createElement('div')).addClass("control-group");
	cg.append($(document.createElement('div')).text(blockname));
	for(var k in data){
		cg.append(
			$(document.createElement('label')).attr("class","radio inline").append(
				$(document.createElement('input')).attr(data[k]),k
			)
		);
	}
	return cg;
};



APISwitches.prototype.clear = function(){
	this.container.empty();
};

APISwitches.prototype.setContainerId = function(cnt_id){
	this.container_sel = cnt_id;
};

APISwitches.prototype.updateNerList = function(data_list){
	this.ner_list = data_list;
	this.updateUIList();
	
};

APISwitches.prototype.updateFigaList = function(data_list){
	this.figa_list = data_list;
	this.updateUIList();
	
};


APISwitches.prototype.updateUIList = function(){
	this.uni_sel.empty();
	var self = this;
	var parser = $("input[name=fParser]:checked").val();
	var data_list;  
	if(parser == "figa"){
		data_list = this.figa_list;
	}else{
		data_list = this.ner_list;
	}
	if(data_list == null){return false;};
	data_list.forEach(function(entry) {
		var item = $(document.createElement("option")).text(entry["name"]).val(entry["name"]);
		if(entry["status"] == 0){
			item.attr("disabled","disabled");
		}
		self.uni_sel.append(item);
	});
	$("#proc_select option:not([disabled]):first-child").prop("selected", true);
};



APISwitches.prototype.refreshAll = function(){
	$.ajax({  
		type: "GET",  
		url: this.api_url_ner,  
		data: "",
		dataType: 'json',
		success: $.proxy(this.updateNerList,this)
	});
	$.ajax({  
		type: "GET",  
		url: this.api_url_figa,  
		data: "",
		dataType: 'json',
		success: $.proxy(this.updateFigaList,this)
	});

	
};



APISwitches.prototype.getFormatedURL = function(){
	var url = "/api/";
	var parser = $("input[name=fParser]:checked").val();
	url += parser+"/";
	var kb =this.uni_sel.find(":selected").val();
	if(kb == undefined){
		alert("Please select knowledge base for parser!");
		return null;
	} 
	url += kb + "/";
	
	return url;
	
};

APISwitches.prototype.getFormatedData = function(){
	
};
	

	
