function EntityImg(cnt_id){

	this.cnt_id = cnt_id;
	this.container = $(cnt_id);
	this.legend="Entity Info";
	this.mc = $(document.createElement("div")).attr({"id":"img_carousel","class":"carousel slide"});
	this.car_indicators = $(document.createElement("ol")).addClass("carousel-indicators");
	this.car_items = $(document.createElement("div")).addClass("carousel-inner");
	this.images_url = "http://athena3.fit.vutbr.cz/kb/images/freebase/";
	this.mc.hide();
};

EntityImg.prototype.init = function(){
	this.mc.append(
		this.car_indicators,
		this.car_items,
		$(document.createElement("a")).attr({"class":"carousel-control left","href":"#img_carousel","data-slide":"prev"}).text("<"),
		$(document.createElement("a")).attr({"class":"carousel-control right","href":"#img_carousel","data-slide":"next"}).text(">")
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
	this.clear();
	this.mc.hide();
	var data_slide_cnt = 0;
	var isFirst = true;
	if(kb_row.hasOwnProperty("image")){
		img_list = kb_row["image"];
		if(img_list.length > 0){
			for(var img in img_list){
				var pic = img_list[img];
				var picpath = this.images_url + pic;
				var img_item = $(document.createElement('div')).addClass('item').append(
					 $(document.createElement('a')).attr({'href':picpath,"target":"blank"}).attr('rel','grp').addClass('lbox').append(
					 	$(document.createElement('img')).attr("src",picpath/*"http://placehold.it/800x480"*/).attr("alt","").addClass('lazy').attr('data-original',picpath)
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
			$("img.lazy").lazyload();
			this.mc.show();
		}
		
	}
	
	
	

};





