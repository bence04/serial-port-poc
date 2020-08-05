void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
}

void loop() {
    uint8_t myArray[546]={64, 74, 0, 30, 50, 100, 150, 220, 122, 0, 0, 0, 42, 64, 74, 0, 30, 50, 80, 100, 200, 122, 0, 0, 0, 208, 64, 74, 0, 30, 50, 80, 100, 220, 142, 0, 0, 0, 248, 64, 74, 0, 50, 80, 80, 100, 220, 142, 0, 0, 0, 2, 64, 74, 0, 30, 50, 100, 150, 220, 122, 0, 0, 0, 42, 64, 74, 0, 30, 50, 80, 100, 200, 122, 0, 0, 0, 208, 64, 74, 0, 30, 50, 80, 100, 220, 142, 0, 0, 0, 248, 64, 74, 0, 30, 50, 100, 150, 220, 122, 0, 0, 0, 42, 64, 74, 0, 30, 50, 80, 100, 200, 122, 0, 0, 0, 208, 64, 74, 0, 30, 50, 80, 100, 220, 142, 0, 0, 0, 248, 64, 74, 0, 50, 80, 80, 100, 220, 142, 0, 0, 0, 2, 64, 74, 0, 30, 50, 100, 150, 220, 122, 0, 0, 0, 42, 64, 74, 0, 30, 50, 80, 100, 200, 122, 0, 0, 0, 208, 64, 74, 0, 30, 50, 80, 100, 220, 142, 0, 0, 0, 248, 64, 74, 0, 30, 50, 100, 150, 220, 122, 0, 0, 0, 42, 64, 74, 0, 30, 50, 80, 100, 200, 122, 0, 0, 0, 208, 64, 74, 0, 30, 50, 80, 100, 220, 142, 0, 0, 0, 248, 64, 74, 0, 50, 80, 80, 100, 220, 142, 0, 0, 0, 2, 64, 74, 0, 30, 50, 100, 150, 220, 122, 0, 0, 0, 42, 64, 74, 0, 30, 50, 80, 100, 200, 122, 0, 0, 0, 208, 64, 74, 0, 30, 50, 80, 100, 220, 142, 0, 0, 0, 248, 64, 74, 0, 30, 50, 100, 150, 220, 122, 0, 0, 0, 42, 64, 74, 0, 30, 50, 80, 100, 200, 122, 0, 0, 0, 208, 64, 74, 0, 30, 50, 80, 100, 220, 142, 0, 0, 0, 248, 64, 74, 0, 50, 80, 80, 100, 220, 142, 0, 0, 0, 2, 64, 74, 0, 30, 50, 100, 150, 220, 122, 0, 0, 0, 42, 64, 74, 0, 30, 50, 80, 100, 200, 122, 0, 0, 0, 208, 64, 74, 0, 30, 50, 80, 100, 220, 142, 0, 0, 0, 248, 64, 74, 0, 30, 50, 100, 150, 220, 122, 0, 0, 0, 42, 64, 74, 0, 30, 50, 80, 100, 200, 122, 0, 0, 0, 208, 64, 74, 0, 30, 50, 80, 100, 220, 142, 0, 0, 0, 248, 64, 74, 0, 50, 80, 80, 100, 220, 142, 0, 0, 0, 2, 64, 74, 0, 30, 50, 100, 150, 220, 122, 0, 0, 0, 42, 64, 74, 0, 30, 50, 80, 100, 200, 122, 0, 0, 0, 208, 64, 74, 0, 30, 50, 80, 100, 220, 142, 0, 0, 0, 248, 64, 74, 0, 30, 50, 100, 150, 220, 122, 0, 0, 0, 42, 64, 74, 0, 30, 50, 80, 100, 200, 122, 0, 0, 0, 208, 64, 74, 0, 30, 50, 80, 100, 220, 142, 0, 0, 0, 248, 64, 74, 0, 50, 80, 80, 100, 220, 142, 0, 0, 0, 2, 64, 74, 0, 30, 50, 100, 150, 220, 122, 0, 0, 0, 42, 64, 74, 0, 30, 50, 80, 100, 200, 122, 0, 0, 0, 208, 64, 74, 0, 30, 50, 80, 100, 220, 142, 0, 0, 0, 248};
    String incoming = Serial.readString();
    // say what you got:  
    if (incoming == "start_daq") {
      while(true) {
        Serial.write(myArray, 546);
        delay(500);
        if(Serial.readString() == "stop_daq") {
          break;
        }
      }
    } else if(incoming == "start_bpm") {
       while(true) {
        Serial.print("bpm");
        delay(500);
        if(Serial.readString() == "stop_bpm") {
          break;
        }
      }
    }
  
}
