#! /usr/bin/env python2
# From http://stackoverflow.com/a/21957017/1698058
from http.server import SimpleHTTPRequestHandler, HTTPServer
import http.server

class CORSRequestHandler (SimpleHTTPRequestHandler):
    def end_headers (self):
        self.send_header('Access-Control-Allow-Origin', '*')
        SimpleHTTPRequestHandler.end_headers(self)

if __name__ == '__main__':
    http.server.test(CORSRequestHandler, HTTPServer)
