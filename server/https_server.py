import argparse
import atexit
import logging
import os
import sys
import tempfile
from subprocess import call

# from version import version


from http.server import *
import socketserver
import ssl

import json
import base64_to_jpg as b64


logging.basicConfig(level=logging.INFO)

parser = argparse.ArgumentParser(description='')
parser.add_argument('--host', dest='host', default='localhost')
parser.add_argument('--port', dest='port', type=int, default=8080)
args = parser.parse_args()

server_host = args.host
server_port = args.port
ssl_cert_path = '{}/server.pem'.format(tempfile.gettempdir())

OpenSslExecutableNotFoundError = FileNotFoundError



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



def create_ssl_cert():

    from subprocess import DEVNULL

    try:
        ssl_exec_list = ['openssl', 'req', '-new', '-x509', '-keyout', ssl_cert_path,
                         '-out', ssl_cert_path, '-days', '365', '-nodes',
                         '-subj', '/CN=www.talhasch.com/O=Talhasch Inc./C=TR']
        call(ssl_exec_list, stdout=DEVNULL, stderr=DEVNULL)
    except OpenSslExecutableNotFoundError:
        logging.error('openssl executable not found!')
        exit(1)

    logging.info('Self signed ssl certificate created at {}'.format(ssl_cert_path))



def exit_handler():
    # remove certificate file at exit
    os.remove(ssl_cert_path)

    logging.info('Bye!')



def main():
    # logging.info('pyhttps {}'.format(version))
    create_ssl_cert()
    atexit.register(exit_handler)

    # from http.server import *
    # import socketserver
    # import ssl

    logging.info('Server running... https://{}:{}'.format(server_host, server_port))
    GetHandler.protocol_version = "HTTP/1.0"
    httpd = socketserver.TCPServer((server_host, server_port), GetHandler)
    httpd.socket = ssl.wrap_socket(httpd.socket, certfile=ssl_cert_path, server_side=True)

    httpd.serve_forever()



if __name__ == "__main__":
    main()