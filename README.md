The project aims to assist visually impaired individuals in navigation through a computer vision-based application. Using object detection and depth estimation, the app identifies obstacles in real-time and provides guidance on whether it's safe to proceed or suggests alternative routes. Integrated with the OpenServiceNetwork API, it offers comprehensive route information and instructions tailored to the user's location. The app operates with remarkable speed, processing and responding to obstacles within a 3-second timeframe, ensuring timely assistance for users. Overall, the application offers a unique and innovative solution to enhance the independence and safety of visually impaired individuals during navigation.

### Challenges faced by visually impaired people

1. **Navigation Challenges**: Visually impaired individuals often struggle with navigating unfamiliar environments safely and independently.    
2. **Obstacle Identification**: Identifying obstacles in real-time can be difficult for the visually impaired, leading to potential accidents or injuries.
3. **Accessing Location Information**: Obtaining accurate location information and directions to specific destinations can be challenging without visual cues.
4. **Interacting with Surroundings**: Blind individuals face difficulties in interacting with objects and surroundings, such as reading signs or locating doorways.


### How Xeno solves these ?
1. **Real-Time Navigation Assistance**: Xeno provides real-time guidance and instructions to help visually impaired individuals navigate their surroundings safely and efficiently.
2. **Obstacle Detection and Avoidance**: Using object detection technology, Xeno identifies obstacles in the environment and alerts users, enabling them to navigate around potential hazards.
3. **Location Information and Directions**: Xeno integrates with mapping services like OpenStreetMap to provide accurate location information, including coordinates and step-by-step directions to desired destinations.
4. **Object Recognition and Interaction**: Xeno's object detection capabilities assist users in recognizing and interacting with objects in their environment, enhancing their independence and autonomy.


### How to run ?

For the Frontend of the application, clone this repository and run `npx expo start` to start the expo development server. You should have `expo` App installed in your mobile phone.

Once server starts in the terminal, click `s` on your keyboard. After this select `Scan QR code` option from the expo application and scan the QR shown on the terminal. 

![[./screenshots/1.jpeg]]

![[./screenshots/2.jpeg]]

After the scan is complete it open a link in your browser to select whether you want to install `APK` or run on `Expo`, select to run on `Expo`. Once that is done, the app will be installed and ready to use.

### Technologies Used:

Frontend: 
	1. React Native
	2. Expo

Backend:
	1. Python (Flask)
	2. Customized Depth Detection algorithm
	3. LLMs (HuggingFace)
	4. Maps
	5. Object Detection and Image Captioning
	6. ngrok

### App Screens
![[./screenshots/3.jpeg]]

**Options**:

1. **"What's around me ?"**: Enables the visually impaired user to analyze the things and environment in front of him/her. A visual LLM is used for captioning of the real-time image.

2. **"Capture Image"**: Captures single image on the press of the button and the assistant notifies the user based on TTS that whether things are clear for them to move forward or do they have some other alternate move to get pass through the obstacle.

3. "**Start Realtime**": Captures continuous images in realtime and analyzes them for appropriate response similar to above. Despite being continuous the average time that a API request takes to reach the server and return to client is less than 3s.
