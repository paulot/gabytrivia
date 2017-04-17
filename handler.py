import os
import urllib
import functools
import json
import questions

from http import server

def get_file_path(path):
    urlparts = urllib.parse.urlparse(path)
    request_file_path = urlparts.path.strip('/')

    return request_file_path


class HTTPHandler(server.SimpleHTTPRequestHandler):
    api_endpoints = {
        'api/v1/questions': lambda: questions.questions
    }

    def do_GET(self):
        request_file_path = get_file_path(self.path)

        if request_file_path in self.api_endpoints:
            self.send_response(200)
            self.send_header('Content-type:', 'application/json')
            self.end_headers()
            self.wfile.write(bytes(json.dumps(self.api_endpoints[request_file_path]()), 'utf8'))
            return
        elif not os.path.exists(request_file_path):
            self.path = 'index.html'

        return server.SimpleHTTPRequestHandler.do_GET(self)
