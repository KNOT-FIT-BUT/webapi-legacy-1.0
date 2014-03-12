function ResultRaw(){

	this.cnt_id = null;
	this.container = null;
	this.legend="RAW";
	this.mc = $(document.createElement("textarea"));
	

};
	
ResultRaw.prototype.init = function(cnt_id){
	
	this.cnt_id = cnt_id;
	this.container = $(cnt_id);
	this.mc.attr({"rows":"40","type":"text"});
	this.container.append(
			this.mc	
		);
	
	//this.container.hide();
		
};

	
ResultRaw.prototype.clear = function(){
	this.mc.val("");
	
};

ResultRaw.prototype.update = function(data){
	this.mc.empty();
	this.mc.val(data);
};


ResultRaw.prototype.getText = function(data){
	return this.mc.val();
};
