void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
}

void loop() {
    String incoming = Serial.readString();
    // say what you got:  
    if (incoming == "start_daq") {
      while(true) {
        Serial.print("start");
        delay(250);
        if(Serial.readString() == "stop_daq") {
          break;
        }
      }
    } else if(incoming == "start_bpm") {
       while(true) {
        Serial.print("bpm");
        delay(250);
        if(Serial.readString() == "stop_bpm") {
          break;
        }
      }
    }
  
}
