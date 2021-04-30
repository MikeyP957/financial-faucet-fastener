let db;
let budgetVersion;

//create new db request for budget
const request = indexedDB.open('budgetDb', budgetVersion || 21);

request.onupgradeneeded = function (evt) {
    console.log('upgrade needed in indexDb')

    const { oldVersion } = evt;
    const newVersion= evt.newVersion || db.version;
    console.log(`DB updated from version ${oldVersion} to ${newVersion}`)

    db = evt.target.result

    if (db.objectStoreNames.length === 0) {
        db.createObjectStore('BudgetStore', {autoIncrement: true });
    }
};

request.onerror = function (evt) {
    console.log(`oh no, ${evt.target.errorCode}`);

}

function checkDatabase() {
    console.log('checkDatabase-----')

    let transaction = db.transaction(['BudgetStore'], 'readwrite');

    const store = transaction.objectStore('BudgetStore')

    const getAll = store.getAll();

    // if request was successful
    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                  },
            })
            .then((response) => response.json())
            .then((res) => {
                if(res.length !== 0) {
                    // Open another transaction to BudgetStore with the ability to read and write
                    transaction = db.transaction(['BudgetStore'], 'readwrite');
                    // Assign the current store to a variable
                    const currentStore = transaction.objectStore('BudgetStore');

                    // Clear existing entries because our bulk add was successful
                    currentStore.clear();
                    console.log('Clearing store');
                }
            })
        }
    }
}

request.onsuccess = function (evt) {
    console.log('you did it');
    db = evt.target.result;

    if (navigator.onLine) {
        console.log('Backend online!');
        checkDatabase();
      }    
}

const saveRecord = (record) => {
    console.log('save record invoked')

    const transaction = db.transaction(['BudgetStore', 'readwrite'])

    const store = transaction.objectStore('BudgetStore');

    store.add(record);
}

window.addEventListener('online', checkDatabase);