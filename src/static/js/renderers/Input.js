
function Input(cnt_id){
	

	this.container_sel = cnt_id;
	this.container = $(cnt_id);
	this.api_url = "";
	this.legend = "Input text";
	this.button = $(document.createElement("button")).attr({"class":"btn","id":"btn1"}).text("Annotate");
	this.textarea = $(document.createElement("textarea")).attr({"rows":"15","type":"text",
				"placeholder":"Enter text here...","id":"textinput","name":"inputbox"});
	this.offset = $(document.createElement("b")).text("0").attr("id","originaloffset");
	this.filelist = $(document.createElement("ul")).attr({"class":"dropdown-menu","id":"fileList"});
	
};

Input.prototype.init = function(){
		this.container.append(
			$(document.createElement("div")).addClass("page-header").text(this.legend),
			this.textarea,
			$(document.createElement("div")).addClass("row-fluid").append(
				$(document.createElement("div")).addClass("btn-group").addClass("dropup").addClass("span2").append(
					this.button,
					$(document.createElement("button")).attr({"class":"btn dropdown-toggle","data-toggle":"dropdown"}).append(
						$(document.createElement("span")).addClass("caret")
					),
					this.filelist
				),
				$(document.createElement("div")).attr({"class":"main_loader span1","id":"l1"}).append(
					$(document.createElement("img")).attr("src","/static/img/loading-circle-.gif")
				),
				$(document.createElement("div")).text("Cursor offset: ").addClass("text-right").append(
					this.offset
					
				)
			)
		);
		
		this.textarea.on('click',function(e){
	   	   	$("#originaloffset").text($(this).prop("selectionStart"));
	   	});
		this.refresh();			
	};
	
	
	
Input.prototype.setOffset = function(off){
		this.offset.text(off);
	};
	
Input.prototype.clear = function(){
		this.container.empty();
	};
	
Input.prototype.setContainerId = function(cnt_id){
		this.container_sel = cnt_id;
	};
	
Input.prototype.addAnnotateCallback = function(fnc){
		return this.button.click(fnc);
		
	};
	
	
Input.prototype.getAnnotateID = function(){
	return "btn1";
	
};
	
Input.prototype.getInputText = function(){
		return this.textarea.val();
	};
	
		
Input.prototype.success = function(data){
		$("#l1").css("display", "none"); 
		$("#fileList").append(
			$(document.createElement('li')).append(
				$(document.createElement('a')).text(data[i]).attr({"id":data[i],"href":"#"})
			)
		);
  		for(var i in data){
	  		$("#fileList").append(
	  			$(document.createElement('li')).append(
	  				$(document.createElement('a')).text(data[i]).attr({"id":data[i],"href":"#"}).click($.proxy(this.loadText,this))
	  			)
	  		);
  		}
	};
	
Input.prototype.error = function(){};
	
Input.prototype.refresh = function(){
		$.ajax({  
  			type: "POST",  
  			url: "/parser/testFilesList/",  
  			data: "",
  			dataType: 'json',
  			success: $.proxy(this.success,this)
		});
		
	};
	
Input.prototype.loadText = function(event){
	var element = event.target;
	var texarea = this.textarea;
	filename = $(element).attr("id");
	if(filename == ""){
		this.textarea.val("");
	}else{
		$.ajax({  
		  type: "POST",  
		  url: "/parser/testFileContent/",  
		  data: "filename="+filename,
		  success: function(data){
				texarea.val(data);		
					  	
		  }
		});

	}
};
	
	
	
