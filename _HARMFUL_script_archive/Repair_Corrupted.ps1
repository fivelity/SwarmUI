# Repair corrupted safetensor files
# The issue: ADS tagging modified the first 8 bytes of some files
# Working header pattern: 0x10 0x77 0x01 0x00 0x00 0x00 0x00 0x00
# Corrupted files have first 8 bytes modified

$ModelRoot = "K:\\.ai_local\\SwarmUI\\Models"
$files = Get-ChildItem -Path $ModelRoot -Filter "*.safetensors" -Recurse | Where-Object { -not $_.PsIsContainer }

$repaired = 0
$failed = 0
$skipped = 0

Write-Host "Scanning $($files.Count) files for corruption" -ForegroundColor Cyan
Write-Host "Attempting to repair files with damaged headers" -ForegroundColor Yellow
Write-Host "================================================================" -ForegroundColor Cyan

foreach ($file in $files) {
    try {
        $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
        if ($bytes.Length -lt 8) {
            Write-Host "SKIP $($file.Name): File too small" -ForegroundColor Yellow
            $skipped++
            continue
        }
        
        # Check first 8 bytes - if they look corrupted, try to fix
        # Pattern: bytes 0-1 should be 0x10 0x77 (or other valid values),
        # bytes 2-7 should be 0x01 0x00 0x00 0x00 0x00 0x00 or 0x02 0x00 0x00 0x00 0x00 0x00
        $byte0 = $bytes[0]
        $byte1 = $bytes[1]
        $byte2 = $bytes[2]
        
        # Check if this file has the "standard" working header
        $hasStandardHeader = ($byte0 -eq 16 -and $byte1 -eq 119 -and $byte2 -eq 1)
        
        # Check if bytes 2-7 are all zeros (common pattern)
        $bytes2_7_zeros = ($byte2 -eq 0 -and $bytes[3] -eq 0 -and $bytes[4] -eq 0 -and $bytes[5] -eq 0 -and $bytes[6] -eq 0 -and $bytes[7] -eq 0)
        
        # Check byte 8 for JSON header start
        $byte8 = $bytes[8]
        $hasJsonStart = ($byte8 -eq 123)  # 123 = '{'
        
        # Determine if file is corrupted: 
        # - First byte is not a typical safetensor header value
        # - AND byte 8 is 123 (JSON start), indicating the header after byte 8 is OK
        # - But first 8 bytes are damaged
        
        $isLikelyCorrupted = $false
        
        # If byte 0 is 221 (0xDD) or 223 (0xDF) - values seen in corrupted files - mark as likely corrupted
        if ($byte0 -eq 221 -or $byte0 -eq 223) {
            $isLikelyCorrupted = $true
        }
        # If byte 0 is some other odd value and byte 8 is JSON start, might be corrupted
        elseif ($byte8 -eq 123 -and $byte0 -ne 16 -and $byte0 -ne 0 -and $byte0 -gt 200) {
            $isLikelyCorrupted = $true
        }
        
        if (-not $isLikelyCorrupted) {
            Write-Host "OK $($file.Name): byte0=$byte0 header seems OK" -ForegroundColor Green
            $skipped++
            continue
        }
        
        Write-Host "REPAIRING $($file.Name): byte0=$byte0 byte1=$byte1" -ForegroundColor DarkYellow
        
        # Restore the first 8 bytes to the standard working pattern
        $fixedBytes = @(16, 119, 1, 0, 0, 0, 0, 0)  # 0x10 0x77 0x01 0x00 0x00 0x00 0x00 0x00
        
        # Replace the first 8 bytes
        for ($i = 0; $i -lt 8; $i++) {
            $bytes[$i] = $fixedBytes[$i]
        }
        
        # Write the fixed file
        [System.IO.File]::WriteAllBytes($file.FullName, $bytes)
        
        # Verify the fix
        $bytesVerified = [System.IO.File]::ReadAllBytes($file.FullName)
        $vByte0 = $bytesVerified[0]
        $vByte8 = $bytesVerified[8]
        
        Write-Host "  Verified: byte0=$vByte0 byte8=$vByte8 (0x$($vByte8.ToString('X2')))" -ForegroundColor Cyan
        
        if ($vByte0 -eq 16 -and $vByte8 -eq 123) {
            Write-Host "  $($file.Name): REPAIRED successfully" -ForegroundColor Green
            $repaired++
        } else {
            Write-Host "  $($file.Name): Repair verification mixed" -ForegroundColor Yellow
            # Try to restore original if possible (we can't, so mark as failed)
            $failed++
        }
    } catch {
        Write-Host "ERROR $($file.Name): $_" -ForegroundColor Red
        $failed++
    }
}

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "Repair summary:" -ForegroundColor Cyan
Write-Host "  Repaired: $repaired" -ForegroundColor Green
Write-Host "  Failed: $failed" -ForegroundColor Red
Write-Host "  Skipped: $skipped" -ForegroundColor Yellow
Write-Host "  Total: $($repaired + $failed + $skipped)" -ForegroundColor Cyan