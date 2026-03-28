# One-off export using extracted GTFS under $env:TEMP\grtc-gtfs (run import_grtc_gtfs.py or unzip gtfs.zip first).
$ErrorActionPreference = "Stop"
Set-Location (Split-Path -Parent $PSScriptRoot)
$d = Join-Path $env:TEMP "grtc-gtfs"
if (-not (Test-Path "$d\stops.txt")) {
  Write-Error "Missing $d\stops.txt — unzip GRTC gtfs.zip to $d first"
}
$ExportDir = Join-Path (Get-Location) "src\data"
New-Item -ItemType Directory -Force -Path $ExportDir | Out-Null
$stops = Import-Csv "$d\stops.txt"
$box = $stops | Where-Object {
  [double]$_.stop_lat -ge 37.465 -and [double]$_.stop_lat -le 37.615 -and
  [double]$_.stop_lon -ge -77.585 -and [double]$_.stop_lon -le -77.375
}
$brtTripIds = [System.Collections.Generic.HashSet[string]]::new()
Import-Csv "$d\trips.txt" | Where-Object { $_.route_id -eq "BRT" } | ForEach-Object { [void]$brtTripIds.Add($_.trip_id) }
$pulseStopIds = [System.Collections.Generic.HashSet[string]]::new()
Import-Csv "$d\stop_times.txt" | Where-Object { $brtTripIds.Contains($_.trip_id) } | ForEach-Object { [void]$pulseStopIds.Add($_.stop_id) }
$stopById = @{}
foreach ($s in $stops) { $stopById[$s.stop_id] = $s }
$pulseStops = New-Object System.Collections.Generic.List[object]
foreach ($sid in ($pulseStopIds | Sort-Object)) {
  $s = $stopById[$sid]
  if (-not $s) { continue }
  $lat = [double]$s.stop_lat
  $lng = [double]$s.stop_lon
  if ($lat -lt 37.465 -or $lat -gt 37.615 -or $lng -lt -77.585 -or $lng -gt -77.375) { continue }
  $pulseStops.Add([ordered]@{
    id     = "pulse-$($s.stop_id)"
    stopId = $s.stop_id
    code   = "$($s.stop_code)"
    label  = "Pulse (BRT) · $($s.stop_name)"
    lat    = $lat
    lng    = $lng
  })
}
$richmondStops = New-Object System.Collections.Generic.List[object]
foreach ($s in $box) {
  $richmondStops.Add([ordered]@{
    id   = "$($s.stop_id)"
    code = "$($s.stop_code)"
    name = "$($s.stop_name)"
    lat  = [double]$s.stop_lat
    lng  = [double]$s.stop_lon
  })
}
$fi = (Import-Csv "$d\feed_info.txt")[0]
$meta = [ordered]@{
  source         = "GRTC static GTFS"
  publisher      = "Greater Richmond Transit Company"
  publisherUrl   = "https://www.ridegrtc.com"
  gtfsZipUrl     = "https://www.ridegrtc.com/wp-content/uploads/2025/02/gtfs.zip"
  feedVersion    = $fi.feed_version
  feedEndDate    = $fi.feed_end_date
  generatedAt    = [DateTime]::UtcNow.ToString("o")
  stopCountRichmondBox = $richmondStops.Count
  pulseStopCount       = $pulseStops.Count
  bounds         = @{ south = 37.465; north = 37.615; west = -77.585; east = -77.375 }
  licenseNote    = "Use subject to GRTC GTFS license. Scheduled service only — not live vehicle tracking."
}
$meta | ConvertTo-Json -Depth 6 | Set-Content -Path "$ExportDir\grtcGtfsMeta.json" -Encoding utf8
$richmondStops | ConvertTo-Json -Depth 6 | Set-Content -Path "$ExportDir\grtcStopsRichmond.json" -Encoding utf8
$pulseStops | ConvertTo-Json -Depth 6 | Set-Content -Path "$ExportDir\grtcPulseStops.json" -Encoding utf8
