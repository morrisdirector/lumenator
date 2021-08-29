#include <Arduino.h>

#define EEPROM_SIZE 1024

String readEEPROM()
{

  Serial.println();
  Serial.println("Reading device configuration from EEPROM");

  String configuration;
  for (int i = 0; i < EEPROM_SIZE; ++i)
  {
    configuration += char(EEPROM.read(i));
  }

  Serial.println();
  if (configuration[0] != 0)
  {
    Serial.println("Configuration Data: ");
    Serial.println(configuration);
  }

  return configuration;
}

void clearEEPROM()
{

  Serial.print("Erasing EEPROM contents...");

  for (int i = 0; i < EEPROM_SIZE; ++i)
  {
    EEPROM.write(i, 0);
  }
  EEPROM.commit();

  Serial.println("Done");
}

void writeEEPROM(String data)
{

  Serial.print("Writing to EEPROM...");

  for (int i = 0; i < data.length(); ++i)
  {
    EEPROM.write(i, data[i]);
  }
  EEPROM.commit();

  Serial.println("Done");
}