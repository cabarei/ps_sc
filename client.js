processed_images = [];


function post_to_server(data, img_style){

	var server_url = ""

	// server_url = "http://localhost:8080/process";
	// server_url = "https://localhost:8080/process";
	server_url = "http://34.249.147.24:8080/process";
	// server_url = "https://34.249.147.24:8080/process";

	console.log("posting to " + server_url);

	$.ajax({
		url: server_url,
		method: "POST",
		dataType: "json",
		data: JSON.stringify({"img": data, "style": img_style}),
		success: function (answer){
			// console.log("answer:", answer)
			process_answer(answer);
		},
		error: function( error ){
			console.log("error:", error);
		}
	})

}
			 

function process_answer(answer){

	var image_src = 'data:image/png;base64,'+answer.img;
	
	processed_images.unshift(image_src);
	$("#final_image").css({"background-image": "url("+image_src+")"});

	restore_loading_bar();
}



function restore_loading_bar(){
	$("#final_loading_bar").fadeOut(200);
	$("#final_loading_bar").width(5);
}
