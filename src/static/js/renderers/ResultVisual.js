function ResultVisual(){

	this.cnt_id = null;
	this.container = null;
	this.legend="Visual";
	this.mc = $(document.createElement("pre"));
	
	this.colors = {};
				
	this.offset = $(document.createElement("b"));
	this.offset.text("0");
	this.callback = new function(){};
	

};
	
	
	
	
ResultVisual.prototype.init = function(cnt_id){
	
	this.cnt_id = cnt_id;
	this.container = $(cnt_id);
	this.container.append(
			$(document.createElement("div")).addClass("text-right").append(
				"Cursor offset:",
				this.offset
				
			),
			this.mc	
		);
	
	//this.container.hide();
		
};

	
ResultVisual.prototype.clear = function(){
	this.mc.empty();
};

ResultVisual.prototype.setColors = function(col){
	this.colors = col;
};

ResultVisual.prototype.registerOnSelectCallback = function(fnc){
	this.callback = fnc;
	
};

ResultVisual.prototype.update = function(text_original, item_list){
	var t_start = 0;
	var t_stop = 0;
	var t_in = text_original;
	var f = 0;
	//alert(item_list.length);
	for(var i in item_list){
		//alert(item_list[i]);
		var i_length = item_list[i].length;
		
		var i_start = item_list[i][0];
		var i_stop = item_list[i][1];
		var i_data = item_list[i][2];
		
		var i_id = item_list[i][item_list[i].length - 1];
		var prefix = i_id.charAt(0);
		//var color = (prefix in this.colors) ? this.colors[prefix] : "#FFFFFF";
		if(!isLetter(prefix)){
			prefix = "undf";
		}
			
		t_stop = i_start;
		
		this.mc.append($(document.createElement('span')).text(t_in.substring(t_start, t_stop)).attr('data-start',t_start));
		this.mc.append($(document.createElement('strong')).text(i_data).addClass(prefix).addClass(i_id).attr('data-start',t_stop).click(this.callback));//.css("color",color));
		t_start = i_stop;
	}
	this.mc.append($(document.createElement('span')).text(t_in.substring(t_start)).attr('data-start',t_start));
	this.mc.select(function(){
		$(this).selectionStart();
	});
	this.mc.children().click($.proxy(this.setCursorOffset, this));
	//this.mc.children().css("cursor","text");
};

ResultVisual.prototype.setCursorOffset = function(event){
	var element = event.target;
	var selection = window.getSelection();
    var offset = parseInt($(element).attr('data-start'));
    this.offset.text(offset + selection.focusOffset);

};

ResultVisual.prototype.focusEntity = function(group_id){
	this.mc.animate({
        scrollTop: this.mc.offset().top
    }, 0);
	
	this.mc.animate({
        scrollTop: this.mc.find('strong.'+group_id+":first").offset().top -10
    }, 0);
};

function isLetter(strValue){
   var objRegExp  = /^[a-z]+$/;
   return objRegExp.test(strValue);
};



