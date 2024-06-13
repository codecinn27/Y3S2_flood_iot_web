//updated rain value, status 
// Define a structure to hold the sensor readings
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <DHT.h>
#include <LiquidCrystal_I2C.h>

#define APIKEY  ""
#define DEVICE_DEV_ID ""

// const char ssid[] = "1Oz6-2.4G";             //change SSID wifi
// const char password[] = "1_Oz6@915";     //change password wifi

// const char ssid[] = "testing1";
// const char password[] = "hyc12345";

const char ssid[] = "POCO F3";
const char password[] = "nopassword";

//Ayer Keroh Bot
const char* telegramBotToken = "";
//Flood Observatory System Berr 2024
const char* telegramChatId = ""; 

// Define the input pins
DHT DHT11_SENSOR_PIN(4, DHT11);
#define RAIN_SENSOR_PIN 34 
// #define TRIG_PIN 33
// #define ECHO_PIN 32
#define pwPin1 32
LiquidCrystal_I2C lcd(0x27, 20, 4);  // set the LCD address to 0x27 for a 20 chars and 4 line display

float humidity;
float tempC;
float tempF;
String rain_output;
float distance_cm, sensor;
float rain;
float zeroRain = 4095; //no rain detect will output 4095
String status= "Safe"; //Safe, Warning, Danger

unsigned long previousMillis = 0;
const long interval = 5000; // interval of 5 seconds for the data to be updated to FavorIot

void setup() {
  // DHT11
  DHT11_SENSOR_PIN.begin(); // initialize the DHT11 sensor / can be changed according to the name declared in line 5 'dht11'
  
  // Rain sensor
  pinMode(RAIN_SENSOR_PIN, INPUT);

  // Ultrasonic Sensor
  // pinMode(TRIG_PIN, OUTPUT);
  // pinMode(ECHO_PIN, INPUT);
  pinMode(pwPin1, INPUT);

  // LCD
  lcd.init();
  lcd.backlight();

  Serial.begin(115200);

  WiFi.mode(WIFI_STA);
  Serial.print("Connecting to ");
  Serial.print(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("Connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}


// Function to read from the DHT11 sensor and return the readings
void readDHT11Sensor() {
  // Read humidity
  humidity = DHT11_SENSOR_PIN.readHumidity();

  // Read temperature in Celsius
  tempC = DHT11_SENSOR_PIN.readTemperature();

  // Read temperature in Fahrenheit
  tempF = DHT11_SENSOR_PIN.readTemperature(true);
  

  // Check whether the reading is successful or not
  if (isnan(tempC) || isnan(tempF) || isnan(humidity)) {
    Serial.println("Failed to read from DHT11 sensor!");
  } else {
    Serial.print("Humidity: ");
    Serial.print(humidity);
    Serial.print("%  |  Temperature: ");
    Serial.print(tempC);
    Serial.print("°C  ~  ");
    Serial.print(tempF);
    Serial.println("°F");
  }
  
}

// Function to read from the rain sensor and return the reading 
void checkRain(int rainSensorPin) {
  rain = zeroRain - analogRead(rainSensorPin);
  if(rain>=2200){
    rain_output = "Heavy rain";
    Serial.println("Heavy rain");
  }else if (rain >= 400) {
    rain_output = "Light rain";
    Serial.println("Light rain");
  }
  else {
    rain_output = "No rain";
    Serial.println("No rain");
  }
  Serial.println(rain);
}

void read_ez1_sensor(){
  sensor = pulseIn(pwPin1, HIGH);
  distance_cm = sensor/147 * 2.54;
  //modify here
  distance_cm = 56.5- distance_cm;
}

void displaySensorReadings(float tempC, float tempF, float humidity, String rain, float distance) {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Temp: " + String(tempC, 2) + "C " + String(tempF, 2) + "F");
  lcd.setCursor(0, 1);
  lcd.print("Hum: " + String(humidity, 2) + "%");
  lcd.setCursor(0, 2);
  lcd.print("Rain: " + rain);
  lcd.setCursor(0, 3);
  lcd.print("Water Lvl: " + String(distance, 2) + "cm ");
  delay(200);
  // Depending on your display size, you may need to create additional pages or scroll text to display all information.
}

void checkStatus(){
  if(rain>=2495 || distance_cm>30){
    status = "Danger";
  }else if(rain>=1495 || distance_cm>15){
    status = "Warning";
  }else{
    status = "Safe";
  }
  Serial.println("Status: " + status);
}

void sendTelegramMessage(String message) {

  WiFiClientSecure client;
  client.setInsecure(); // Bypass SSL verification

  HTTPClient http;
  String url = "https://api.telegram.org/bot" + String(telegramBotToken) + "/sendMessage";
  StaticJsonDocument<200> jsonDoc;
  jsonDoc["chat_id"] = telegramChatId;
  jsonDoc["text"] = message;

  String jsonString;
  serializeJson(jsonDoc, jsonString);

  Serial.println("Sending to Telegram: " + jsonString); // Debugging output

  http.begin(client,url);
  http.addHeader("Content-Type", "application/json");

  int httpCode = http.POST(jsonString);
  if (httpCode > 0) {
    Serial.printf("[HTTP] POST to Telegram... code: %d\n", httpCode);
    if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_ACCEPTED) {
      String payload = http.getString();
      Serial.println("Telegram response: " + payload);
    } else {
      Serial.printf("Telegram error code: %d\n", httpCode);
      String payload = http.getString();
      Serial.println("Error response: " + payload);
    }
  } else {
    Serial.printf("[HTTP] POST to Telegram... failed, error: %s\n", http.errorToString(httpCode).c_str());
  }
  http.end();
}

void loop() {
  // *****Call the function to get the sensor readings*****

  // DHT11
  readDHT11Sensor();

  // Rain sensor
  checkRain(RAIN_SENSOR_PIN);

  // Ultrasonic
  //readUltrasonicDistance(TRIG_PIN, ECHO_PIN);
  // Serial.print("Distance: ");
  // Serial.print(distance_cm);
  // Serial.println("cm");
  read_ez1_sensor();

  //check Status
  checkStatus();

  // Call the function to display the sensor readings on the LCD
  displaySensorReadings(tempC, tempF, humidity, rain_output, distance_cm);




  // put your main code here, to run repeatedly:
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {

    previousMillis = currentMillis;

    // Initial and Styling in JSON
    StaticJsonDocument<200> doc;
    JsonObject root = doc.to<JsonObject>(); // Json Object refer to { }
    root["device_developer_id"] = DEVICE_DEV_ID;

    // Create data and list in JSON
    JsonObject data = root.createNestedObject("data");
    data["celsius"] = float(tempC);
    data["fahrenheit"] = float(tempF);
    data["humidity"] = float(humidity);
    data["rain"] = rain_output;
    data["rainValue"] = float(rain);
    data["distance"] = float(distance_cm);
    data["status"] = status;
       
    // Body content of request
    String body;
    serializeJson(root, body);
    Serial.println(body);

    // Initiate and Start HTTP to connect with FavorIOT
    HTTPClient http;

    http.begin("https://apiv2.favoriot.com/v2/streams");
    http.addHeader("Content-Type", "application/json");
    http.addHeader("Apikey", APIKEY);

    int httpCode = http.POST(body);
    if (httpCode > 0) {
      Serial.printf("[HTTP] POST... code: %d\n", httpCode);

    }
    else {
      Serial.printf("[HTTP] POST... failed, error: %s\n", http.errorToString(httpCode).c_str());
    }
    http.end();
  // Check if distance is less than 8 cm
    if (status=="Danger") {
      String alertMessage = "Alert: Water level is critically high!\n";
      alertMessage += "Location: Ayer Keroh\n";
      alertMessage += "Temperature: " + String(tempC) + " °C / " + String(tempF) + " °F\n";
      alertMessage += "Humidity: " + String(humidity) + "%\n";
      alertMessage += "Rain: " + rain_output + "\n";
      alertMessage += "Distance: " + String(distance_cm) + " cm\n";
      alertMessage += "Evacuate immediately due to flood risk!";
      sendTelegramMessage(alertMessage);
    }else if (status=="Warning") {
      String alertMessage = "Warning: Water level is high!\n";
      alertMessage += "Location: Ayer Keroh\n";
      alertMessage += "Temperature: " + String(tempC) + " °C / " + String(tempF) + " °F\n";
      alertMessage += "Humidity: " + String(humidity) + "%\n";
      alertMessage += "Rain: " + rain_output + "\n";
      alertMessage += "Distance: " + String(distance_cm) + " cm\n";
      alertMessage += "Please remain vigilant and closely monitor the situation to ensure timely evacuation in case of a potential flood.";
      sendTelegramMessage(alertMessage);
    }  
  
  }
}
