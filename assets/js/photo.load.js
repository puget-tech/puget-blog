jQuery(document).ready(function(){

  $('#no-js-more-photo').hide();

	//initialize fancybox on existing thumbs
	if($(".thumb-group").length > 0){
		$(".thumb-group").fancybox({
			nextEffect : 'fade',
			openEffect : 'fade',
			closeEffect : 'fade',
			prevEffect : 'fade'
		});
	}

	//load additional thumbs via ajax request
	$.ajax({
    url: "http://{{hostname}}/wp-admin/admin-ajax.php".interpolate({hostname:window.location.host}),
    type: "POST",
    data: {
	    action: 'mym_photo_load',
      post_id: photo_load.mym_post_id
    },

		success: function(resp) {
			//collection of image objects to append to gallery
      console.log(resp);
			var imgList = jQuery.parseJSON(resp);
			var template = "<div class='gallery-item'><a href='{{full}}' class='thumb-group' rel='gallery' title='{{caption}}'><img class='gallery-thumb' src='{{thumb}}'/><div class='gallery-caption'>{{caption}}</div></a></div>";
			var html = '';

			//single image from list
			var imageObj = null;

			//collection of sets of 5
			var sets = new Array();

			//single set (will be set of 5 els)
			var set = $();

			//create a single set of five, and push to the collection
	    for( var i = 0 ; i - imgList.length < 1 ; i +=5 ){
				set = [];
		    for ( var j = i ; j < i+5 ; j++ ){
			    imageObj = (imgList[j]) ? imgList[j] : null;

					if(imageObj){
						html = template.interpolate(imageObj);
						set.push(html);
					}
				}

		    //push the set of five to the collection of sets
		    sets.push(set);
	    }

			//pass the entire collection to mymPhotoLoader
			$.mymPhotoLoader.queueSets(sets);
			//append the els to the document
			$.mymPhotoLoader.addSets();
    }
	});//ajax success function

	jQuery.mymPhotoLoader = {

		sets: [],
		setIndex : 0,
		loadedCue: 0,

		addSets : function(){
			var that = this;
			var index = this.setIndex;
			var set = this.sets[index];

			if(set){
				$.each(set, function(i, e){
					$(e).find('.gallery-caption:empty').remove().end().insertAfter('.gallery-item:last').find('img').bind('load', function(){
						that.loadedCue += 1;
						if(that.loadedCue === 5){
							that.loadedCue = 0;
							that.setIndex += 1;

							//reset the fancybox gallery to include newly added thumbs
								$.fancybox.group = $('.thumb-group');
							setTimeout(function(){that.addSets()}, 100);
						}
					});
				});
			}
		},

		queueSets : function(sets){
			this.sets = sets;
		}

	};
});//document ready


//string example:  hello {{name}}
//obj data:      data.name = world;
//output:   example.interpolate(data) returns hello world;
String.prototype.interpolate = function(data){
	return this.replace(/\{\{(\S+)\}\}/g, function(placeholder, property){
		return data[property];
	});
};