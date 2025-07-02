/**
 * Responds to a MESSAGE event in Google Chat.
 * This function is specifically designed to handle MESSAGE events when configured.
 *
 * @param {GoogleAppsScript.Events.ChatEvent} event The event object from Google Chat.
 * @return {GoogleAppsScript.Chat.ChatResponse} The response to send back to Google Chat.
 */
function onMessage(event) {
  Logger.log('Received Chat event in onMessage: ' + JSON.stringify(event));

  if (event && event.message && event.message.text) {
    var messageText = event.message.text;
    Logger.log('Message text received: ' + messageText);

    var apiUrl = "https://1bfe-14-194-109-82.ngrok-free.app/health";
    var apiResponseText = "Failed to fetch health status."; // Default error message

    // Define the options for the fetch request, including custom headers
    var options = {
      'headers': {
        'ngrok-skip-browser-warning': 'true' // Set the required header with any value
      },
      // You can add other options here if needed, like 'method', 'payload', etc.
      'method' : 'get' // Explicitly setting method to GET, though it's default for fetch
    };

    try {
      // Make the HTTP GET request with custom headers
      var response = UrlFetchApp.fetch(apiUrl, options, body);

      // Get the response content as a string
      apiResponseText = response.getContentText();
      Logger.log('API response received: ' + apiResponseText);

    } catch (e) {
      Logger.log('Error fetching health status from API: ' + e.toString());
      apiResponseText = `Error fetching health status: ${e.message}`;
    }

    // Return a simple text response including the API call result
    return {
      "text": `Hello from Chatbot (via onMessage)! You said: "${messageText}". Health status: ${apiResponseText}`
      // Optionally, to reply in the same thread:
      // "thread": {
      //   "name": event.message.thread.name
      // }
    };
  }

  Logger.log('Received non-message event or invalid event structure in onMessage.');
  return {};
}

// Ensure your appsscript.json still has "chat": {}
// If you are using onMessage, ensure your Google Cloud Console Chat API config points to 'onMessage'.