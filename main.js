$( function() {

	var video = document.getElementById("video");
	var canvas = document.getElementById("canvas");


	var constraints = {audio:false, video:true};

	if (navigator.getUserMedia)
		navigator.getUserMedia(constraints, gum_success, gum_failure);
	else
		gum_failure("No access to getUserMedia");


	function gum_success(stream) {
		video.src = window.URL.createObjectURL(stream);
		video.play();
	}

	function gum_failure(error) {
		alert("Your browser does not support getUserMedia()");
		console.log(error)
	}


	$("button[name='send']").on("click", function() {

		canvas.width = 350;
		canvas.height = 350*3/4;
		canvas.getContext('2d').drawImage(video, 0, 0, 350, 350*3/4);
		var img_data = canvas.toDataURL('image/png');
		// photo.setAttribute('src', data);

		post_to_server(img_data)
	});

});