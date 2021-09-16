BOARD = esp8266:esp8266:d1
# PORT  = /dev/cu.usbserial-13110
PORT  = /dev/cu.usbserial-0147DD01
FQBN = esp8266:esp8266:d1:xtal=80,vt=flash,exception=legacy,ssl=all,eesz=4M2M,ip=lm2f,dbg=Disabled,lvl=None____,wipe=none,baud=921600

###########################################################
SKETCH_FILE   = $(shell ls -1 $(CURDIR)/*.ino | head -n1)
SKETCH_NAME   = $(shell basename $(CURDIR))
MONITOR_SPEED = $(shell egrep Serial.begin $(SKETCH_FILE) | perl -pE 's/\D+//g' | head -n1)
BUILD_DIR     = ${PWD}/build

default: sketch monitor

refresh: kill sketch monitor

refreshfirm: kill compile upload monitor

firm: compile upload monitor

sketch: parcel compile upload

compile: display_config clean
	arduino-cli compile --fqbn $(FQBN) -p $(PORT) --build-path $(BUILD_DIR)

upload: display_config
	arduino-cli upload -p $(PORT) -b $(BOARD)

monitor:
	screen -S lumenator_monitor $(PORT) $(MONITOR_SPEED)

kill:
	screen -X -S lumenator_monitor quit

clean:
	rm -Rvf $(BUILD_DIR)

parcel:
	npm run build

display_config:
	@echo "BOARD         : $(BOARD)"
	@echo "PORT          : $(PORT)"
	@echo "MONITOR SPEED : $(MONITOR_SPEED)"
	@echo "SKETCH NAME   : $(SKETCH_NAME)"
	@echo "SKETCH FILE   : $(SKETCH_FILE)"esptool.py
	@echo