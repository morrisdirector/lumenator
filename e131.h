#include <Arduino.h>
#include <ESPAsyncE131.h>

#define UNIVERSE_COUNT 1 // Total number of Universes to listen for, starting at UNIVERSE

ESPAsyncE131 e131(UNIVERSE_COUNT);

unsigned long lastPacketReceived = 0;
unsigned long packetPeriod = 1000;

void e131Loop()
{
    if (!e131.isEmpty())
    {
        e131_packet_t packet;
        e131.pull(&packet); // Pull packet from ring buffer

        lastPacketReceived = millis();

        // Serial.println();
        // Serial.printf("Universe %u / %u Channels | Packet#: %u / Errors: %u / CH1: %u\n",
        //               htons(packet.universe),                 // The Universe for this packet
        //               htons(packet.property_value_count) - 1, // Start code is ignored, we're interested in dimmer data
        //               e131.stats.num_packets,                 // Packet counter
        //               e131.stats.packet_errors,               // Packet error counter
        //               packet.property_values[1]);             // Dimmer data for Channel 1

        if (htons(packet.universe) == e131Config.universe)
        {

            if (lumState.ctrlMode == CtrlMode::GPIO_R || lumState.ctrlMode == CtrlMode::GPIO_G || lumState.ctrlMode == CtrlMode::GPIO_B || lumState.ctrlMode == CtrlMode::GPIO_W || lumState.ctrlMode == CtrlMode::GPIO_WW)
            {
                // GPIO Testing mode -- do not stream
                return;
            }

            if (lumState.ctrlMode != CtrlMode::E131)
            {
                Serial.println(printLine);
                Serial.print("Receiving E1.31 data...");
                lumState.ctrlMode = CtrlMode::E131;
                updateLumenatorLevels(true, 0, 0, 0, 0, 0, 500, 255); // Bulb is on with all channels at 0
            }

            int channel_1 = e131Config.channel;
            int channel_2 = e131Config.channel + 1;
            int channel_3 = e131Config.channel + 2;
            int channel_4 = e131Config.channel + 3;
            int channel_5 = e131Config.channel + 4;

            int totalRgbBrightness = 0;

            // RGB
            if (deviceConfig.type == DeviceType::RGBWW || deviceConfig.type == DeviceType::RGBW ||
                deviceConfig.type == DeviceType::RGB)
            {
                if (e131Config.manual == true)
                {
                    channel_2 = e131Config.g;
                    channel_3 = e131Config.b;
                }
                analogWrite(gpioConfig.r, packet.property_values[channel_1]);
                analogWrite(gpioConfig.g, packet.property_values[channel_2]);
                analogWrite(gpioConfig.b, packet.property_values[channel_3]);
                totalRgbBrightness = packet.property_values[channel_1] + packet.property_values[channel_2] + packet.property_values[channel_3];
            }

            // Cool White
            if (deviceConfig.type == DeviceType::RGBWW || deviceConfig.type == DeviceType::RGBW)
            {
                if (e131Config.mixing == E131MixingStrategy::RGB_WWW && totalRgbBrightness > 0)
                {
                    analogWrite(gpioConfig.w, 0);
                }
                else
                {
                    if (e131Config.manual == true)
                    {
                        channel_4 = e131Config.w;
                    }
                    analogWrite(gpioConfig.w, packet.property_values[channel_4]);
                }
            }
            else if (deviceConfig.type == DeviceType::W || deviceConfig.type == DeviceType::WW)
            {
                analogWrite(gpioConfig.w, packet.property_values[channel_1]);
            }

            // Warm White
            if (deviceConfig.type == DeviceType::RGBWW)
            {
                if (e131Config.mixing == E131MixingStrategy::RGB_WWW && totalRgbBrightness > 0)
                {
                    analogWrite(gpioConfig.ww, 0);
                }
                else
                {
                    if (e131Config.manual == true)
                    {
                        channel_5 = e131Config.ww;
                    }
                    analogWrite(gpioConfig.ww, packet.property_values[channel_5]);
                }
            }
            else if (deviceConfig.type == DeviceType::WW)
            {
                if (e131Config.manual == true)
                {
                    channel_2 = e131Config.ww;
                }
                analogWrite(gpioConfig.ww, packet.property_values[channel_2]);
            }
        }
    }
    else if (lumState.ctrlMode == CtrlMode::E131 && (millis() - lastPacketReceived) > packetPeriod)
    {
        // Packets stopped:
        setStateFromSaved();
        updateLumenatorLevels();
        Serial.println("done");
        Serial.println("Stream ended");
        Serial.println(printLine);
    }
}