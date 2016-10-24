# Mobile Gamepad

Mobile Universal Gamepad for RetroPie (http://mobilegamepad.net/)

![MobilaGamepad](/other/resources/schema_mobilegamepad.png)

# Quick installation and start

* Run below installation script

```bash
# Install nodejs
sudo apt-get update && sudo apt-get upgrade
curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Grunt Command Line Interface
sudo npm install -g grunt-cli

# Clone project MobileGamePad and install dependencies
git clone https://github.com/sbidolach/mobile-gamepad.git
cd mobile-gamepad
npm install

# Run MobileGamepad
sudo grunt start
```

* Open in mobile browser the below URL (Mobile phone and raspberry have to be in this same network)

```
http://[ip_address_raspberry_pi]:8888
```

* Run gamepad in background and enable on startup

```bash
# Enable Mobile gamepad on startup
sudo npm install pm2 -g
sudo pm2 start app.sh
sudo pm2 startup
sudo pm2 save
```

# RetroPie configuration

* Copy config file

```bash
sudo cp /other/retropie/MobileGamePad.cfg /opt/retropie/configs/all/retroarch-joypads/
```

# Install application on mobile phone

* Open chrome borwser with url `http://[ip_address_raspberry_pi]:8888`
* Open chrome menu (right top corner)
* Select option `Add to home screen`
* Add application title `MobileGamepad`
* The shortcut should be added to home screen

![Standalone installation step 1](/other/resources/screenshot_add_home_screen.png)
![Standalone installation step 2](/other/resources/screenshot_add_title.png)
![Standalone installation step 3](/other/resources/screenshot_add_icon.png)

# Additional tools

The below tool allows check gamepad connection and sending events

```bash
sudo apt-get install input-utils
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

---

# TODO

- Simulate mouse (Z Axis, Rotate Z Axis) by moving mobile phone (for Quake, etc.) [In progress]
- Add second joystick (Z Axis, Rotate Z Axis) to move mouse (for Quake, etc.)
- Add simple KODI or other installation package
- Integrate gamepad with LaunchBox

# Development

- If you would like participate in innovate and interesting project, please contact with me.

# Problem solving

- No more problems with battery in gamepad
- No more problems with multi-players
- One gamepad uses everywhere
