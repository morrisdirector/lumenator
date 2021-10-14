# BOARD = esp8266:esp8266:d1
BOARD = esp8266:esp8266:generic
# PORT  = /dev/cu.usbserial-13110
# PORT  = /dev/cu.usbserial-0147DD01
PORT  = /dev/cu.usbserial-AI04Y25X
FQBN = esp8266:esp8266:generic:xtal=80,vt=flash,exception=legacy,ssl=all,ResetMethod=nodemcu,CrystalFreq=26,FlashFreq=40,FlashMode=dout,eesz=1M,led=2,sdk=nonosdk_190703,ip=lm2f,dbg=Disabled,lvl=None____,wipe=none,baud=115200
# FQBN = esp8266:esp8266:d1:xtal=80,vt=flash,exception=legacy,ssl=all,eesz=4M2M,ip=lm2f,dbg=Disabled,lvl=None____,wipe=none,baud=921600

###########################################################
SKETCH_FILE   = $(shell ls -1 $(CURDIR)/*.ino | head -n1)
SKETCH_NAME   = $(shell basename $(CURDIR))
MONITOR_SPEED = $(shell egrep Serial.begin $(SKETCH_FILE) | perl -pE 's/\D+//g' | head -n1)
BUILD_DIR     = ${PWD}/build
BIN_DIR     = ${PWD}/bin

default: sketch monitor

refresh: kill sketch monitor

refreshfirm: kill compile upload monitor

firm: compile upload monitor

sketch: parcel compile upload

compileall: parcel compile

compile: display_config clean
	arduino-cli compile --fqbn $(FQBN) -p $(PORT) --build-path $(BUILD_DIR) && gzip -kf $(BUILD_DIR)/lumenator.ino.bin && cp $(BUILD_DIR)/lumenator.ino.bin $(BIN_DIR) && cp $(BUILD_DIR)/lumenator.ino.bin.gz $(BIN_DIR)

upload: display_config
	arduino-cli upload --input-dir $(BUILD_DIR) -p $(PORT) -b $(BOARD)

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