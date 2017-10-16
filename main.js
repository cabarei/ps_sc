$( function() {

	webcam_stream = document.getElementById("webcam_stream");
	cv = document.getElementById("cv");

	$(window).on("resize", resize_elements);
	$("#take_picture").on("click", take_picture);

	create_buttons();
	resize_elements();

	activate_webcam();
	// fake_activate_webcam(); //*

	selected_style = -1;
	webcam_image = "";

})



function resize_elements(){
	
	var aspect_ratio = 16/9;

	var w_width = $(window).width();
	var w_height = $(window).height();

	var separation = 0.08 * w_width;
	var side_margin = 0.05 * w_width;

	var c_width = 0.5 * (w_width - separation) - side_margin;
	var c_height = c_width / aspect_ratio;

	var top_margin = 0.4 * (w_height - c_height);


	cv.width = c_width;
	cv.height = c_height;

	$(".img_container").width(c_width);
	$(".img_container").height(c_height);

	$("#webcam_stream").css({top: top_margin, left: side_margin});
	$("#final_image").css({top: top_margin, left: side_margin + c_width + separation});
	$("#final_filter").css({top: top_margin, left: side_margin + c_width + separation});


	sp_width = Math.min(180, Math.max(60, 0.2 * c_width));
	sp_height = 0.35 * sp_width;

	$("#take_picture").width(sp_width);
	$("#take_picture").height(sp_height);

	$("#take_picture").css({top: top_margin + c_height, left: side_margin + 0.5 * (c_width - sp_width), "line-height": sp_height+"px" });

	$("#style_buttons_container").width(c_width);
	$("#style_buttons_container").css({top: top_margin + c_height, left: side_margin + c_width + separation});


	var sb_width = 0.8*(c_width / n_styles - 4);
	var sb_height = sb_width / aspect_ratio;
	var sb_margin = 0.08*(c_width / n_styles);

	$(".style_button").width(sb_width);
	$(".style_button").height(sb_height);
	$(".style_button").css({"margin-left": sb_margin, "margin-right": sb_margin}); 

}



function activate_webcam(){

	// console.log("webcam!");

	webcam_stream.addEventListener('playing', function(ev) {
		console.log("playing!");
		console.log(ev);
	})

	
	var constraints = {audio:false, video:true};
	var constraints = {
		audio: true,
		video: {
			width: { min: 1024, ideal: 1280, max: 1920 },
			height: { min: 576, ideal: 720, max: 1080 }
		}
	}


	// function hasGetUserMedia() {
	//   return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
	//             navigator.mozGetUserMedia || navigator.msGetUserMedia);
	// }
	// //o Modernizr...


	if (navigator.getUserMedia){
		navigator.getUserMedia(constraints, gum_success, gum_failure);
	} else
		gum_failure("No access to webcam");


	function gum_success(stream) {
		webcam_stream.src = window.URL.createObjectURL(stream);
		webcam_stream.play();
	}

	function gum_failure(error) {
		console.log(error);
		alert("Your browser does not support webcam access");
	}

}


function fake_activate_webcam(){ //*
	webcam_stream.src = "z/zsmall.mp4";
	webcam_stream.loop = true;
	webcam_stream.muted = true;
	webcam_stream.play();
}



function take_picture(style){

	cv.getContext('2d').drawImage(webcam_stream, 0, 0, cv.width, cv.height);
	var img_data = cv.toDataURL('image/png');
	var img_style = style || 0;

	$("#final_image").addClass('notransition');
	// $("#final_image").css({"background-image": "url(z/z2.png)"}); //*
	$("#final_image").css({"background-image": "url("+img_data+")"});
	$("#final_image")[0].offsetHeight;
	$("#final_image").removeClass('notransition');

	webcam_image = img_data;

	// post_to_server(img_data, img_style);

}



function create_buttons(){
	
	n_styles = 5;

	for (var i=0; i<n_styles; i++){

		var id = "style_button_"+i;
		$("#style_buttons_container").append('<div id="'+id+'" index='+i+' class="button style_button"></div>');
		
		// $("#"+id).css({"background-image": "url(styles/"+i+".jpg)"});


		$("#"+id).on("click", function(){
			selected_style = parseInt( $(this).attr("index") );
			update_selected_style();
			$("#final_image").css({"background-image": "url(z/z1.png)"}); //*
			post_to_server(webcam_image, selected_style);

			// $("#final_image").css({"background-image": "url("+processed_images[0]+")"}); //*
			
		})


	}
}



function update_selected_style(){

	$(".selected").removeClass("selected");

	if (selected_style == -1){
		$("#take_picture").addClass("selected");
	} else {
		$("#style_button_"+selected_style).addClass("selected");
	}

}



$(window).keydown(function(e){

	// console.log(e.which);
	
	if (e.which == 37){
		selected_style = Math.max(-1, selected_style-1);
		update_selected_style();
	}

	if (e.which == 39){
		selected_style = Math.min(n_styles-1, selected_style+1);
		update_selected_style();
	}

	if (e.which == 38 || e.which == 40){
		$(".selected").removeClass("selected");
		selected_style = -1;
	}
	
	if (e.which == 13){
		$(".selected").addClass("activated");
		setTimeout( function(){ $(".selected").removeClass("activated"); }, 150);
		$(".selected").trigger("click");
	}

})
