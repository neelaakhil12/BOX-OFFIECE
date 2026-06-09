# BOX OFFICE - Lightweight PowerShell static file server
$port = 8080
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
try { $listener.Prefixes.Add("http://127.0.0.1:$port/") } catch {}
try { $listener.Prefixes.Add("http://[::1]:$port/") } catch {}

try {
    $listener.Start()
    $url = "http://localhost:$port/index.html"
    Write-Host "=============================================" -ForegroundColor DarkYellow
    Write-Host "  BOX OFFICE - Dev Server Started" -ForegroundColor White
    Write-Host "  URL: $url" -ForegroundColor Green
    Write-Host "=============================================" -ForegroundColor DarkYellow
    Write-Host "  Press Ctrl+C in this terminal to exit.`n"

    # Launch default web browser
    Start-Process $url

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        # Get path and map to local file
        $urlPath = $request.Url.LocalPath
        
        # Handle API Config Endpoint
        if ($urlPath -eq "/api/config") {
            $keysFile = Join-Path $PSScriptRoot "keys.json"
            if ($request.HttpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream)
                $body = $reader.ReadToEnd()
                try {
                    $testObj = ConvertFrom-Json $body
                    $body | Out-File $keysFile -Encoding utf8
                    $response.StatusCode = 200
                    $response.ContentType = "application/json; charset=utf-8"
                    $resBytes = [System.Text.Encoding]::UTF8.GetBytes('{"success":true}')
                    $response.ContentLength64 = $resBytes.Length
                    $response.OutputStream.Write($resBytes, 0, $resBytes.Length)
                } catch {
                    $response.StatusCode = 400
                    $response.ContentType = "application/json; charset=utf-8"
                    $resBytes = [System.Text.Encoding]::UTF8.GetBytes('{"error":"Invalid JSON"}')
                    $response.ContentLength64 = $resBytes.Length
                    $response.OutputStream.Write($resBytes, 0, $resBytes.Length)
                }
            } else { # GET
                $keysContent = '{"tmdbKey":"","omdbKey":""}'
                if (Test-Path $keysFile) {
                    $keysContent = Get-Content $keysFile -Raw
                }
                $response.StatusCode = 200
                $response.ContentType = "application/json; charset=utf-8"
                # Disable caching for config endpoint
                $response.Headers.Add("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
                $response.Headers.Add("Pragma", "no-cache")
                $response.Headers.Add("Expires", "0")
                $resBytes = [System.Text.Encoding]::UTF8.GetBytes($keysContent)
                $response.ContentLength64 = $resBytes.Length
                $response.OutputStream.Write($resBytes, 0, $resBytes.Length)
            }
            $response.Close()
            continue
        }

        if ($urlPath -eq "/" -or $urlPath -eq "") {
            $urlPath = "/index.html"
        }
        
        # Decode URL encoding (like %20 for spaces)
        $urlPath = [System.Net.WebUtility]::UrlDecode($urlPath)
        
        # Resolve file path
        $relPath = $urlPath.TrimStart('/').Replace('/', '\')
        $filePath = Join-Path $PSScriptRoot $relPath
        
        if (Test-Path $filePath -PathType Leaf) {
            # Disable caching
            $response.Headers.Add("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
            $response.Headers.Add("Pragma", "no-cache")
            $response.Headers.Add("Expires", "0")
            
            # Content Type Mapping
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".jpeg" { "image/jpeg" }
                ".gif"  { "image/gif" }
                ".svg"  { "image/svg+xml; charset=utf-8" }
                ".json" { "application/json; charset=utf-8" }
                default { "application/octet-stream" }
            }
            
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            # File Not Found
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 - File Not Found: $urlPath")
            $response.ContentType = "text/plain"
            $response.ContentLength64 = $errBytes.Length
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        
        $response.Close()
    }
} catch {
    Write-Host "[Error] Failed to run server: $_" -ForegroundColor Red
} finally {
    $listener.Close()
    Write-Host "[Server] Stopped." -ForegroundColor Yellow
}
