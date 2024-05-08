document.addEventListener('DOMContentLoaded', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: populateDropdownWithSpanClass
  }, (injectionResults) => {
    const spans = injectionResults[0].result;
    if (spans.length === 0) {
      console.error('No span elements found with the specified class.');
      alert('No span elements found with the specified class.');
      return;
    }
    const dropdown = document.getElementById('spanDropdown');
    spans.forEach((spanText, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = spanText;
      dropdown.appendChild(option);
    });

    // Load selected option from storage
    chrome.storage.sync.get('selectedOption', (data) => {
      const selectedOption = data.selectedOption;
      if (selectedOption !== undefined) {
        dropdown.value = selectedOption;
        clickSpanWithIndex(selectedOption); // Klicke das ausgewählte Element an
      }
    });

    // Save selected option to storage on change
    dropdown.addEventListener('change', () => {
      const selectedIndex = dropdown.value; // Hole den ausgewählten Index
      chrome.storage.sync.set({ 'selectedOption': selectedIndex });
      clickSpanWithIndex(selectedIndex); // Klicke das ausgewählte Element an
    });

    // Click on the selected span when the popup is opened
    const selectedIndex = dropdown.value;
    clickSpanWithIndex(selectedIndex);
  });
});

function populateDropdownWithSpanClass() {
  const spanClass = 'virtualAutocompleteOptionText'; // Ersetze dies durch den tatsächlichen Klassennamen des Span-Elements
  const spans = Array.from(document.querySelectorAll(`span.${spanClass}`)).slice(0, 8).map(span => span.textContent);
  return spans;
}

function clickSpanWithIndex(index) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;
    chrome.scripting.executeScript({
      target: { tabId: tabId, allFrames: true }, // Führe das Skript in allen Frames der Seite aus
      function: (index) => {
        const spans = document.querySelectorAll(`span.virtualAutocompleteOptionText`);
        if (spans.length > index) {
          spans[index].click(); // Klicke auf das Span-Element mit dem empfangenen Index
        } else {
          console.error('Invalid index or no span elements found with the specified class.');
        }
      },
      args: [index]
    });
  });
}
