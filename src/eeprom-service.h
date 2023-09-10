#include <Arduino.h>

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

void writeEEPROM(char data[CONFIG_DTO_SIZE])
{

  Serial.print("Writing to EEPROM...");

  for (size_t i = 0; i < strlen(data); ++i)
  {
    EEPROM.write(i, data[i]);
  }
  EEPROM.commit();

  Serial.println("Done");
}