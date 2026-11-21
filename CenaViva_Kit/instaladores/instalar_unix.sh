#!/usr/bin/env bash
set -euo pipefail
if [ "$#" -ne 1 ]; then echo 'Uso: bash instalar_unix.sh /caminho/do/projeto'; exit 2; fi
project="$1"
[ -d "$project" ] || { echo "Pasta nao existe: $project"; exit 1; }
source_dir="$(cd "$(dirname "$0")/.." && pwd)/.claude/skills"
mkdir -p "$project/.claude/skills"
for skill in "$source_dir"/*; do
  name="$(basename "$skill")"
  if [ -e "$project/.claude/skills/$name" ]; then echo "PULADO: $name"; else cp -R "$skill" "$project/.claude/skills/$name"; echo "INSTALADO: $name"; fi
done
echo 'Concluido sem sobrescrever skills existentes.'
