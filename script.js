// script.js
// --- KONFIGURASI GLOBAL ---
const MAX_LEVEL = 100;
const BASE_XP_NEXT_LEVEL = 100;
const XP_MULTIPLIER = 1.15; 

// --- DAFTAR SEMUA QUESTS (Sama) ---
const ALL_QUESTS_MASTER = [
    { id: 101, title: "Luncurkan Trailer Seri Baru", xp: 1000 },
    { id: 102, title: "Kolaborasi dengan Kreator Lain", xp: 1500 },
    { id: 103, title: "Buat Desain Thumbnail Standar Baru", xp: 750 },
    { id: 104, title: "Optimasi 10 Video Lama (SEO)", xp: 300 },
    { id: 105, title: "Capai 1.000 Jam Tontonan dalam 30 hari", xp: 2000 },
    { id: 106, title: "Buat 5 Video Pendek bertema sama", xp: 600 },
    { id: 107, title: "Riset 3 Niche Konten Baru", xp: 150 },
    { id: 108, title: "Desain Endscreen Custom", xp: 400 },
    { id: 109, title: "Jawab 50 Komentar di YouTube", xp: 100 },
    { id: 110, title: "Upload Video pada Jam Prime Time (3x)", xp: 250 },
    { id: 111, title: "Siapkan 4 Judul Video Cadangan", xp: 120 },
    { id: 112, title: "Backup Semua File Proyek ke Drive", xp: 50 },
    { id: 113, title: "Coba Efek Editing Baru (2x)", xp: 350 },
    { id: 114, title: "Lakukan Stream 2 Jam Tanpa Gangguan", xp: 550 },
    { id: 115, title: "Buat Header Channel Baru", xp: 450 },
    { id: 116, title: "Pelajari Tutorial SEO Lanjutan (1 Jam)", xp: 200 },
    { id: 117, title: "Unggah Teaser Project Besar", xp: 700 },
    { id: 118, title: "Buat Template Deskripsi Video", xp: 80 },
    { id: 119, title: "Cek Analitik CTR 30 hari terakhir", xp: 110 },
    { id: 120, title: "Buat 10 Pin Pinterest untuk Promosi", xp: 280 },
    { id: 121, title: "Upgrade Perangkat Lunak Editing", xp: 90 },
    { id: 122, title: "Buat Musik Intro/Outro Original", xp: 1200 },
    { id: 123, title: "Buat 7 *Hook* Video yang Menarik", xp: 320 },
    { id: 124, title: "Buat Riset Kata Kunci Lanjutan", xp: 180 },
    { id: 125, title: "Rancang Pakaian/Merchandise Custom", xp: 900 },
    { id: 126, title: "Pelajari Teknik Color Grading Baru", xp: 420 },
    { id: 127, title: "Ubah Tampilan OBS/Streaming Overlay", xp: 380 },
    { id: 128, title: "Buat *Patreon Tier* Baru", xp: 650 },
    { id: 129, title: "Capai 100 Subscriber Baru dalam Seminggu", xp: 1800 },
    { id: 130, title: "Buat Jadwal Konten 1 Bulan Penuh", xp: 500 },
    { id: 131, title: "Desain Ikon Sosial Media Custom", xp: 130 },
    { id: 132, title: "Riset Trend Game Terbaru", xp: 70 },
    { id: 133, title: "Buat 5 Tagar Khusus Channel", xp: 50 },
    { id: 134, title: "Setup Fitur Keanggotaan YouTube", xp: 210 },
    { id: 135, title: "Jadikan Video Tertentu *Unlisted*", xp: 30 }
];

// --- FUNGSI UTILITY QUEST (Sama) ---
function getRandomQuests(count, currentQuests) {
    const currentIds = currentQuests.map(q => q.id);
    const availableQuests = ALL_QUESTS_MASTER.filter(q => !currentIds.includes(q.id));

    let pool = availableQuests.length > 0 ? availableQuests : ALL_QUESTS_MASTER.filter(q => !currentIds.includes(q.id));

    let questsToAdd = [];
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    for (let i = 0; i < count; i++) {
        if (pool[i]) {
            if (!questsToAdd.some(q => q.id === pool[i].id)) {
                questsToAdd.push({ ...pool[i], completed: false });
            }
        }
    }
    return questsToAdd;
}

// --- DEFAULT CONTENT TYPES BARU ---
const DEFAULT_CONTENT_TYPES = [
    { name: "Minecraft Hardcore", xp: 150, category: "Minecraft" },
    { name: "Shorts Video", xp: 30, category: "Pendek" },
    { name: "100 Hari Minecraft", xp: 250, category: "Minecraft" },
    { name: "Post Komunitas", xp: 10, category: "Komunitas" },
    { name: "Random Minecraft Video", xp: 100, category: "Minecraft" }
];

// --- STATE AWAL ---
let state = {
    level: 1,
    xp: 0,
    history: [], 
    contentTypes: DEFAULT_CONTENT_TYPES, // Menggunakan default baru
    bonusMissions: [] // Akan diinisialisasi di loadState
};

// ... (Kode showModal, showNotification, getXPForNextLevel, updateLevelProgress, deleteContent, setXPManually tetap sama) ...
const modalOverlay = document.getElementById('customModal');
const modalMessage = document.getElementById('modalMessage');
const modalActions = document.getElementById('modalActions');
const modalTitle = document.getElementById('modalTitle');

function showModal(message, title = 'Notifikasi', buttons) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalActions.innerHTML = '';

    buttons.forEach(btnConfig => {
        const button = document.createElement('button');
        button.className = `modal-btn ${btnConfig.className}`;
        button.style.fontSize = '0'; 
        
        button.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
            if (btnConfig.action) {
                btnConfig.action();
            }
        });
        modalActions.appendChild(button);
    });

    modalOverlay.classList.add('active');
}

function showNotification(message, title = 'Notifikasi') {
    showModal(message, title, [{ 
        text: 'YA', 
        className: 'ya-btn', 
        action: () => {} 
    }]);
}

function getXPForNextLevel(level) {
    if (level >= MAX_LEVEL) return Infinity;
    return Math.floor(BASE_XP_NEXT_LEVEL * Math.pow(XP_MULTIPLIER, level - 1));
}

function updateLevelProgress() {
    let leveledUp = false;
    let leveledDown = false;
    
    let xpToNextLevel = getXPForNextLevel(state.level);
    while (state.xp >= xpToNextLevel && state.level < MAX_LEVEL) {
        state.xp -= xpToNextLevel; 
        state.level += 1;
        xpToNextLevel = getXPForNextLevel(state.level);
        leveledUp = true;
    }
    
    while (state.level > 1) {
        const xpRequiredForCurrentLevel = getXPForNextLevel(state.level - 1);
        
        if (state.xp < 0) {
            state.level -= 1; 
            state.xp += xpRequiredForCurrentLevel; 
            leveledDown = true;
        } else {
            break; 
        }
    }
    
    state.xp = Math.max(0, state.xp); 
    
    if (leveledUp) showNotification(`Selamat! Anda naik ke Level ${state.level}!`, 'LEVEL UP!');
    if (leveledDown) showNotification(`Perhatian: Anda turun ke Level ${state.level} karena XP berkurang.`, 'PERINGATAN');
    
    const currentLevelEl = document.getElementById('currentLevel');
    const currentXPEl = document.getElementById('currentXP');
    const xpToNextLevelEl = document.getElementById('xpToNextLevel');
    const levelBarEl = document.getElementById('levelBar');

    const nextXP = getXPForNextLevel(state.level);
    const progressPercent = (state.xp / nextXP) * 100;

    currentLevelEl.textContent = state.level;
    currentXPEl.textContent = state.xp;
    xpToNextLevelEl.textContent = nextXP === Infinity ? 'MAX' : nextXP;
    levelBarEl.style.width = `${Math.min(100, progressPercent)}%`;
    levelBarEl.textContent = `${Math.round(progressPercent)}%`;
}

function deleteContent(index) {
    const itemToDelete = state.history[index];

    if (itemToDelete) {
        showModal(
            `Yakin ingin menghapus konten ini? XP (${itemToDelete.xp}) akan dikurangi dan level Anda mungkin turun.`,
            'Hapus Konten',
            [
                { 
                    text: 'YA', 
                    className: 'ya-btn', 
                    action: () => {
                        state.xp -= itemToDelete.xp; 
                        state.history.splice(index, 1);
                        saveState();
                        showNotification(`Konten "${itemToDelete.title || itemToDelete.type}" berhasil dihapus. XP berkurang sebanyak ${itemToDelete.xp}.`);
                    }
                },
                { 
                    text: 'TIDAK', 
                    className: 'tidak-btn', 
                    action: () => {} 
                }
            ]
        );
    } else {
        showNotification('Konten tidak ditemukan atau indeks tidak valid.');
    }
}

function setXPManually() {
    const inputEl = document.getElementById('manualXPInput');
    const newTotalXP = parseInt(inputEl.value);

    if (isNaN(newTotalXP) || newTotalXP < 0) {
        showNotification("Masukkan nilai XP total yang valid (angka positif).");
        inputEl.placeholder = 'Set total XP Points';
        return;
    }
    
    state.level = 1; 
    state.xp = newTotalXP;

    updateLevelProgress(); 
    
    saveState();
    showNotification(`XP berhasil diatur menjadi ${newTotalXP}. Level dan progres dihitung ulang.`);
    inputEl.value = '';
}
// ----------------------------------------------------------------------


// --- FUNGSI BARU: Hapus Jenis Konten ---
function deleteContentType(index) {
    const typeToDelete = state.contentTypes[index];

    // Cek apakah jenis konten yang akan dihapus adalah jenis konten default (yang tidak boleh dihapus)
    const isDefault = DEFAULT_CONTENT_TYPES.some(d => d.name === typeToDelete.name);
    
    if (isDefault) {
        showNotification(`Jenis konten "${typeToDelete.name}" adalah jenis konten default dan tidak dapat dihapus.`, 'Gagal Hapus');
        return;
    }

    showModal(
        `Yakin ingin menghapus jenis konten kustom "${typeToDelete.name}"? Ini tidak akan mempengaruhi Content Log yang sudah ada.`,
        'Hapus Jenis Konten',
        [
            { 
                text: 'YA', 
                className: 'ya-btn', 
                action: () => {
                    state.contentTypes.splice(index, 1);
                    saveState();
                    showNotification(`Jenis konten "${typeToDelete.name}" berhasil dihapus.`, 'Berhasil');
                }
            },
            { 
                text: 'TIDAK', 
                className: 'tidak-btn', 
                action: () => {} 
            }
        ]
    );
}


// --- FUNGSI UI RENDERING ---

function renderContentTypes() {
    const selectEl = document.getElementById('contentType');
    selectEl.innerHTML = ''; 
    state.contentTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type.name;
        option.textContent = `${type.name} (+${type.xp} XP)`;
        selectEl.appendChild(option);
    });
}

function renderActiveTypesList() {
    const activeListEl = document.getElementById('activeTypesList');
    activeListEl.innerHTML = ''; 
    
    state.contentTypes.forEach((type, index) => {
        const li = document.createElement('li');
        
        // Tentukan apakah jenis konten ini adalah default
        const isDefault = DEFAULT_CONTENT_TYPES.some(d => d.name === type.name);
        
        // Tambahkan tombol hapus hanya jika BUKAN default
        let deleteBtnHtml = '';
        if (!isDefault) {
            deleteBtnHtml = `<button class="delete-type-btn" data-index="${index}">Hapus</button>`;
        } else {
            // Beri label Default untuk konten bawaan
            deleteBtnHtml = `<span style="color: #FF9900; font-style: italic;">(Default)</span>`;
        }
        
        li.innerHTML = `
            <span>${type.name} (<span class="xp-badge">+${type.xp} XP</span>)</span>
            ${deleteBtnHtml}
        `;
        activeListEl.appendChild(li);
    });
}

function renderHistory() {
    const historyListEl = document.getElementById('historyList');
    historyListEl.innerHTML = '';
    
    state.history.forEach((item, index) => { 
        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <strong>${item.type}</strong> 
                <span class="xp-badge">+${item.xp} XP</span>
                <p style="font-size: 0.9em; margin: 5px 0 0;">${item.title || '(Tanpa Judul)'} - ${item.date}</p>
            </div>
            <button class="delete-btn" data-index="${index}" title="Hapus Konten Ini"></button>
        `;
        historyListEl.prepend(li); 
    });
}

function renderBonusMissions() {
    const bonusListEl = document.getElementById('bonusMissions');
    bonusListEl.innerHTML = '';
    
    state.bonusMissions.forEach(mission => {
        const li = document.createElement('li');
        li.className = mission.completed ? 'completed' : '';
        li.innerHTML = `
            <input type="checkbox" data-id="${mission.id}" ${mission.completed ? 'checked' : ''}>
            <span>${mission.title}</span>
            <span class="xp-badge">+${mission.xp} XP</span>
        `;
        bonusListEl.appendChild(li);
    });
}

function renderUI() {
    updateLevelProgress();
    renderContentTypes();
    renderActiveTypesList();
    renderHistory();
    renderBonusMissions();
}


// --- SAVE/LOAD PROGRESS ---

function saveState() {
    localStorage.setItem('creatorTrackerState', JSON.stringify(state));
    renderUI();
}

function loadState() {
    const savedState = localStorage.getItem('creatorTrackerState');
    if (savedState) {
        const importedState = JSON.parse(savedState);
        
        // Cek dan ganti contentTypes lama dengan default baru jika data lama tidak ada
        if (!importedState.contentTypes || importedState.contentTypes.length === 0) {
            importedState.contentTypes = DEFAULT_CONTENT_TYPES;
        } else {
            // Memastikan jenis default yang baru ditambahkan ada jika save lama dimuat
            const savedTypeNames = importedState.contentTypes.map(t => t.name);
            DEFAULT_CONTENT_TYPES.forEach(defaultType => {
                if (!savedTypeNames.includes(defaultType.name)) {
                    importedState.contentTypes.unshift(defaultType);
                }
            });
        }
        
        if (!importedState.bonusMissions || importedState.bonusMissions.length === 0) {
            importedState.bonusMissions = getRandomQuests(3, []);
        }

        state = importedState;
    } else {
        // Jika tidak ada save, pastikan 3 quest awal dibuat
        state.contentTypes = DEFAULT_CONTENT_TYPES;
        state.bonusMissions = getRandomQuests(3, []);
    }
    renderUI();
}


// --- EVENT HANDLERS ---

document.getElementById('contentForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const contentType = document.getElementById('contentType').value;
    const contentTitle = document.getElementById('contentTitle').value.trim();

    const selectedType = state.contentTypes.find(t => t.name === contentType);

    if (selectedType) {
        state.xp += selectedType.xp;
        state.history.push({
            type: selectedType.name,
            title: contentTitle,
            xp: selectedType.xp,
            date: new Date().toLocaleDateString('id-ID')
        });

        saveState();
        document.getElementById('contentTitle').value = ''; 
    }
});


document.getElementById('bonusMissions').addEventListener('change', function(e) {
    if (e.target.type === 'checkbox') {
        const missionId = parseInt(e.target.dataset.id);
        const missionIndex = state.bonusMissions.findIndex(m => m.id === missionId);
        const mission = state.bonusMissions[missionIndex];

        if (!mission) return;

        if (e.target.checked) {
            // Check (Selesai)
            mission.completed = true;
            state.xp += mission.xp; 
            
            state.bonusMissions.splice(missionIndex, 1);
            const newQuest = getRandomQuests(1, state.bonusMissions);
            state.bonusMissions.push(...newQuest);
            
            showNotification(`Quest Selesai! Anda mendapatkan ${mission.xp} XP. Quest baru telah ditambahkan.`, 'QUEST COMPLETE');

        } else {
            // Uncheck (Membatalkan)
             showModal(
                `Yakin ingin membatalkan Quest? XP (${mission.xp}) akan dikurangi dari total XP Anda.`,
                'Batalkan Quest',
                [
                    { 
                        text: 'YA', 
                        className: 'ya-btn', 
                        action: () => {
                            mission.completed = false;
                            state.xp -= mission.xp; 
                            
                            state.bonusMissions.splice(missionIndex, 1);
                            const newQuest = getRandomQuests(1, state.bonusMissions);
                            state.bonusMissions.push(...newQuest);
                            
                            saveState();
                            showNotification(`Quest dibatalkan. ${mission.xp} XP telah dikurangi. Quest baru ditambahkan.`, 'QUEST DIBATALKAN');
                        }
                    },
                    { 
                        text: 'TIDAK', 
                        className: 'tidak-btn', 
                        action: () => {
                            e.target.checked = true;
                            renderBonusMissions();
                        }
                    }
                ]
            );
             return;
        }
        
        saveState();
    }
});

document.getElementById('customTypeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('customTypeName').value.trim();
    const xp = parseInt(document.getElementById('customTypeXP').value);
    
    if (name && xp > 0 && !isNaN(xp)) {
        if (state.contentTypes.find(t => t.name.toLowerCase() === name.toLowerCase())) {
            showNotification('Jenis konten ini sudah ada.', 'Gagal Menambah');
            return;
        }

        state.contentTypes.push({
            name: name,
            xp: xp,
            category: 'Custom'
        });
        
        showNotification(`Jenis konten "${name}" dengan +${xp} XP berhasil ditambahkan.`, 'Konten Kustom Baru');
        saveState();
        
        document.getElementById('customTypeName').value = '';
        document.getElementById('customTypeXP').value = '';
    } else {
        showNotification('Nama harus diisi dan XP harus berupa angka positif.', 'Input Invalid');
    }
});

// Event Handler untuk Hapus Jenis Konten Kustom
document.getElementById('activeTypesList').addEventListener('click', function(e) {
    const deleteBtn = e.target.closest('.delete-type-btn');
    if (deleteBtn) {
        const index = parseInt(deleteBtn.dataset.index);
        deleteContentType(index); 
    }
});

document.getElementById('historyList').addEventListener('click', function(e) {
    const deleteBtn = e.target.closest('.delete-btn');
    if (deleteBtn) {
        const index = parseInt(deleteBtn.dataset.index);
        deleteContent(index); 
    }
});

document.getElementById('setXPButton').addEventListener('click', setXPManually);

document.getElementById('exportData').addEventListener('click', () => {
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `CreatorTracker_Data_Lvl${state.level}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('Data berhasil diekspor. File JSON telah diunduh.', 'Ekspor Selesai');
});

document.getElementById('importData').addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = e => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                try {
                    const importedState = JSON.parse(event.target.result);
                    if (importedState.level !== undefined && importedState.xp !== undefined) {
                        
                        showModal(
                            'Yakin ingin menimpa data saat ini dengan file yang diimpor?',
                            'Konfirmasi Impor',
                            [
                                {
                                    text: 'YA',
                                    className: 'ya-btn',
                                    action: () => {
                                        state = importedState;
                                        saveState();
                                        showNotification('Data berhasil diimpor! Halaman diperbarui.', 'Impor Berhasil');
                                    }
                                },
                                {
                                    text: 'BATAL',
                                    className: 'batal-btn',
                                    action: () => {}
                                }
                            ]
                        );

                    } else {
                        showNotification('File data tidak valid. Pastikan format JSON benar.', 'Impor Gagal');
                    }
                } catch (error) {
                    showNotification('Gagal memproses file. Pastikan format JSON benar.', 'Impor Gagal');
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
});


// --- Inisialisasi ---
document.addEventListener('DOMContentLoaded', () => {
    loadState();
});
