


document.addEventListener('DOMContentLoaded', async () => {
    const res = await fetch('http://localhost:5000/getall');
    const data = await res.json();
    loadHTMLTable(data['data']);
})

document.querySelector('table tbody').addEventListener('click', (event) => {
    console.log('from event listener: ', event.target);
    if (event.target.className === 'delete-row-btn') {
        deleteRowById(event.target.dataset.id);
        
    }
    if (event.target.className === 'edit-row-btn') {
        editRowById(event.target.dataset.id);
        
    }
});

const updateBtn = document.getElementById('update-row-btn');
const searchBtn = document.getElementById('search-btn');
const resetBtn = document.getElementById('reset-search-btn');

resetBtn.onclick = getTableData;

searchBtn.onclick = async() => {
    const searchValue = document.getElementById('search-input').value;

    const response = await fetch(`http://localhost:5000/search/${searchValue}`);
    const data = await response.json();
    const table = document.querySelector('table tbody');
    table.innerHTML = '';
    loadHTMLTable(data['data']);
}

async function deleteRowById(id) {
    const res = await fetch(`http://localhost:5000/delete/${id}`, {
        method: 'DELETE'
    });

    const data = await res.json();
    console.log(data);
    const table = document.querySelector('table tbody');
    table.innerHTML = '';
    getTableData();
}

async function editRowById(id) {
    const updateRow = document.getElementById('update-row');
    updateRow.hidden = !updateRow.hidden
    console.log(updateRow.hidden)
    console.log('id before dataset: ', id);
    document.getElementById('update-row-btn').dataset.id = id;
    
}

updateBtn.onclick = async() => {
    const updateNameInput = document.getElementById('update-name-input');
    const nameId = document.getElementById('update-row-btn').dataset.id;
    const updateNameValue = updateNameInput.value;
    updateNameInput.value = '';
    const updateRow = document.getElementById('update-row');
    updateRow.hidden = true;
    console.log('this is updateName: ', updateNameValue);
    

    const res = await fetch('http://localhost:5000/update', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'PATCH',
        body: JSON.stringify({
            id: nameId,
            name: updateNameValue
        })
    });
    
    const data = await res.json({success: true});
    console.log('this is data log: ', data);
    const table = document.querySelector('table tbody');
    table.innerHTML = '';
    getTableData();
    
}

async function getTableData() {
    const res = await fetch('http://localhost:5000/getAll');
    const data = await res.json();
    loadHTMLTable(data['data']);
}

const addBtn = document.getElementById('add-name-btn');


addBtn.onclick = async() => {
    const nameInput = document.querySelector('#name-input');
    const name = nameInput.value;
    
    nameInput.value = '';
    const res = await fetch('http://localhost:5000/insert', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({name})
       
    })
    
    const data = await res.json()
    
    insertRowIntoTable(data['data']);
    
}

function insertRowIntoTable(data) {
    const table = document.querySelector('table tbody');
    const isTableData = table.querySelector('.no-data');

    let rowHtml = "<tr>";

    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            if (key === 'dateAdded') data[key] = new Date(data[key]).toLocaleString();
            rowHtml += `<td>${data[key]}</td>`;
        }
    }

    rowHtml += `<td><button class="delete-row-btn" data-id=${data.id}>Delete</button></td>`;
    rowHtml += `<td><button class="edit-row-btn" data-id=${data.id}>Toggle Edit</button></td>`;
    rowHtml += "</td>";

    if (isTableData) table.innerHTML = rowHtml;
    else {
        const newRow = table.insertRow();
        newRow.innerHTML = rowHtml;
    }
}

function loadHTMLTable(data) {
        const table = document.querySelector('table tbody');
    if (data.length === 0) {
        console.log([]);
        const row = table.insertRow();
        row.innerHTML = "<td class='no data' colspan='5'>No Data</td>";
        return;
    } 
    let rowHtml = '';
    
    data.forEach(({ id, name, date_added }) => {
        //const row = table.insertRow();
        rowHtml += "<tr>";
        rowHtml += `<td>${id}</td>`;
        rowHtml += `<td>${name}</td>`;
        rowHtml += `<td>${new Date(date_added).toLocaleString()}</td>`;
        rowHtml += `<td><button class="delete-row-btn" data-id=${id}>Delete</button></td>`;
        rowHtml += `<td><button class="edit-row-btn" data-id=${id}>Toggle Edit</button></td>`;
        rowHtml += "</tr>";
        table.innerHTML = rowHtml;
    })
}