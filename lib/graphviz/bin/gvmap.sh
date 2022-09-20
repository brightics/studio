#!/bin/sh

# Script for gvmap pipeline
# Use -A to add flags for gvmap; e.g., -Ae results in gvmap -e
# -K can be used to change the original layout; by default, sfdp is used
# -T is used to specify the final output format
# -G, -N and -E flags can be used to tailor the rendering
# -g, -n and -e flags can be used to tailor the initial layout
# Be careful of spaces in the flags. If these are not wrapped in quotes, the
# parts will be separated during option processing.

LAYOUT=sfdp
OPTSTR="vVA:G:E:N:g:e:n:K:T:o:"
USAGE="Usage: gvmap [-vV] [-A gvmap flags] [-G attr=val] [-E attr=val] [-N attr=val] [-g attr=val] [-e attr=val] [-n attr=val] [-K layout] [-T output format] [-o outfile]"
FLAGS1=
FLAGS2=
FLAGS3=

while getopts ":$OPTSTR" c
do
  case $c in
  v )
    VERBOSE=1
    FLAGS1="$FLAGS1 -v"
    FLAGS2="$FLAGS2 -v"
    FLAGS3="$FLAGS3 -v"
    ;;
  V )
	dot -V
    exit 0
    ;;
  K )
    LAYOUT=$OPTARG
    ;;
  A )
    FLAGS2="$FLAGS2 -$OPTARG"
    ;;
  T )
    FLAGS3="$FLAGS3 -T$OPTARG"
    ;;
  e )
      FLAGS1="$FLAGS1 -E$OPTARG"
    ;;
  n )
      FLAGS1="$FLAGS1 -N$OPTARG"
    ;;
  g )
      FLAGS1="$FLAGS1 -G$OPTARG"
    ;;
  E )
      FLAGS3="$FLAGS3 -E$OPTARG"
    ;;
  N )
      FLAGS3="$FLAGS3 -N$OPTARG"
    ;;
  G )
      FLAGS3="$FLAGS3 -G$OPTARG"
    ;;
  o )
      FLAGS3="$FLAGS3 -o$OPTARG"
    ;;
  :)
    printf '%s requires a value\n' "$OPTARG" >&2
    exit 2
    ;;
  \? )
    if [ "$OPTARG" = "?" ]
    then
      printf '%s\n' "$USAGE"
      exit 0
    else
      printf  'gvmap: unknown flag %s\n' "$OPTARG" >&2
      printf '%s\n' "$USAGE"
      exit 2
    fi
    ;;
  esac
done
shift $((OPTIND-1))

if [ $# -eq 0 ]
then
  if [ -n "$VERBOSE" ]
  then
    printf '%s -Goverlap=prism %s | gvmap %s | neato -n2 %s\n' "$LAYOUT" "$FLAGS1" "$FLAGS2" "$FLAGS3" >&2
  fi
  $LAYOUT -Goverlap=prism $FLAGS1 | gvmap $FLAGS2 | neato -n2 $FLAGS3
else
  while $(( $# > 0 ))
  do
    if [ -f "$1" ]
    then
      if [ -n "$VERBOSE" ]
      then
        printf '%s -Goverlap=prism %s %s | gvmap %s | neato -n2 %s\n' "$LAYOUT" "$FLAGS1" "$1" "$FLAGS2" "$FLAGS3" >&2
      fi
      $LAYOUT -Goverlap=prism $FLAGS1 $1 | gvmap $FLAGS2 | neato -n2 $FLAGS3
    else
      printf 'gvmap: unknown input file %s - ignored\n' "$1" >&2
    fi
    shift
  done
fi



