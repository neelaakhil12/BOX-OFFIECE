import http.server
import socketserver
import webbrowser
import threading
import time

PORT = 8080

class CacheFreeHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Disable browser caching for development convenience
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_GET(self):
        if self.path == '/api/config':
            import os
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
            self.end_headers()
            keys_file = os.path.join(os.path.dirname(__file__), 'keys.json')
            if os.path.exists(keys_file):
                with open(keys_file, 'r', encoding='utf-8') as f:
                    self.wfile.write(f.read().encode('utf-8'))
            else:
                self.wfile.write(b'{"tmdbKey":"","omdbKey":""}')
            return
        super().do_GET()

    def do_POST(self):
        if self.path == '/api/config':
            import os
            import json
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            try:
                # Validate JSON format
                json.loads(post_data.decode('utf-8'))
                keys_file = os.path.join(os.path.dirname(__file__), 'keys.json')
                with open(keys_file, 'w', encoding='utf-8') as f:
                    f.write(post_data.decode('utf-8'))
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(b'{"success":true}')
            except Exception as e:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
            return
        self.send_response(404)
        self.end_headers()

def launch_browser():
    # Allow the server half a second to initialize
    time.sleep(0.5)
    url = f"http://localhost:{PORT}/index.html"
    print(f"Launching web browser to: {url}")
    webbrowser.open(url)

if __name__ == "__main__":
    # socketserver.TCPServer.allow_reuse_address = True
    socketserver.TCPServer.allow_reuse_address = True
    
    # Launch browser asynchronously
    threading.Thread(target=launch_browser, daemon=True).start()
    
    try:
        with socketserver.TCPServer(("", PORT), CacheFreeHandler) as httpd:
            print(f"==================================================")
            print(f"  BOX OFFICE - Development Server Running Local   ")
            print(f"  URL: http://localhost:{PORT}/index.html")
            print(f"==================================================")
            print("  Press Ctrl+C to terminate the server.\n")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[Server] Dev server shut down gracefully.")
    except Exception as e:
        print(f"\n[Error] Failed to start server: {e}")
