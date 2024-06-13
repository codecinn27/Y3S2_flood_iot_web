#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <ESP32Servo.h>

const char ssid[] = "POCO F3";
const char password[] = "nopassword";

// const char* ssid = "1Oz6-2.4G";  // Replace with your Wi-Fi SSID
// const char* password = "1_Oz6@915";  // Replace with your Wi-Fi password

// const char* ssid = "testing1";  // Replace with your Wi-Fi SSID
// const char* password = "hyc12345";  // Replace with your Wi-Fi password

const char* server = "https://apiv2.favoriot.com/v2/streams";
const char* apiKey = "";  // Replace with your Favoriot API Key
const char* deviceID = "";  // Replace with your Favoriot Device ID

Servo myServo;
int entGate = 32; // Change to the pin you want to use on Arduino Mega
Servo myServo2;
int extGate = 33; // Change to the pin you want to use on Arduino Mega
int angle2 = 0;
int button_open = 35;  //green button
int button_close = 34;  //blue button

unsigned long previousMillis = 0;  // Stores last time HTTP request was made
const long interval = 5000;  // Interval for HTTP request (5 seconds)

void setup() {
  Serial.begin(115200);
  myServo.attach(entGate);
  myServo2.attach(extGate);
  pinMode(button_open, INPUT);
  pinMode(button_close, INPUT);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi connected");
}

void loop() {
  // Handle button presses immediately
  handleButtonPress();

  // Perform periodic HTTP GET request
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
    performHttpGet();
  }
}

void handleButtonPress() {
  if (digitalRead(button_open) == HIGH) {
    myServo.write(180);
    myServo2.write(0);
    sendCommandToFavoriot(1);
  }

  if (digitalRead(button_close) == HIGH) {
    myServo.write(0);
    myServo2.write(180);
    sendCommandToFavoriot(0);
  }
}

void sendCommandToFavoriot(int command) {
  StaticJsonDocument<200> doc;
  JsonObject root = doc.to<JsonObject>();
  root["device_developer_id"] = deviceID;
  JsonObject data = root.createNestedObject("data");
  data["command"] = command;
  String body;
  serializeJson(root, body);
  Serial.println(body);

  HTTPClient http;
  http.begin("https://apiv2.favoriot.com/v2/streams");
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Apikey", apiKey);

  int httpCode = http.POST(body);
  if (httpCode > 0) {
    Serial.printf("[HTTP] POST... code: %d\n", httpCode);
    if (httpCode == HTTP_CODE_OK) {
      String payload = http.getString();
      Serial.println(payload);
    }
  } else {
    Serial.printf("[HTTP] POST... failed, error: %s\n", http.errorToString(httpCode).c_str());
  }
  http.end();
}

void performHttpGet() {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClientSecure client;
    client.setInsecure(); // Disable SSL certificate verification
    HTTPClient http;
    String url = String(server) + "?device_developer_id=" + deviceID;
    Serial.print("Connecting to URL: ");
    Serial.println(url);
    http.begin(client, url);  // Use WiFiClient and URL

    http.addHeader("Content-Type", "application/json");
    http.addHeader("apikey", apiKey);

    int httpCode = http.GET();
    Serial.print("HTTP Response code: ");
    Serial.println(httpCode);

    if (httpCode > 0) {
      String payload = http.getString();
      //Serial.println("Payload: " + payload);

      // Parse JSON payload
      DynamicJsonDocument doc(2048);
      DeserializationError error = deserializeJson(doc, payload);

      if (!error) {
        // Accessing the last element of the results array
        JsonObject latestResult = doc["results"][0];

        // Accessing the command value of the last result
        int command = latestResult["data"]["command"];
        Serial.print("Command: ");
        Serial.println(command);

        // Act based on the command
        if (command == 1) {
          myServo.write(180);
          myServo2.write(0);
        } else if (command == 0) {
          myServo.write(0);
          myServo2.write(180);
        }
      } else {
        Serial.print("JSON deserialization failed: ");
        Serial.println(error.c_str());
      }
    } else {
      Serial.print("Error on HTTP request: ");
      Serial.println(httpCode);
    }

    http.end();
  } else {
    Serial.println("WiFi not connected");
  }
}
