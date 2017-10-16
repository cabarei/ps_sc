$(function(){
  
  	//$(window).bind("click", post_to_server);

})


function post_to_server(data){

	console.log("posting")
	// console.log(data)

	$.ajax({
		url: 'http://localhost:5050/process',
		method: "POST",
		dataType: "json",
		data: JSON.stringify({"test": "hi!", 'img': data}),
		success: function (answer){

			console.log("answer:", answer)

			var image = new Image();
			image.src = 'data:image/png;base64,'+answer.img;
			document.body.appendChild(image);
			
			// $("body").append("<br><br>sucess posting");
			// $("body").append("<br>answer from server: " + answer.first_chars);
		},
		error: function( error ){
			console.log("error:", error);
		}
	})

}
			 