const fileInput = document.querySelector('#file-input');
const fileName = document.querySelector('#file-name');
const jsonOutput = document.querySelector('#json-output');
const copyButton = document.querySelector('#copy-button');
const copyStatus = document.querySelector('#copy-status');

function simplifyConversations(json) {
  return {
    conversations: json.conversations.map(({ conversation, responses }) => ({
      conversation: {
        create_time: conversation.create_time,
        modify_time: conversation.modify_time,
        title: conversation.title,
        summary: conversation.summary,
      },
      responses: responses.map(({ response }) => ({
        message: response.message,
        sender: response.sender,
        model: response.model,
        create_time: new Date(
          Number(response.create_time.$date.$numberLong),
        ).toISOString(),
      })),
    })),
  };
}

fileInput.addEventListener('change', async () => {
  const [file] = fileInput.files;

  if (!file) {
    return;
  }

  fileName.textContent = file.name;

  try {
    const contents = await file.text();
    const simplifiedJson = simplifyConversations(JSON.parse(contents));
    jsonOutput.value = JSON.stringify(simplifiedJson, null, 2);
  } catch (error) {
    jsonOutput.value = JSON.stringify({
      error: 'The selected file is not valid JSON.',
    }, null, 2);
  }
});

copyButton.addEventListener('click', async () => {
  if (!jsonOutput.value) {
    copyStatus.textContent = 'There is no JSON to copy yet.';
    return;
  }

  try {
    await navigator.clipboard.writeText(jsonOutput.value);
    copyStatus.textContent = 'JSON copied to clipboard.';
  } catch (error) {
    copyStatus.textContent = 'Unable to copy. Please copy the output manually.';
  }
});
