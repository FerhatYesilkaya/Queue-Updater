document.addEventListener('DOMContentLoaded', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });


  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: populateDropdownWithSpanClass
  }, (injectionResults) => {
    const spans = injectionResults[0].result;
    if (spans.length === 0) {
      console.error('No span elements found with the specified class.');
      alert('Bitte einmal die Queue-Auswahlansicht in Rexis wechseln');
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
        console.log("Es ist defined:" + selectedOption.text);
        dropdown.value = selectedOption.text;
      } else {
        getDataFromIniFile("configurable_parameters", 'default_queue', function (value) {
          console.log("Es ist undefined:" + value);
          dropdown.value = value;
        });
      }
    });
  });
  // Event-Handler für die Änderung des Dropdown-Menüs
  document.getElementById('spanDropdown').addEventListener('change', (event) => {
    console.log("Änderung erkannt");
    const selectedText = event.target.value; // Ausgewählter Text aus dem Dropdown-Menü
    const selectedIndex = event.target.selectedIndex; // Index der ausgewählten Option
    chrome.storage.sync.set({ 'selectedDropDownOption': { text: selectedText, index: selectedIndex } }); // Speichere den ausgewählten Text und Index in der Storage
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
          console.error('Bitte einmal die Queue-Auswahlansicht in Rexis wechseln');
        }
      },
      args: [text] // Hier wird der Text als Argument übergeben
    });
  });

}

function processIniFile(fileUrl, callback) {
  fetch(fileUrl)
    .then(response => response.text())
    .then(text => {
      const lines = text.split('\n');
      const data = {};
      let currentSection = null;

      lines.forEach(line => {
        line = line.trim();

        // Ignore comments and empty lines
        if (line.startsWith(';') || line === '') {
          return;
        }

        // Check for section headers
        if (line.startsWith('[') && line.endsWith(']')) {
          currentSection = line.substring(1, line.length - 1);
          data[currentSection] = {};
          return;
        }

        // Parse key-value pairs
        const keyValue = line.split('=');
        if (keyValue.length === 2 && currentSection !== null) {
          const key = keyValue[0].trim();
          const value = keyValue[1].trim();
          data[currentSection][key] = value;
        }
      });

      callback(data);
    })
    .catch(error => {
      console.error('Error reading INI file:', error);
      callback(null);
    });
}


function getDataFromIniFile(section, key, callback) {
  processIniFile('config.ini', function (data) {
    if (data) {
      console.log('INI-Daten erfolgreich gelesen:');
      console.log(data[section][key]);
      callback(data[section][key]);
    } else {
      console.error('Fehler beim Lesen der INI-Datei.');
      callback(null);
    }
  });
}