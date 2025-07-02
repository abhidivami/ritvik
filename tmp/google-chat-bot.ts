function onMessage(event) {
  Logger.log("Event received: " + JSON.stringify(event));

  // 🔹 1. Handle Dialog Trigger (/new-task)
  if (event.isDialogEvent && event.dialogEventType === "REQUEST_DIALOG") {
    const commandId = event.appCommandMetadata?.appCommandId;

    if (commandId === 2) {  // /new-task command
      return {
        actionResponse: {
          type: "DIALOG",
          dialogAction: {
            actionStatus: "OK", // ✅ Required to show submit button
            dialog: {
              body: {
                sections: [
                  {
                    header: "📝 Create New Task",
                    widgets: [
                      { textInput: { label: "Assigner", name: "assigner" } },
                      { textInput: { label: "Assignee", name: "asignee" } },
                      { dateTimePicker: { label: "Request Date", name: "request_date" } },
                      { textInput: { label: "Task Description", name: "task", type: "MULTIPLE_LINE" } },
                      { dateTimePicker: { label: "Deadline", name: "deadline" } },
                      { textInput: { label: "Status", name: "status", value: "incomplete" } }
                    ]
                  }
                ]
              },
              submitLabel: "Create Task" // ✅ Label for Submit button
            }
          }
        }
      };
    }
  }

  // 🔹 2. Handle Normal Message or Slash Commands
  if (event && event.message && event.message.text) {
    const messageText = event.message.text.trim();
    const sender = event.message.sender;
    const senderEmail = sender.email;
    var apiResponseText = "Invalid command.";

    if (event.message.slashCommand) {
      const commandId = event.message.slashCommand.commandId;
      Logger.log("Slash command triggered. ID: " + commandId);

      if (commandId === 1) {
        return {
          text: `👋 Hello ${sender.displayName || "there"}! I'm your TaskBot.\n\nTry commands like:\n- add task <desc>\n- get tasks for <user>\n- update task for <user>: <task>, status: <status>`
        };
      }

      return { text: `⚠️ Unknown slash command (ID: ${commandId})` };
    }

    try {
      if (/^add( the| a)? task/i.test(messageText)) {
        var addPayload = {
          message: messageText,
          assigner: senderEmail
        };

        var addResponse = UrlFetchApp.fetch("https://c17e-14-194-109-82.ngrok-free.app/add-task-from-chat", {
          method: 'post',
          contentType: 'application/json',
          payload: JSON.stringify(addPayload)
        });

        apiResponseText = addResponse.getContentText();

      } else if (messageText.toLowerCase().startsWith("get tasks for ")) {
        var asigneeName = messageText.substring(14).trim();

        var getResponse = UrlFetchApp.fetch("https://c17e-14-194-109-82.ngrok-free.app/get-tasks-by-name", {
          method: 'post',
          contentType: 'application/json',
          payload: JSON.stringify({ asignee: asigneeName })
        });

        var tasks = JSON.parse(getResponse.getContentText());

        apiResponseText = tasks.length
          ? "Task List:\n" + tasks.map((t, i) => `${i + 1}. ${t}`).join("\n")
          : "No tasks found.";

      } else if (
        messageText.toLowerCase().startsWith("get my tasks") ||
        messageText.toLowerCase().startsWith("get tasks assigned to me")
      ) {
        var asigneeName = sender.displayName || senderEmail;

        var getResponse = UrlFetchApp.fetch("https://c17e-14-194-109-82.ngrok-free.app/get-tasks-assigned-to-me", {
          method: 'post',
          contentType: 'application/json',
          payload: JSON.stringify({ asignee: asigneeName })
        });

        var tasks = JSON.parse(getResponse.getContentText());

        apiResponseText = tasks.length
          ? "Task List:\n" + tasks.map((t, i) => `${i + 1}. ${t}`).join("\n")
          : "No tasks found.";

      } else if (/update task for /i.test(messageText)) {
        messageText = messageText.normalize("NFKC").replace(/\s+/g, ' ').trim();
        var match = messageText.match(/^update task for (.+?):\s*(.+?)\s*,\sstatus:\s(.+)$/i);

        if (!match || match.length < 4) {
          apiResponseText = "Invalid update format. Use: update task for <asignee>: <task>, status: <status>";
        } else {
          var updatePayload = {
            asignee: match[1].trim(),
            task: match[2].trim(),
            status: match[3].trim()
          };

          var updateResponse = UrlFetchApp.fetch("https://c17e-14-194-109-82.ngrok-free.app/update-task-status-by-name", {
            method: 'post',
            contentType: 'application/json',
            payload: JSON.stringify(updatePayload)
          });

          apiResponseText = updateResponse.getContentText();
        }
      }
    } catch (e) {
      apiResponseText = "Error: " + e.message;
    }

    return { text: `Result:\n${apiResponseText}` };
  }

  return { text: "⚠️ No message detected." };
}

function onCardClick(e) {
  Logger.log("Dialog submit event: " + JSON.stringify(e));

  const formInputs = e.common?.formInputs || {};
  const getValue = (key) => formInputs[key]?.stringInputs?.value[0] || "";

  const payload = {
    assigner: getValue("assigner"),
    asignee: getValue("asignee"),
    request_date: getValue("request_date"),
    task: getValue("task"),
    deadline: getValue("deadline"),
    status: getValue("status") || "incomplete"
  };

  try {
    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload)
    };

    const response = UrlFetchApp.fetch("https://c17e-14-194-109-82.ngrok-free.app/add-task-from-chat", options);
    const result = response.getContentText();

    return {
      actionResponse: {
        type: "NEW_MESSAGE",
        message: `✅ Task Created Successfully!\n\n${result}`
      }
    };
  } catch (err) {
    Logger.log("Error in form submit: " + err.message);
    return {
      actionResponse: {
        type: "NEW_MESSAGE",
        message: "❌ Failed to create task. Please try again."
      }
    };
  }
}