function post_to_server(data){

	console.log("posting")

	$.ajax({
		url: 'http://localhost:5050/process',
		method: "POST",
		dataType: "json",
		data: JSON.stringify({"test": "hi!", 'img': data}),
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
	var image = new Image();
	image.src = 'data:image/png;base64,'+answer.img;
	
	//document.body.appendChild(image);
	$("#final_image").src(image.src);
}