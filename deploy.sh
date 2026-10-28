#!/bin/bash
set -e

REPO=/home/guosh/GIT/guosyzamz.top
TARGET=/var/www/guosyzamz.top

##git --git-dir="$REPO" archive main  | tar -x -C "$REPO"

#----------site--------------
rsync -rlptD --delete \
      --exclude "*.db" --exclude "*.db-*" --exclude "*.bak" \
      --chmod=D2750,F640 \
      "$REPO/site"/ "$TARGET/site"/
#-------------nav-------------------
rsync -rlptD --delete \
      --exclude "*.db" --exclude "*.db-*" --exclude "*.bak" \
      --chmod=D2750,F640 \
      "$REPO/nav"/ "$TARGET/nav"/
chmod 750 "$TARGET"
chmod g+s "$TARGET"

#----------ds_math---------------
if [ -d "$REPO/content" ]; then
	rsync -rlptD --delete \
		--exclude "create_bit/" \
		--exclude "create_qyyz/" \
		--exclude "bit_vs_buaa/" \
		--exclude "schools/" \
		--exclude "ironwing/" \
		--chmod=D2750,F640 \
		"$REPO/content"/ "$TARGET/content"/
	chmod 750 "$TARGET/content"
	chmod g+s "$TARGET/content"
fi

# ---------- create_bit ----------
if [ -d "$REPO/content/create_bit" ]; then
	rsync -rlptD --delete \
		--exclude "data/" \
		--chmod=D2750,F640 \
		"$REPO/content/create_bit"/ "$TARGET/content/create_bit"/
	mkdir -p "$TARGET/content/create_bit/data"
	chmod 2750 "$TARGET/content/create_bit"
	chmod 2770 "$TARGET/content/create_bit/data"
fi
#------------create_qyyz-------------
if [ -d "$REPO/content/create_qyyz" ] ; then
	rsync -rlptD --delete \
		--exclude "data/" \
		--chmod=D2750,F640 \
		"$REPO/content/create_qyyz"/ "$TARGET/content/create_qyyz"/
	mkdir -p "$TARGET/content/create_qyyz/data"
	chmod 2750 "$TARGET/content/create_qyyz"
	chmod  2770 "$TARGET/content/create_qyyz/data"
fi
#------------bit_vs_buaa 1.0-------------
if [ -d "$REPO/content/bit_vs_buaa" ] ; then
	rsync -rlptD --delete \
		--exclude "data/" \
		--chmod=D2750,F640 \
		"$REPO/content/bit_vs_buaa"/ "$TARGET/content/bit_vs_buaa"/
	mkdir -p "$TARGET/content/bit_vs_buaa/data"
	chmod  2750 "$TARGET/content/bit_vs_buaa"
	chmod  2770 "$TARGET/content/bit_vs_buaa/data"
fi
#------------schools 1.0-------------
if [ -d "$REPO/content/schools" ] ; then
	rsync -rlptD --delete \
		--exclude "storage/" \
		--chmod=D2750,F640 \
		"$REPO/content/schools"/ "$TARGET/content/schools"/
	mkdir -p "$TARGET/content/schools/storage"
	chmod  2750 "$TARGET/content/schools"
	chmod  2770 "$TARGET/content/schools/storage"
fi

#------------ironwing 1.0-------------
if [ -d "$REPO/content/ironwing" ] ; then
	rsync -rlptD --delete \
		--exclude "data/" \
		--chmod=D2750,F640 \
		"$REPO/content/ironwing"/ "$TARGET/content/ironwing"/
	mkdir -p "$TARGET/content/ironwing/data"
	chmod  2750 "$TARGET/content/ironwing"
	chmod  2770 "$TARGET/content/ironwing/data"
fi

mkdir -p "$TARGET/data"
chmod 2770 "$TARGET/data"
echo "[deploy] $(date "+%F %T") OK"
