param(
  [int]$Port = 3000
)

$ErrorActionPreference = 'Stop'
$RootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$DataFile = Join-Path $RootDir 'app-data.json'

$MimeTypes = @{
  '.html' = 'text/html; charset=utf-8'
  '.css' = 'text/css; charset=utf-8'
  '.js' = 'application/javascript; charset=utf-8'
  '.json' = 'application/json; charset=utf-8'
  '.png' = 'image/png'
  '.jpg' = 'image/jpeg'
  '.jpeg' = 'image/jpeg'
  '.gif' = 'image/gif'
  '.svg' = 'image/svg+xml'
  '.ico' = 'image/x-icon'
}

function Ensure-DataFile {
  if (-not (Test-Path -LiteralPath $DataFile)) {
    Set-Content -LiteralPath $DataFile -Value 'null' -Encoding UTF8
  }
}

function Get-HeaderValue {
  param([string[]]$Headers, [string]$Name)
  foreach ($Header in $Headers) {
    if ($Header.StartsWith("${Name}:", [System.StringComparison]::OrdinalIgnoreCase)) {
      return $Header.Substring($Name.Length + 1).Trim()
    }
  }
  return $null
}

function Get-SafeStaticPath {
  param([string]$UrlPath)
  $CleanPath = [System.Uri]::UnescapeDataString(($UrlPath -split '\?')[0])
  if ($CleanPath -eq '/') { $CleanPath = '/index.html' }
  $RelativePath = $CleanPath.TrimStart('/').Replace('/', [System.IO.Path]::DirectorySeparatorChar)
  $FullPath = [System.IO.Path]::GetFullPath((Join-Path $RootDir $RelativePath))
  $RootFullPath = [System.IO.Path]::GetFullPath($RootDir)
  if (-not $FullPath.StartsWith($RootFullPath, [System.StringComparison]::OrdinalIgnoreCase)) {
    return $null
  }
  return $FullPath
}

function Write-Response {
  param(
    [System.IO.Stream]$Stream,
    [int]$StatusCode,
    [string]$StatusText,
    [byte[]]$Body,
    [string]$ContentType
  )
  $Header = "HTTP/1.1 $StatusCode $StatusText`r`nContent-Type: $ContentType`r`nContent-Length: $($Body.Length)`r`nConnection: close`r`n`r`n"
  $HeaderBytes = [System.Text.Encoding]::UTF8.GetBytes($Header)
  $Stream.Write($HeaderBytes, 0, $HeaderBytes.Length)
  $Stream.Write($Body, 0, $Body.Length)
}

function Write-TextResponse {
  param(
    [System.IO.Stream]$Stream,
    [int]$StatusCode,
    [string]$StatusText,
    [string]$Body,
    [string]$ContentType = 'text/plain; charset=utf-8'
  )
  Write-Response -Stream $Stream -StatusCode $StatusCode -StatusText $StatusText -Body ([System.Text.Encoding]::UTF8.GetBytes($Body)) -ContentType $ContentType
}

function Read-HttpRequest {
  param([System.IO.Stream]$Stream)
  $Buffer = New-Object byte[] 8192
  $Bytes = New-Object System.Collections.Generic.List[byte]

  while ($true) {
    $Read = $Stream.Read($Buffer, 0, $Buffer.Length)
    if ($Read -le 0) { break }
    for ($i = 0; $i -lt $Read; $i++) { $Bytes.Add($Buffer[$i]) }
    $Text = [System.Text.Encoding]::UTF8.GetString($Bytes.ToArray())
    $HeaderEnd = $Text.IndexOf("`r`n`r`n", [System.StringComparison]::Ordinal)
    if ($HeaderEnd -ge 0) {
      $HeadersText = $Text.Substring(0, $HeaderEnd)
      $HeaderLines = $HeadersText -split "`r`n"
      $ContentLengthValue = Get-HeaderValue -Headers $HeaderLines -Name 'Content-Length'
      $ContentLength = if ($ContentLengthValue) { [int]$ContentLengthValue } else { 0 }
      $BodyStart = $HeaderEnd + 4
      $AlreadyReadBody = $Bytes.Count - $BodyStart
      while ($AlreadyReadBody -lt $ContentLength) {
        $Read = $Stream.Read($Buffer, 0, [Math]::Min($Buffer.Length, $ContentLength - $AlreadyReadBody))
        if ($Read -le 0) { break }
        for ($i = 0; $i -lt $Read; $i++) { $Bytes.Add($Buffer[$i]) }
        $AlreadyReadBody += $Read
      }
      $AllBytes = $Bytes.ToArray()
      $BodyBytes = if ($ContentLength -gt 0) {
        $Part = New-Object byte[] $ContentLength
        [Array]::Copy($AllBytes, $BodyStart, $Part, 0, $ContentLength)
        $Part
      } else {
        New-Object byte[] 0
      }
      return @{
        RequestLine = $HeaderLines[0]
        Headers = $HeaderLines
        Body = [System.Text.Encoding]::UTF8.GetString($BodyBytes)
      }
    }
  }
  return $null
}

Ensure-DataFile

$Listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $Port)
$Listener.Start()
Write-Host "Dynamic web server running at http://localhost:$Port"

try {
  while ($true) {
    $Client = $Listener.AcceptTcpClient()
    try {
      $Stream = $Client.GetStream()
      $Request = Read-HttpRequest -Stream $Stream
      if (-not $Request) { continue }

      $Parts = $Request.RequestLine -split ' '
      $Method = $Parts[0]
      $RawUrl = $Parts[1]
      $PathOnly = ($RawUrl -split '\?')[0]

      if ($PathOnly -eq '/api/data') {
        Ensure-DataFile

        if ($Method -eq 'GET') {
          Write-TextResponse -Stream $Stream -StatusCode 200 -StatusText 'OK' -Body ([System.IO.File]::ReadAllText($DataFile)) -ContentType 'application/json; charset=utf-8'
          continue
        }

        if ($Method -eq 'PUT') {
          $null = $Request.Body | ConvertFrom-Json
          Set-Content -LiteralPath $DataFile -Value $Request.Body -Encoding UTF8
          Write-TextResponse -Stream $Stream -StatusCode 200 -StatusText 'OK' -Body '{"ok":true}' -ContentType 'application/json; charset=utf-8'
          continue
        }

        if ($Method -eq 'DELETE') {
          Set-Content -LiteralPath $DataFile -Value 'null' -Encoding UTF8
          Write-TextResponse -Stream $Stream -StatusCode 200 -StatusText 'OK' -Body '{"ok":true}' -ContentType 'application/json; charset=utf-8'
          continue
        }

        Write-TextResponse -Stream $Stream -StatusCode 405 -StatusText 'Method Not Allowed' -Body '{"error":"Method not allowed."}' -ContentType 'application/json; charset=utf-8'
        continue
      }

      if ($PathOnly.StartsWith('/api/')) {
        Write-TextResponse -Stream $Stream -StatusCode 404 -StatusText 'Not Found' -Body '{"error":"API endpoint not found."}' -ContentType 'application/json; charset=utf-8'
        continue
      }

      $FilePath = Get-SafeStaticPath -UrlPath $RawUrl
      if (-not $FilePath) {
        Write-TextResponse -Stream $Stream -StatusCode 403 -StatusText 'Forbidden' -Body 'Forbidden'
        continue
      }

      if (-not (Test-Path -LiteralPath $FilePath -PathType Leaf)) {
        Write-TextResponse -Stream $Stream -StatusCode 404 -StatusText 'Not Found' -Body 'Not found'
        continue
      }

      $Extension = [System.IO.Path]::GetExtension($FilePath).ToLowerInvariant()
      $ContentType = if ($MimeTypes.ContainsKey($Extension)) { $MimeTypes[$Extension] } else { 'application/octet-stream' }
      Write-Response -Stream $Stream -StatusCode 200 -StatusText 'OK' -Body ([System.IO.File]::ReadAllBytes($FilePath)) -ContentType $ContentType
    } catch {
      Write-TextResponse -Stream $Stream -StatusCode 500 -StatusText 'Internal Server Error' -Body $_.Exception.Message
    } finally {
      $Client.Close()
    }
  }
} finally {
  $Listener.Stop()
}
