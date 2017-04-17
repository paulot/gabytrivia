import socketserver
import handler

HOST = ('0.0.0.0', 3000)

httpd = socketserver.TCPServer(HOST, handler.HTTPHandler)
httpd.serve_forever()
