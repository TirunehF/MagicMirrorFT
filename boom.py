#!/usr/bin/env python3
from bluepy.btle import Peripheral

try:
    # Connect to device
    p = Peripheral("10:94:97:26:5B:F8")
    
    # Write to characteristic
    p.writeCharacteristic(0x0003, bytes.fromhex("2CCF67D34FCC01"), withResponse=True)
    
    print("Write successful!")
    p.disconnect()
    
except Exception as e:
    print(f"Error: {e}")