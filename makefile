
SERVIDOR=/mnt/c/Users/Moontec/AppData/Local/Screeps/scripts/screeps.com
BRANCH=test

SITE=$(SERVIDOR)/$(BRANCH)

test:
	cp -r ./src/* $(SITE)
