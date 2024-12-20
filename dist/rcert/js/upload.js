const CHUNK_SIZE = 1000000; // 1MB
const fileInput = document.getElementById('file-input');
const progressDiv = document.getElementById('progress');

document.getElementById('upload-button').addEventListener('click', () => {
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a file to upload.');
        return;
    }

    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    let currentChunk = 0;

    // Keep Screen Awake & play silent audio 
    requestWakeLock();
    playSilentAudio();

    function uploadChunk(chunk, index) {
        const formData = new FormData();
        formData.append('file', chunk);
        formData.append('name', file.name);
        formData.append('index', index);
        formData.append('totalChunks', totalChunks);

        fetch('./upload.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.text())
            .then(() => {
                currentChunk++;
                progressDiv.innerText = `Uploaded ${currentChunk} of ${totalChunks} chunks`;
                if (currentChunk < totalChunks) {
                    const start = currentChunk * CHUNK_SIZE;
                    const end = Math.min(start + CHUNK_SIZE, file.size);
                    uploadChunk(file.slice(start, end), currentChunk);
                } else {
                    progressDiv.innerText = 'Upload complete!';

                    // Remove Screen Awake & Pause silent audio
                    releaseWakeLock();
                    audio.pause();
                }
            })
            .catch(error => console.error('Upload failed:', error));
    }

    uploadChunk(file.slice(0, CHUNK_SIZE), currentChunk);
});

// RUN (Load Files) after page load
document.addEventListener('DOMContentLoaded', loadFiles);

// Load Files
async function loadFiles() {
    const url = './list.php';

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const tableBody = document.getElementById('table-body');
            tableBody.innerHTML = ''; // Clear previous data

            if (data.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="3">No data available.</td></tr>';
                return;
            }

            data.forEach(item => {
                let size = convertBytes(item.size);
                let date = convertUnixToDateTime(item.modified);

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><a href="${item.path}">${item.name}</a></td>
                    <td>${size}</td>
                    <td>${date}</td>
                    <td><button class="delete" data-delete-path="${item.path}">Delete</button></td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

// Delete files from Server
document.addEventListener('click', function (event) {
    if (event.target.matches('.delete')) {
        let filePath = event.target.getAttribute('data-delete-path');

        if (confirm('Are you sure you want to delete this file?')) {
            fetch('delete.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ file: filePath })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log('File deleted successfully');
                    } else {
                        console.error('Error deleting file:', data.error);
                    }
                })
                .then(loadFiles)
                .catch(error => console.error('Fetch error:', error));
        }
    }
});


// Function to convert bytes into relatable size units
function convertBytes(bytes = 0) {
    let units = ['B', 'KB', 'MB', 'GB', 'TB'];

    let factor = Math.floor(Math.log(bytes) / Math.log(1024));
    let size = (bytes / Math.pow(1024, factor)).toFixed(2);

    return `${size} ${units[factor]}`;
}

// Function to convert Unix time to readable value
function convertUnixToDateTime(unixTimestamp, format = "d-m-y h:i A") {
    if (!unixTimestamp || unixTimestamp === "") {
        date = new Date(); // Use current date if no date is provided
    } else if (typeof date !== 'object') {
        // Convert the Unix timestamp from seconds to milliseconds
        date = new Date(unixTimestamp * 1000);
    }

    let d = ("0" + date.getDate()).slice(-2); // day (from 01 to 31)
    let m = ("0" + (date.getMonth() + 1)).slice(-2); // month (from 01 to 12)
    let Y = date.getFullYear(); // Full Year (YYYY)
    let y = String(Y).slice(-2); // Short Year (YY)
    let H = ("0" + date.getHours()).slice(-2); // 24-hour (00 to 23)
    let h = H % 12;
    h = h ? ("0" + h).slice(-2) : '12'; // 24-hour (01 to 12)
    let i = ("0" + date.getMinutes()).slice(-2); // Minutes (00 to 59)
    let s = ("0" + date.getSeconds()).slice(-2); // Seconds (00 to 59)
    let ampm = H >= 12 ? 'PM' : 'AM'; // AM/PM

    // Replace format specifiers with actual values
    return format.replace(/Y/g, Y)
        .replace(/y/g, y)
        .replace(/m/g, m)
        .replace(/d/g, d)
        .replace(/H/g, H)
        .replace(/h/g, h)
        .replace(/i/g, i)
        .replace(/s/g, s)
        .replace(/A/g, ampm);
}

let wakeLock = null;

// Function to keep screen Awake
async function requestWakeLock() {
    try {
        wakeLock = await navigator.wakeLock.request('screen');
        console.log('Wake Lock active!');
    } catch (err) {
        console.error(`${err.name}, ${err.message}`);
    }
}

// Function to remove screen Awake
async function releaseWakeLock() {
    if (wakeLock !== null) {
        await wakeLock.release();
        wakeLock = null;
        console.log('Wake Lock released!');
    }
}

// Function to play Silent Audio
const audio = new Audio('./assets/silent-audio.mp3');

function playSilentAudio() {
    audio.loop = true; // Loop the audio
    audio.play().catch(error => {
        console.error('Error playing audio:', error);
    });
}