param([string]$Name = "nen1", [int]$Seed = 7)
$root = "D:\AI\Tiktok\darkskyquotes\.tools"
$model = "$root\sdcpp\models\DreamShaper_8_pruned.safetensors"
$out = "D:\AI\Tiktok\darkskyquotes\visuals\gia-dinh-so-thu\$Name.png"
$prompt = "Wide photo of a sunny day at a zoo, a giraffe standing behind a wooden fence, lush green trees, a grass lawn in the foreground, soft blue sky with light clouds, shallow depth of field, blurred background, natural warm daylight, no people"
$neg = "people, person, face, text, letters, logo, watermark, deformed, extra limbs, night, dark"
$cliArgs = @("-m", $model, "-p", "`"$prompt`"", "-n", "`"$neg`"", "-W", 768, "-H", 448, "--steps", 22, "--cfg-scale", "7",
  "--sampling-method", "dpm++2m", "--scheduler", "karras", "--vae-tiling", "--mmap", "-t", "4", "--seed", $Seed, "-o", "`"$out`"")
$free = { (Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory / 1MB }
"RAM trong: {0:N1} GB" -f (& $free)
$p = Start-Process "$root\sdcpp\sd-cli.exe" -ArgumentList $cliArgs -WorkingDirectory "$root\sdcpp" -PassThru -NoNewWindow -RedirectStandardOutput "$out.log" -RedirectStandardError "$out.err"
$p.PriorityClass = "BelowNormal"
$start = Get-Date
while (-not $p.HasExited) {
  Start-Sleep -Seconds 3
  if ((& $free) -lt 0.5) { "RAM duoi 0,5 GB, dung"; $p.Kill(); break }
  if (((Get-Date) - $start).TotalMinutes -gt 10) { "Qua 10 phut, dung"; $p.Kill(); break }
}
"Xong sau {0:N0} giay; anh: $(Test-Path $out)" -f ((Get-Date) - $start).TotalSeconds
