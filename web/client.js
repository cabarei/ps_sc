processed_images = [];


function post_to_server(data, style){

	var image_style = style || 0;

	// var server_url = "http://localhost:8080/process";
	var server_url = "http://34.249.147.24:8080/process";

	console.log("posting to " + server_url);

	$.ajax({
		url: server_url,
		method: "POST",
		dataType: "json",
		data: JSON.stringify({"img": data, "style": image_style}),
		success: function (answer){
			console.log("answer:", answer)
			process_answer(answer);
		},
		error: function( error ){
			console.log("error:", error);
		}
	})

}
			 

function process_answer(answer){

	// var image = new Image();
	var image_src = 'data:image/png;base64,'+answer.img;
	
	//document.body.appendChild(image);

	processed_images.unshift(image_src);
	$("#final_image").css({"background-image": "url("+image_src+")"}); //*


}
