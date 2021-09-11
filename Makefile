BOARD = esp8266:esp8266:d1
# PORT  = /dev/cu.usbserial-13110
PORT  = /dev/cu.usbserial-0147DD01
# PORT  = /dev/cu.wchusbserial145430
# PORT  = /dev/cu.wchusbserial1440
FQBN = esp8266:esp8266:d1:xtal=80,vt=flash,exception=legacy,ssl=all,eesz=4M2M,ip=lm2f,dbg=Disabled,lvl=None____,wipe=none,baud=921600

###########################################################
SKETCH_FILE   = $(shell ls -1 $(CURDIR)/*.ino | head -n1)
SKETCH_NAME   = $(shell basename $(CURDIR))
MONITOR_SPEED = $(shell egrep Serial.begin $(SKETCH_FILE) | perl -pE 's/\D+//g' | head -n1)
BUILD_DIR     = /tmp/arduino-build-$(SKETCH_NAME)/

default: sketch monitor

refresh: kill sketch monitor

refreshfirm: kill compile upload monitor

firm: compile upload monitor

# refresh_sketch: kill sketch_only

# refresh_web: kill web

# sketch_only: sketch monitor

sketch: parcel compile upload

# web: parcel spiffs monitor

compile: display_config
	arduino-cli compile --fqbn $(FQBN) -p $(PORT)

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

# ESPTOOL     = esptool.py
# DATADIR     = $(CURDIR)/data/
# SPIFFS_IMG  = $(CURDIR)/tmp/$(SKETCH_NAME).spiffs.bin
# SPIFFS_SIZE = 1024000
# # Should be 0x300000 for 1MB, 0x200000 for 2MB, or 0x100000 for 3MB
# SPIFFS_ADDR = 0x300000
# BAUD_RATE = 460800
# CHIP = esp8266

# spiffs:
# 	@echo Building SPIFFS image
# 	./tools/mkspiffs \
# 		-c ./data \
# 		-p 256 \
# 		-b 8192 \
# 	    -s $(SPIFFS_SIZE) \
# 		$(SPIFFS_IMG)
# 	esptool.py --chip $(CHIP) \
# 		--port $(PORT)  \
# 		--baud $(BAUD_RATE) \
# 		--before default_reset \
# 		--after hard_reset \
# 		write_flash $(SPIFFS_ADDR) $(SPIFFS_IMG)