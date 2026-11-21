param([Parameter(Mandatory=$true)][string]$Projeto)
$ErrorActionPreference = 'Stop'
$origem = Join-Path (Split-Path $PSScriptRoot -Parent) '.claude\skills'
$destino = Join-Path $Projeto '.claude\skills'
if (!(Test-Path -LiteralPath $Projeto -PathType Container)) { throw "Pasta inexistente: $Projeto" }
New-Item -ItemType Directory -Path $destino -Force | Out-Null
Get-ChildItem -LiteralPath $origem -Directory | ForEach-Object {
  $alvo = Join-Path $destino $_.Name
  if (Test-Path -LiteralPath $alvo) {
    Write-Host "PULADO (ja existe): $alvo"
  } else {
    Copy-Item -LiteralPath $_.FullName -Destination $alvo -Recurse
    Write-Host "INSTALADO: $alvo"
  }
}
Write-Host 'Instalacao terminada. Nenhum arquivo existente foi substituido.'
