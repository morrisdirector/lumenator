# Lumenator: ESP8266-based Smart Light Bulb Firmware

---

## Info

**Lumenator** is a dedicated firmware designed for ESP8266-based smart light bulbs. Our aim is to bring flexibility, durability, and efficient performance to smart lighting solutions.

### Features:

- **Web Interface for Configuration**: Easily adjust settings and preferences without the need for complicated software. Our intuitive web interface offers seamless user experience.

- **OTA (Over The Air) Updates**: Update your bulb firmware remotely without the need to physically access or disconnect it. Keep your bulbs up-to-date with the latest features and security patches.

- **Hotspot for Initial Setup**: No need for convoluted wiring or tedious setup procedures. Lumenator provides a hotspot for a straightforward initial configuration, making the initial setup process a breeze.

- **E1.31 Streaming**: Support for E1.31 streaming protocol ensures that you can integrate Lumenator into entertainment, architectural, and even professional lighting systems.

- **MQTT Integration**: Allows your smart bulbs to communicate over MQTT. Integrate your bulbs with home automation platforms, sensors, or other devices for a cohesive smart home environment.

---

## Project File Structure

- 📁 **.pio**: Contains builds for PlatformIO, including the compiled firmware binary files and library dependencies.

- 📁 **build**: Houses bundled web assets, including gzipped versions and byte array files.

- 📁 **node_modules**: Holds the dependencies for the web interface. This directory is generated when 'npm install' is run.

- 📁 **src**: The core of the project with all source files.

  - 📁 **www**: Source files for the front-end User Interface (UI) of the firmware.

  - **Sketch Files**: Outside the 'www' directory, you'll find the sketch files vital to the firmware, including the primary '.ino' file and its associated header files.

# Development Guide

---

For those looking to contribute to or modify the Lumenator's web pages, this section will guide you through the development and deployment process.

## Web Development:

1. **Setting Up the Development Environment**:
   Start by running the following command to launch a local development server using Vite:

   ```
   pnpm dev
   ```

   This will enable real-time previews of changes to the web interfaces.

2. **Framework**:
   The web interfaces are crafted using Preact, a fast 3kb alternative to React with the same modern API. Familiarity with Preact or React will be beneficial when making modifications or additions.

3. **Deploying Front-End Changes**:
   Once you're satisfied with your front-end changes and are ready to deploy:
   ```
   pnpm build
   ```
   Executing the above script will do the following:
   - Bundle the web assets using Vite.
   - Gzip the bundled files to reduce their size.
   - Generate byte arrays from the gzipped files, making them ready for inclusion in the sketch files.

---

## Firmware Core:

Working on the firmware's core, i.e., the sketch files, requires a different setup and understanding. This project leverages PlatformIO, a prominent ecosystem for embedded development.

1. **Lumenator Environment** (`lumenator`):

   - **Purpose**: This environment is set up for production. It's optimized to compile production-ready binary files.
   - **Target Device**: Generic ESP8266 devices.

2. **Lumenator Debug Environment** (`lumenator_debug`):
   - **Purpose**: Rapid testing and iterations, making the development process smoother.
   - **Target Device**: Wemos D1 Mini.

### Working with PlatformIO in VSCode:

1. **Making Changes**:
   Start by editing the sketch files or any related source files as per the development requirements.

2. **Accessing PlatformIO in VSCode**:

   - In the Visual Studio Code (VSCode) sidebar, you'll find an alien-like icon representing PlatformIO. Click on this icon.
   - If you don't see the icon, it might be hidden in the "..." (more options) menu at the bottom of the sidebar. Click on it and select PlatformIO.

3. **Executing Tasks**:
   Once inside the PlatformIO menu:

   - "Build" compiles your code and writes a BIN file.
   - "Upload and Monitor" task uploads the firmware to the device and also opens a serial monitor.

4. **Incorporating Web Page Byte Arrays**:
   When building the core firmware, it automatically integrates the latest web page byte array files generated from the `build` directory.

---

### Tips:

- Always make sure to build the web interface first (using `pnpm build`) before building the firmware. This ensures that the most recent web page byte arrays are incorporated into the firmware.
