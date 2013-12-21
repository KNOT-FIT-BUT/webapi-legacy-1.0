var master_text = "";
var item_list = [];
var kb_data = [];
var colors = {"p":"#666666","l":"#ccddee","w":"#ff9e00","c":"#ff895c",
				"e":"#b0bfd2","f":"#bfd2b0","d":"#ffd792","m":"#bf0000",
				"g":"#9e90a3","n":"#669900","s":"#c5e26d","t":"#ffd070"};
				
var images_url = "http://athena3.fit.vutbr.cz/kb/images/freebase/";

$(document).ready(
function() {
  //$("#fileList").change(function(){})
 	
  $("#textinput").on('click',function(e){
   	//alert("qq");
   	//console.log($(this).prop("selectionStart"));
   	$("#originaloffset").text($(this).prop("selectionStart"));
   });
   
  $.ajax({  
  type: "GET",  
  url: "/parser/testFilesList/",  
  data: "",
  dataType: 'json',
  success: function(data){
  	$("#fileList").append($(document.createElement('li')));
  	for(var i in data){
  		$("#fileList").append(
  			$(document.createElement('option')).append(
  				$(document.createElement('a')).text(data[i]).attr({"id":data[i],"href":"#"}).click(
  					function(){
  						filename = $(this).attr("id");
  						if(filename == ""){
  							$("#textinput").val("");
  						}else{
				  			$.ajax({  
							  type: "POST",  
							  url: "/parser/testFileContent/",  
							  data: "filename="+filename,
							  success: function(data){
									$("#textinput").val(data);			  	
							  }
							});
  			
  						}
  					}
  				)	
  			)
  		);
  	}
  	$("#fileList").change(function(){
  		filename = $(this).val();
  		if(filename == ""){
  			$("#textinput").val("");
  		}else{
  			$.ajax({  
			  type: "POST",  
			  url: "/parser/testFileContent/",  
			  data: "filename="+filename,
			  success: function(data){
					$("#textinput").val(data);			  	
			  }
			});
  			
  		}
  	});	
  }
});
  
  
  $("#l1").css("display", "none");  
  $("#btn1").click(function() {  
    datastring = "text=" + encodeURIComponent($("#textinput").val()+'\n').replace(/[!'()]/g, escape).replace(/\*/g, "%2A");
    
   $("#l1").css("display", "block");  
   
    
$.ajax({  
  type: "POST",  
  url: "/api",  
  data: datastring,
  dataType: 'json',
  success: generate_visual_output,
  error:function( jqXHR, textStatus, errorThrown ) {  
    $('#textoutput').val(textStatus + ' -> ' +errorThrown);  
    $("#l1").css("display", "none");  
  }  
});  
return false;
  });  
}); 



function generate_visual_output(data){
	//alert(data.length);

	var datesID = 0;
	var interID = 0;
	item_list = [];
	kb_data = [];
	/*master_text = "";
    item_list.splice(0, item_list.length);
    kb_data.splice(0, kb_data.length);
	delete item_list;
	delete kb_data;
	*/
	$('#textoutput').val(JSON.stringify(data, null, "  "));  
    $("#l1").css("display", "none");  
    $("div#visual>pre").remove();	
    //alert(data.length);
	for(var i in data){
		item = data[i];
		//console.log(item);
		if(item.hasOwnProperty("kb")){
			kbID = item.kb.id.replace(":","-");
			iitems = item.items;
			for(var d in iitems){
				var i = iitems[d];
				i.push(kbID);
				item_list.push(i);
			}
			kb_data[kbID] = item.kb;
			
		}else if (item.hasOwnProperty("dates")){
			dateList = item["dates"];
			for(var d in dateList){
				var date = dateList[d];
				var id ="s-" + datesID.toString();
				console.log(date);
				date.push(id);
				item_list.push(date);
				kb_data[id] = {'id':id,'name':date[2], 'type':'Date'};
				datesID++;
			}
		}else if (item.hasOwnProperty("intervals")){ 
			dateList = item["intervals"];
			for(var d in dateList){
				var date = dateList[d];
				var id = "t-" + datesID.toString();
				console.log(date);
				date.push(id);
				item_list.push(date);
				kb_data[id] = {'id':id,'name':date[2],'type':'Interval'};
				datesID++;
			}

		}else{continue;}
	}
	
	item_list.sort(function(a,b){
    return a[0] - b[0];
	});
	
	
	
	var t_start = 0;
	var t_stop = 0;
	var t_in = $("textarea#textinput").val();
	var t_out = $(document.createElement('pre'));
	var f = 0;
	//alert(item_list.length);
	for(var i in item_list){
		//alert(item_list[i]);
		i_length = item_list[i].length;
		
		i_start = item_list[i][0];
		i_stop = item_list[i][1];
		i_data = item_list[i][2];
		
		i_id = item_list[i][item_list[i].length - 1];
		prefix = i_id.charAt(0);
		color = colors[prefix];
			
		t_stop = i_start;
		
		t_out.append($(document.createElement('span')).text(t_in.substring(t_start, t_stop)).attr('data-start',t_start));
		t_out.append($(document.createElement('strong')).text(i_data).addClass(prefix).addClass(i_id).attr('data-start',t_stop).click(selectEntityFromText));
		t_start = i_stop;

		
				
		
	}
	t_out.append($(document.createElement('span')).text(t_in.substring(t_start)).attr('data-start',t_start));
	//t_out.append(t_in.substring(t_start));
	//alert(item_list.length);
	t_out.select(function(){
		$(this).selectionStart();
	});
	t_out.children().click(getSelectionPosition);
	$("#visual").append(t_out);
	updateResultListPane();
	focusResultPane();
	return false;
		
}

function focusResultPane(){
	
    $('html, body').animate({
        scrollTop: $("#resultPane").offset().top -35
    }, 500);
	
}

function updateResultListPane(){
	
	occurance = {"a":0,"p":0,"l":0,"w":0,"c":0,
				"e":0,"f":0,"d":0,"m":0,
				"g":0,"n":0,"s":0,"t":0};
				
	for(var i in kb_data){
		kb_row = kb_data[i];
		i_id = kb_row.id;
		//alert(i_id);
		prefix = i_id.charAt(0);
		occurance[prefix]++;
		occurance['a']++;
	}
	$("#occurance-tab>div").remove();
	container = $("#occurance-tab");
	
	for(var i in occurance){
		div = $(document.createElement('div')).attr('id',"filter_"+i).addClass("tab-pane");
		if(i == "a"){
			div.addClass("active");
		}
		div.append("Total: " + occurance[i].toString());
		list = $(document.createElement('ul')).addClass("results");//.attr("multiple","multiple");
		div.append(list);
		container.append(div);
	}
	
	/*
	for(var i in item_list){
		i_id = item_list[i][item_list[i].length - 1];
		i_data = item_list[i][2];
		ci_id = i_id.replace(":","-");
		prefix = i_id.charAt(0);
		text = i_data+ " "+ kb_data[i_id].type;
		$("#filter_"+prefix+">select").append($(document.createElement('option')).addClass(ci_id).text(text));
		$("#filter_a>select").append($(document.createElement('option')).addClass(ci_id).text(text));
		
	}*/
	
	
	for(var i in kb_data){
		//console.log(i)
		kb_row = kb_data[i];
		//console.log(kb_row);
		i_id = kb_row["id"];
		ci_id = i;
		prefix = i_id.charAt(0);
		if(prefix == "p"){
			//console.log(kb_row);
			i_data = kb_row["display term"];
			if(i_data == ""){
				i_data = kb_row["preferred term"];
			}
		}else if(prefix == "s" || prefix == "t"){
			i_data = kb_row['name'];
			
		}else{
			i_data = kb_row['name'];
		}
		
		//alert(text);
		$("#filter_"+prefix+">ul").append($(document.createElement('li')).addClass(ci_id).text(i_data).addClass(i).click(selectEntitnyFromList));
		$("#filter_a>ul").append($(document.createElement('li')).addClass(ci_id).text(i_data).addClass(i).click(selectEntitnyFromList));
		
	}
	
}


function deselectAndEmptyPanes(){
	$(".sel").each(function(){
	  $(this).removeClass("sel");
	});
	
	$("ul.thumbnails>li").remove();
	$("#ent_info>li").remove();
}

function selectEntityAndUpdatePanes(group_id){
	$("."+group_id).each(function(){
		$(this).addClass("sel");
	})	;
	
	//alert(group_id);
	updateKBPane(kb_data[group_id]);
	$("img.lazy").lazyload();

	
}

function selectEntityFromText(){
	//deselect
	
	deselectAndEmptyPanes();
	group_id = $(this).attr("class").split(/\s+/)[1]; 
	
	
	//delete entity info
	$('#myTab2 a[href="#filter_'+group_id.charAt(0)+'"]').tab('show');
	
	$('div#filter_'+group_id.charAt(0)+' ul.results').animate({
        scrollTop: $('div#filter_'+group_id.charAt(0)+' ul.results').offset().top
    }, 0);

	$('div#filter_'+group_id.charAt(0)+' ul.results').animate({
    	scrollTop: $('div#filter_'+group_id.charAt(0)+' li.'+group_id).offset().top
    }, 0);

	selectEntityAndUpdatePanes(group_id);
}

function selectEntitnyFromList(){
	deselectAndEmptyPanes();
	group_id = $(this).attr("class"); 
	
	$('#visual>pre').animate({
        scrollTop: $('#visual>pre').offset().top
    }, 0);
	
	$('#visual>pre').animate({
        scrollTop: $('#visual strong.'+group_id+":first").offset().top -10
    }, 0);
/*
	$('div#filter_'+group_id.charAt(0)+' ul.results').animate({
    	scrollTop: $('div#filter_'+group_id.charAt(0)+' li.'+group_id).offset().top
    }, 0);
	*/
	selectEntityAndUpdatePanes(group_id);
}


function updateKBPane(kb_row){
	
	var e_info = $("#ent_info");
	for(var i in kb_row){
		liitem = $(document.createElement('li'));
		if(kb_row[i] == ""){
			//liitem.text(i + ": -");
			continue;
		}else if(i == "wikipedia url" || i == "freebase url" || i == "dbpedia url"){
			liitem.text(i + ": ");
			liitem.append($(document.createElement('a')).attr('href',kb_row[i]).text(kb_row[i]));
		}else if(i == "image"){
			updateImagePane(kb_row[i]);
			liitem.text(i + ": "  + kb_row[i].join(", "));

			
		}else{
			if(Array.isArray(kb_row[i])){
				data = kb_row[i].join(", ");	
			}else{
				data = kb_row[i];
			}
			liitem.append(i + ": " + data);
		}
		
		e_info.append(liitem);
	}
	
}

function updateImagePane(img_list){
	container = $(".thumbnails");
	for(var img in img_list){
		pic = img_list[img];
//		ext = pic.spli(".");
		//ext = ext[ext.length -1];
		picpath = images_url + pic;
		li = $(document.createElement('li')).addClass('span4').append(
			 $(document.createElement('a')).attr('href',picpath).attr('rel','grp').addClass('lbox').append(
			 	$(document.createElement('img')).attr("src","http://placehold.it/300x200").attr("alt","").addClass('lazy').attr('data-original',picpath)
			 )
			 
			 
		); 
		container.append(li);

	
	}
	$(".lbox").lazyload();
			
	
}

(function ($, undefined) {
    $.fn.getCursorPosition = function() {
        var el = $(this).get(0);
        var pos = 0;
        if('selectionStart' in el) {
            pos = el.selectionStart;
        } else if('selection' in document) {
            el.focus();
            var Sel = document.selection.createRange();
            var SelLength = document.selection.createRange().text.length;
            Sel.moveStart('character', -el.value.length);
            pos = Sel.text.length - SelLength;
        }
        return pos;
    };
})(jQuery);


function getSelectionPosition () {
    var selection = window.getSelection();
    //console.log(selection.focusNode.data, selection.focusOffset);
    //console.log(selection.focusNode.data[selection.focusOffset]);
    var offset = parseInt($(this).attr('data-start'));
    //alert(offset + selection.focusOffset);
    $("#visualoffset").text(offset + selection.focusOffset);
}




