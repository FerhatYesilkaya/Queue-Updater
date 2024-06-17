
const keepAlive = () => setInterval(chrome.runtime.getPlatformInfo, 20e3);
chrome.runtime.onStartup.addListener(keepAlive);
keepAlive();

// Setze einen Alarm, der alle 15 Minuten ausgelöst wird
chrome.alarms.create('keepAlive', { periodInMinutes: 15 });

// Füge einen Listener hinzu, der auf den Alarm reagiert
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'keepAlive') {
    chrome.runtime.getPlatformInfo((info) => {
      console.log('Platform info fetched to keep the Service Worker alive:', info);
    });
  }
});

const startServiceWorker = () => {
  console.log('Service Worker started.');
};

// Listener hinzufügen, um den Service Worker beim Start zu aktivieren
chrome.runtime.onStartup.addListener(startServiceWorker);
chrome.runtime.onInstalled.addListener(startServiceWorker);
startServiceWorker();

// Verhindert das standardmäßige Abfangen von Promise-Fehlern
self.addEventListener('unhandledrejection', event => {
  event.preventDefault();
});

// Aktiviert den Service Worker, wenn der Benutzer nicht mehr inaktiv ist
chrome.idle.onStateChanged.addListener((newState) => {
  if (newState === 'active') {
    startServiceWorker();
  }
});

function clickRefreshButtonPeriodically() {
  chrome.storage.sync.get('default_queue', (data) => { 
    const selectedOption = data.default_queue;
    if (selectedOption !== undefined) {
      chrome.storage.sync.get("currentSelectedView", function (result) {
        for (let i = 0; i < data.default_queue.text.length; i++) {
          console.log(result.currentSelectedView === data.default_queue.text[i]);
          if (result.currentSelectedView === data.default_queue.text[i]) {
            const selectedIndex = selectedOption.index; // Ändern Sie den Namen des Indexattributs entsprechend Ihrer Speicherstruktur
            clickButtonByNameAndType('refreshButton', 'button');
            break;
          }
        }
      });
    }
  });
}


getDataFromIniFile("configurable_parameters", 'default_queue', "main",function (value) {
  if (value !== null) {
    chrome.storage.sync.set({ 'default_queue': { text: value, index: 0 } }); // Speichere den ausgewählten Text und Index in der Storage
  } else {
    console.error('Fehler beim Abrufen des Werts aus der INI-Datei - key: default_queue');
  }
});

// Periodisches Ausführen der Klickfunktion alle 10 Sekunden

getDataFromIniFile("configurable_parameters", 'refresh_time_in_minutes', "main",function (value) {
  if (value !== null) {
    setInterval(clickRefreshButtonPeriodically, parseInt(parseFloat(value[0]) * 60000));
    setInterval(getCurrentQueueTextPeriodically, parseInt(parseFloat(value[0]) * 60000 - 250));
  } else {
    console.error('Fehler beim Abrufen des Werts aus der INI-Datei - key: refresh_time_in_minutes');
    setInterval(clickSpanPeriodically, 120000);
    setInterval(getTextFromSpanPeriodically, 119900);
  }
});

function clickButtonByNameAndType(buttonName, buttonType) {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      const tabId = tab.id;
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: (buttonName, buttonType) => {
          const button = document.querySelector(`button[name="${buttonName}"][type="${buttonType}"]`);
          if (button) {
            button.click(); // Klicke auf den Button mit dem angegebenen Namen und Typ
            console.log("Button mit dem Namen: " + buttonName + " und Typ: " + buttonType + " geklickt");
          } else {
            console.log('Kein Button mit dem Namen: ' + buttonName + ' und Typ: ' + buttonType + ' gefunden.');
          }
        },
        args: [buttonName, buttonType]
      });
    });
  });
}
function getCurrentQueueTextPeriodically() {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      const tabId = tab.id;
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: () => {
          const spans = document.querySelectorAll('span.selectedListView');
          if (spans.length > 0) {
            const spanText = spans[0].textContent;
            // Hier können Sie den Text des Span-Elements verwenden oder weitere Verarbeitungen durchführen
            chrome.storage.sync.set({ "currentSelectedView": spanText });
          } else {
            console.log('Kein Span-Element mit der Klasse '+spanText+' gefunden.');
          }
        }
      });
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
          let value = keyValue[1].trim();

          // Check if value contains commas, then split and store as array
          if (value.includes(',')) {
            value = value.split(',').map(item => item.trim());
          } else {
            // If no commas, store value as an array with one element
            value = [value];
          }

          data[currentSection][key] = value;
        }
      });

      callback(data);
    })
    .catch(error => {
      console.error('Fehler beim Lesen der INI-Datei:', error);
    });
}



function getDataFromIniFile(section, key, functionMessageForLog,callback) {
  processIniFile('config.ini', function (data) {
    if (data) {
      callback(data[section][key]);
    } else {
      console.error('Fehler beim Lesen der INI-Datei - ' + functionMessageForLog);
    }
  });
}