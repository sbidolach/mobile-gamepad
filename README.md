# Mobile Gamepad

Mobile Universal Gamepad for RetroPie

# Quick installation and start

* Install nodejs

```bash
sudo apt-get update && sudo apt-get upgrade
curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
sudo apt-get install -y nodejs
```

* Install Grunt Command Line Interface

```bash
sudo npm install -g grunt-cli
```

* Clone project MobileGamePad and install dependencies

```bash
git clone https://github.com/sbidolach/mobile-gamepad.git
cd mobile-gamepad
npm install
```

* Run MobileGamepad

```bash
sudo grunt start
```

* Open in mobile browser the below URL

```
http://[ip_address_raspberry_pi]:8888
```

# Additional tools

The below tool allows check gamepad connection and sending events

```bash
sudo apd-get install input-utils
```

* Dump out all the input devices and the associated details about the device.

```bash
sudo lsinput
```

* Display keyboard mapping of a particular event device

```bash
sudo input-kbd [number]
```

* Display input events

```bash
sudo input-events [number]
```

# TODO

- Create user-friendly layout for controller [In progress]
- Display message when constoller is disconnected [In progress]
- Add simple KODI or other installation package
- TDD
- Add second joystick to move mouse (for Quake, etc.)
- Simulate mouse by moving mobile phone

# Development

- If you would like participate in innovate and interesting project, please contact with me.

## Problem solving

- No more battery problem in Pad
- Keep your controll configuration online for different games
- No more problems with multi-players
- One Pad use everywhere
