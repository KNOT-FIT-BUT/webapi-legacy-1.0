function EntityImg(cnt_id){

	this.cnt_id = cnt_id;
	this.container = $(cnt_id);
	this.legend="Entity Info";
	this.mc = $(document.createElement("div")).attr({"id":"img_carousel","class":"carousel slide"});
	this.car_indicators = $(document.createElement("ol")).addClass("carousel-indicators");
	this.car_items = $(document.createElement("div")).addClass("carousel-inner");
	this.images_url = "http://athena3.fit.vutbr.cz/kb/images/freebase/";
	this.mc.hide();
	this.left_ctrl = $(document.createElement("a")).attr({"class":"carousel-control left","href":"#img_carousel","data-slide":"prev"}).html("&lsaquo;");
	this.right_ctrl = $(document.createElement("a")).attr({"class":"carousel-control right","href":"#img_carousel","data-slide":"next"}).html("&rsaquo;");
};

EntityImg.prototype.init = function(){
	this.mc.append(
		this.car_indicators,
		this.car_items,
		this.left_ctrl,
		this.right_ctrl
		
	);

	this.container.append(
		this.mc
	);
	
		
};

	
EntityImg.prototype.clear = function(){
	this.car_indicators.empty();
	this.car_items.empty();

};


EntityImg.prototype.update = function(kb_row){
	this.mc.carousel('pause');
	this.clear();
	this.mc.hide();
	var data_slide_cnt = 0;
	var isFirst = true;
	if(kb_row.hasOwnProperty("image")){
		img_list = kb_row["image"];
		if(img_list.length > 0){
			this.right_ctrl.hide();
			this.left_ctrl.hide();
			
			for(var img in img_list){
				var pic = img_list[img];
				var picpath = this.images_url + pic;
				var img_item = $(document.createElement('div')).addClass('item carousel-div').append(
					 $(document.createElement('a')).attr({'href':picpath,"target":"blank"}).attr('rel','grp').addClass('lbox').append(
					 	$(document.createElement('img')).attr("src",picpath/*"http://placehold.it/800x480"*/).attr("alt","").addClass('lazy carousel-img').attr('data-original',picpath)
					 )
				);
				var li_item =  $(document.createElement('li')).attr({"data-target":"#img_carousel","data-slide-to":data_slide_cnt++});
				if(isFirst == true){
					img_item.addClass("active");
					li_item.addClass("active");
					isFirst = false;
				}
				this.car_indicators.append(li_item);
				this.car_items.append(img_item);
			}
			if(img_list.length > 1){
			this.right_ctrl.show();
			this.left_ctrl.show();
			}
			$("img.lazy").lazyload();
			this.mc.show();
			this.mc.carousel('cycle');
		}
		 /*$( ".carousel-div > img" ).each(function( index ) {
	         $(this).css("margin-top",-(($(this).height())/4) + 'px');
   			});
		*/
	}
	
	
	

};





