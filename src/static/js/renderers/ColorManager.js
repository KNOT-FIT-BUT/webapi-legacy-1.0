function ColorManager(cnt_id){

	this.cnt_id = cnt_id;
	this.container = $(cnt_id);
	this.legend="Color Manager";
	this.color_table = $(document.createElement("table")).addClass("table");
	this.colors = null;
	this.cnt = 1;
	this.color_callback = null;
	this.import_export = null;
};
	
ColorManager.prototype.init = function(){
	
	
	this.container.append(
			$(document.createElement("div")).addClass("page-header").text(this.legend)
		);
		
	this.color_table.append(
		$(document.createElement("thead")).append(
			$(document.createElement("tr")).append(
				$(document.createElement("th")).text("entity prefix"),
				$(document.createElement("th")).text("color"),
				$(document.createElement("th")).text("add/remove")
			)
		),
		$(document.createElement("tbody")).attr("id","colorTableBody").append(
			$(document.createElement("tr")).attr("id","colorRow0").append(
				$(document.createElement("td")).append($(document.createElement("input")).attr({"type":"text","class":"input-small","placeholder":"prefix","id":"inputColorForm"})),
				/*$(document.createElement("td")).attr("id","inputColorPicker").colorpicker().on('changeColor', function(ev){
  						$(this).css("background-color",ev.color.toHex());
				})*/
				/*$(document.createElement("td")).append(
					$(document.createElement("div")).addClass("input-group").append(
						$(document.createElement("input")).attr({"type":"text","value":"","class":"form-control"}),
						$(document.createElement("span")).addClass("input-group-addon").append(
							$(document.createElement("i"))
						)
					).colorpicker().on('changeColor', function(ev){
  						$(this).css("background-color",ev.color.toHex());
					   })
				)*/
				$(document.createElement("td")).append(
					$(document.createElement("input")).attr({"type":"text","value":"","class":"form-control","id":"inputColorPicker"}).colorpicker().on('changeColor', function(ev){
  						$(this).parent().css("background-color",ev.color.toHex());
					   })
				),
				$(document.createElement("td")).append($(document.createElement("i")).addClass("icon-plus-sign").click($.proxy(this.addEntityColor,this)))
			)
		)
	);	
	
	
	
	this.container.append(this.color_table);
	
	
};

	
ColorManager.prototype.clear = function(){

	
};

ColorManager.prototype.update = function(){
	this.colors = JSON.parse(localStorage["colors"]);
	var tbody = $("#colorTableBody");
	$("tr:not(:first)", tbody).remove();
	for(var c in this.colors){
  		tbody.append(
  			$(document.createElement("tr")).attr("id","colorRow"+this.cnt).append(
				$(document.createElement("td")).text(c),
				$(document.createElement("td")).attr("id","clr_filter-"+c).append(
					$(document.createElement("input")).attr({"type":"text","value":this.colors[c],"class":"form-control"}).addClass("clrTD").colorpicker({"color":this.colors[c]})
				),
				$(document.createElement("td")).append($(document.createElement("i")).attr({"data-id":this.cnt,"data-prefix":c}).addClass("icon-minus-sign")).click($.proxy(this.removeEntityColor,this))
			)
  		);
  		this.cnt++;
  	}
  
	  var ccalbck = this.color_callback;
	  $(".clrTD").on("hidePicker",function(ev){
		var id = $(ev.target).parent().attr("id").split("-")[1];
		ccalbck(id,ev.color.toHex());
		});
	 
};


ColorManager.prototype.registerOnColorChangeCallback = function(fnc){
	this.color_callback = fnc;
};

ColorManager.prototype.removeEntityColor = function(event){
	var element = event.target;
	var id = $(element).attr("data-id");
	var prefix =$(element).attr("data-prefix");
	$("#colorRow"+id).remove();
	this.color_callback(prefix,null);
};

ColorManager.prototype.addEntityColor = function(event){
	var prefix = $("#inputColorForm").val();
	$("#inputColorForm").val("");
	var color = $("#inputColorPicker").val();
	$("#inputColorPicker").css("background-color","");
	this.color_callback(prefix,color);
	/*$("#colorTableBody").append(
		$(document.createElement("tr")).attr("id","colorRow"+this.cnt).append(
				$(document.createElement("td")).append(prefix),
				$(document.createElement("td")).attr("id","clr_filter-"+prefix).append(
					$(document.createElement("input")).attr({"type":"text","value":color,"class":"form-control"}).addClass("clrTD").colorpicker({"color":color})
				),
				$(document.createElement("td")).append($(document.createElement("i")).attr({"data-id":this.cnt,"data-prefix":color}).addClass("icon-minus-sign")).click($.proxy(this.removeEntityColor,this))
			)
	);*/
	this.cnt++;
};

