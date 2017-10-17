import PIL.ImageOps 
from PIL import Image
from io import BytesIO
import base64
import evaluate


def base64_to_jpg(data, style_idx):

	ROOT = "/home/ubuntu/dl/ps_sc/server/"
	mode = "JPEG"
	
	extension = "png" if mode == "PNG" else "jpg"
	
	filename = ROOT+"original/capture."+extension
	filename_processed = ROOT+"processed/capture" + "_processed"+"."+extension
	filename_result = ROOT+"processed/capture."+extension

	img = Image.open(BytesIO(base64.b64decode(data)))
	if (mode == "JPEG"): img = img.convert('RGB')


	img.save(filename, mode)

	evaluate.main(style_idx)

	img = PIL.ImageOps.invert(img)
	img.save(filename_processed, mode)

	
	#img.show()

	with open(filename_result, "rb") as image_file:
		base64_str = base64.b64encode(image_file.read()).decode("utf-8") 

	return base64_str