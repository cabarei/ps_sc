import PIL.ImageOps 
from PIL import Image
from io import BytesIO
import base64


def base64_to_jpg(data):

	mode = "JPEG"
	extension = "png" if mode == "PNG" else "jpg"
	filename = "capture."+extension

	img = Image.open(BytesIO(base64.b64decode(data)))
	if (mode == "JPEG"): img = img.convert('RGB')
	img = PIL.ImageOps.invert(img)
	
	img.save(filename, mode)
	#img.show()

	with open(filename, "rb") as image_file:
		base64_str = base64.b64encode(image_file.read()).decode("utf-8") 

	return base64_str