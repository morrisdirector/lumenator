#line 1 "/Users/patrickmorris/git/lumenator/e131.h"
#include <Arduino.h>
#include <ESPAsyncE131.h>

#define UNIVERSE_COUNT 1 // Total number of Universes to listen for, starting at UNIVERSE

ESPAsyncE131 e131(UNIVERSE_COUNT);

void e131Loop()
{
    e131_packet_t packet;
    e131.pull(&packet); // Pull packet from ring buffer

    // Serial.println();
    // Serial.printf("Universe %u / %u Channels | Packet#: %u / Errors: %u / CH1: %u\n",
    //               htons(packet.universe),                 // The Universe for this packet
    //               htons(packet.property_value_count) - 1, // Start code is ignored, we're interested in dimmer data
    //               e131.stats.num_packets,                 // Packet counter
    //               e131.stats.packet_errors,               // Packet error counter
    //               packet.property_values[1]);             // Dimmer data for Channel 1

    if (htons(packet.universe) == e131Config.universe)
    {
        int channel_1 = e131Config.channel;
        int channel_2 = e131Config.channel + 1;
        int channel_3 = e131Config.channel + 2;
        int channel_4 = e131Config.channel + 3;
        int channel_5 = e131Config.channel + 4;

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
        }

        // Cool White
        if (deviceConfig.type == DeviceType::RGBWW || deviceConfig.type == DeviceType::RGBW)
        {
            if (e131Config.manual == true)
            {
                channel_4 = e131Config.w;
            }
            analogWrite(gpioConfig.w, packet.property_values[channel_4]);
        }
        else if (deviceConfig.type == DeviceType::W || deviceConfig.type == DeviceType::WW)
        {
            analogWrite(gpioConfig.w, packet.property_values[channel_1]);
        }

        // Warm White
        if (deviceConfig.type == DeviceType::RGBWW)
        {
            if (e131Config.manual == true)
            {
                channel_5 = e131Config.ww;
            }
            analogWrite(gpioConfig.ww, packet.property_values[channel_5]);
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