import json
from http.server import *
import base64_to_jpg as b64


def processImage(str_img):
    return str_img


class GetHandler(BaseHTTPRequestHandler):

    def do_POST(self):

        print("*post received")
      
        if self.path.endswith("/process"):

            content_len = int(self.headers['Content-Length'])
            post_body = self.rfile.read(content_len)

            data = str(post_body.decode('utf-8'))
            json_data = json.loads(data)

            str_img = json_data["img"]
            str_style = json_data["style"]

            str_img = str_img.replace("data:image/png;base64,", "")
            str_img = bytes(str_img, "utf-8")

            processed_image = b64.base64_to_jpg(str_img, str_style)

            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            #self.send_header("Access-Control-Expose-Headers", "Access-Control-Allow-Origin")
            self.end_headers()

            json_response = {"answer": "post recibido!!", "img": processed_image};
            json_response = json.dumps(json_response)
            
            self.wfile.write(bytes(json_response, 'utf-8'))

            print("*post answered")

        #return


if __name__ == "__main__":

    print('Starting server at http://0.0.0.0:8080')

    HandlerClass = GetHandler
    ServerClass = HTTPServer

    protocol = "HTTP/1.0"
    host = "0.0.0.0"
    port = 8080

    HandlerClass.protocol_version = protocol
    server_address = (host, port)

    httpd = ServerClass(server_address, HandlerClass)
    httpd.serve_forever()
    