/**
 * Minimal Google Chat bot MVP:
 * - Presents one text input field.
 * - Shows a Submit button.
 * - Echoes the input upon submission.
 */

function onMessage(event) {
  // Trigger dialog when user sends /test
  if (event.message?.text === '/test') {
    return {
      actionResponse: {
        type: 'REQUEST_DIALOG',
        dialogAction: {
          dialog: {},
          callbackFunction: 'handleSubmit'
        }
      }
    };
  }

  // Default fallback
  return { text: 'Send /test to open the dialog.' };
}

function handleSubmit(event) {
  const input = event.common?.formInputs?.inputText?.stringInputs?.value?.[0] || '';
  return {
    actionResponse: {
      type: 'NEW_MESSAGE',
      message: `You entered: ${input}`
    }
  };
}

// Dialog handler (triggered after REQUEST_DIALOG)
function onDialog(event) {
  if (event.isDialogEvent && event.dialogEventType === 'REQUEST_DIALOG') {
    return {
      actionResponse: {
        type: 'DIALOG',
        dialogAction: {
          actionStatus: 'OK',
          callbackFunction: 'handleSubmit',
          dialog: {
            body: {
              sections: [
                {
                  widgets: [
                    {
                      textInput: {
                        label: 'Enter value',
                        name: 'inputText'
                      }
                    }
                  ]
                }
              ]
            },
            submitLabel: 'Submit'
          }
        }
      }
    };
  }

  return onMessage(event); // Reuse initial trigger logic
}