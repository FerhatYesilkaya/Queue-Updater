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
      option.value = spanText; // Der Wert ist jetzt der Text des Span-Elements
      option.textContent = spanText;
      dropdown.appendChild(option);
    });

    // Load selected option from storage
    chrome.storage.sync.get('selectedDropDownOption', (data) => { // 'selectedDropDownOption' verwenden
      const selectedOption = data.selectedDropDownOption;
      if (selectedOption !== undefined) {
        dropdown.value = selectedOption.text;
       // clickSpanWithText(selectedOption.text); // Hier wird das Textelement übergeben
      }
    });
  });

  // Event-Handler für die Änderung des Dropdown-Menüs
  document.getElementById('spanDropdown').addEventListener('change', (event) => {
    const selectedText = event.target.value; // Ausgewählter Text aus dem Dropdown-Menü
    const selectedIndex = event.target.selectedIndex; // Index der ausgewählten Option
    chrome.storage.sync.set({ 'selectedDropDownOption': { text: selectedText, index: selectedIndex } }); // Speichere den ausgewählten Text und Index in der Storage
    //clickSpanWithText(selectedText); // Ändere das ausgewählte Span-Element entsprechend der neuen Auswahl
  });
});

function populateDropdownWithSpanClass() {
  const spanClass = 'virtualAutocompleteOptionText';
  const spans = Array.from(document.querySelectorAll(`span.${spanClass}`)).slice(0, 8).map(span => span.textContent);
  return spans;
}

function clickSpanWithText(text) { // Diese Funktion wird aufgerufen, um das Span-Element mit dem angegebenen Text zu klicken
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;
    chrome.scripting.executeScript({
      target: { tabId: tabId, allFrames: true },
      function: (text) => { // Hier wird der Text übergeben
        const spans = document.querySelectorAll(`span.virtualAutocompleteOptionText`);
        const spanToClick = Array.from(spans).find(span => span.textContent === text);
        if (spanToClick) {
          spanToClick.click(); // Klicke auf das Span-Element mit dem angegebenen Text
        } else {
          console.error('No span element found with the specified text.');
        }
      },
      args: [text] // Hier wird der Text als Argument übergeben
    });
  });
  
}
