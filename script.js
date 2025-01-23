function applyFilters() {
    const form = document.getElementById('filter-form');
    const formData = new FormData(form);
    const filters = {
        character: formData.get('character'),
        rarity: formData.getAll('rarity'),
        obtain: formData.get('obtain'),
        trend: formData.getAll('trend'),
        type: formData.getAll('type'),
        skill: formData.getAll('skill'),
        support: formData.get('support'),
        sort: formData.get('sort'),
        keyword: formData.get('keyword'),
        possession: formData.get('possession')
    };
    const sortOrder = formData.get('sort-order') || 'asc';

    const rows = Array.from(document.querySelectorAll('#character-table tr:not(:first-child)'));
    rows.forEach(row => {
        const cells = row.getElementsByTagName('td');
        const character = {
            character: cells[1].innerText,
            rarity: cells[3].innerText,
            obtain: cells[19].innerText,
            trend: cells[4].innerText,
            type: cells[5].innerText,
            skill: cells[6].innerText,
            support: cells[18].innerText,
            vocal: parseInt(cells[8].innerText),
            dance: parseInt(cells[9].innerText),
            visual: parseInt(cells[10].innerText),
            stamina: parseInt(cells[11].innerText),
            card_name: cells[2].innerText,
            costume: cells[7].innerText,
            live_skill1_name: cells[12].innerText,
            live_skill1_effect: cells[13].innerText,
            live_skill2_name: cells[14].innerText,
            live_skill2_effect: cells[15].innerText,
            live_skill3_name: cells[16].innerText,
            live_skill3_effect: cells[17].innerText
        };

        let show = true;
        if (filters.character && filters.character !== character.character) show = false;
        if (filters.rarity.length && !filters.rarity.includes(character.rarity)) show = false;
        if (filters.obtain && filters.obtain !== character.obtain) show = false;
        if (filters.trend.length && !filters.trend.includes(character.trend)) show = false;
        if (filters.type.length && !filters.type.includes(character.type)) show = false;
        if (filters.skill.length) {
            if (filters.skill.includes('SP所持') && !character.skill.includes('SP')) show = false;
            if (filters.skill.includes('SP未所持') && character.skill.includes('SP')) show = false;
            if (filters.skill.includes('AA') && !character.skill.includes('AA')) show = false;
        }
        if (filters.support && filters.support !== character.support) show = false;
        if (filters.keyword) {
            const keyword = filters.keyword.toLowerCase();
            if (!(
                character.card_name.toLowerCase().includes(keyword) ||
                character.costume.toLowerCase().includes(keyword) ||
                character.live_skill1_name.toLowerCase().includes(keyword) ||
                character.live_skill1_effect.toLowerCase().includes(keyword) ||
                character.live_skill2_name.toLowerCase().includes(keyword) ||
                character.live_skill2_effect.toLowerCase().includes(keyword) ||
                character.live_skill3_name.toLowerCase().includes(keyword) ||
                character.live_skill3_effect.toLowerCase().includes(keyword)
            )) {
                show = false;
            }
        }
        if (filters.possession === '所持' && !possessedCards.has(character.card_name)) show = false;

        row.style.display = show ? '' : 'none';
        if (show) {
            if (character.trend === 'ボーカル') {
                cells[4].style.color = '#FF469D';
            } else if (character.trend === 'ダンス') {
                cells[4].style.color = '#3ABAFF';
            } else if (character.trend === 'ビジュアル') {
                cells[4].style.color = '#FFA900';
            }
        }
    });

    if (filters.sort) {
        rows.sort((a, b) => {
            const aCells = a.getElementsByTagName('td');
            const bCells = b.getElementsByTagName('td');
            let comparison = 0;
            if (filters.sort === 'id') {
                const aId = parseInt(aCells[0].innerText);
                const bId = parseInt(bCells[0].innerText);
                comparison = aId - bId;
            } else {
                const aValue = parseInt(aCells[filters.sort === 'ボーカル' ? 8 : filters.sort === 'ダンス' ? 9 : filters.sort === 'ビジュアル' ? 10 : 11].innerText);
                const bValue = parseInt(bCells[filters.sort === 'ボーカル' ? 8 : filters.sort === 'ダンス' ? 9 : filters.sort === 'ビジュアル' ? 10 : 11].innerText);
                comparison = aValue - bValue;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

        const table = document.getElementById('character-table');
        rows.forEach(row => table.appendChild(row));
    }
}

function resetFilters() {
    const form = document.getElementById('filter-form');
    form.reset();
    const rows = Array.from(document.querySelectorAll('#character-table tr:not(:first-child)'));
    rows.forEach(row => {
        row.style.display = '';
    });

    rows.sort((a, b) => {
        const aId = parseInt(a.getElementsByTagName('td')[0].innerText);
        const bId = parseInt(b.getElementsByTagName('td')[0].innerText);
        return aId - bId;
    });

    const table = document.getElementById('character-table');
    rows.forEach(row => table.appendChild(row));
}

window.onscroll = function() {
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
};

document.getElementById('scrollToTopBtn').addEventListener('click', function() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
});

let possessionMode = false;
let possessedCards = new Set();
let initialPossessedCards = new Set();

function togglePossessionMode() {
    possessionMode = !possessionMode;
    const rows = document.querySelectorAll('#character-table tr:not(:first-child)');
    if (possessionMode) {
        initialPossessedCards = new Set(possessedCards);
    }
    rows.forEach(row => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('checkbox');
        checkbox.checked = possessedCards.has(row.cells[2].innerText);
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                possessedCards.add(row.cells[2].innerText);
            } else {
                possessedCards.delete(row.cells[2].innerText);
            }
        });
        if (possessionMode) {
            row.cells[2].prepend(checkbox);
        } else {
            row.cells[2].querySelector('.checkbox').remove();
        }
    });
    document.querySelector('.possession-buttons').style.display = possessionMode ? 'flex' : 'none';
}

function savePossession() {
    localStorage.setItem('possessedCards', JSON.stringify(Array.from(possessedCards)));
    togglePossessionMode();
}

function selectAllPossession() {
    const rows = document.querySelectorAll('#character-table tr:not(:first-child)');
    rows.forEach(row => {
        const checkbox = row.cells[2].querySelector('.checkbox');
        checkbox.checked = true;
        possessedCards.add(row.cells[2].innerText);
    });
}

function deselectAllPossession() {
    const rows = document.querySelectorAll('#character-table tr:not(:first-child)');
    rows.forEach(row => {
        const checkbox = row.cells[2].querySelector('.checkbox');
        checkbox.checked = false;
        possessedCards.delete(row.cells[2].innerText);
    });
}

function exportPossession() {
    const exportPopup = document.querySelector('.export-popup');
    const textarea = exportPopup.querySelector('textarea');
    const ids = Array.from(possessedCards).map(cardName => {
        const row = Array.from(document.querySelectorAll('#character-table tr')).find(row => row.cells[2].innerText === cardName);
        return row ? row.cells[0].innerText : '';
    }).filter(id => id !== '');
    textarea.value = ids.join('\n');
    exportPopup.style.display = 'block';
}

function copyToClipboard() {
    const textarea = document.querySelector('.export-popup textarea');
    textarea.select();
    document.execCommand('copy');
}

function importPossession() {
    const importPopup = document.querySelector('.import-popup');
    importPopup.style.display = 'block';
}

function saveImportedPossession() {
    const textarea = document.querySelector('.import-popup textarea');
    const importedIds = textarea.value.split('\n').filter(id => id.trim() !== '');
    possessedCards.clear();
    importedIds.forEach(id => {
        const row = Array.from(document.querySelectorAll('#character-table tr')).find(row => row.cells[0].innerText === id);
        if (row) {
            possessedCards.add(row.cells[2].innerText);
        }
    });
    localStorage.setItem('possessedCards', JSON.stringify(Array.from(possessedCards)));
    document.querySelector('.import-popup').style.display = 'none';
    togglePossessionMode();
    togglePossessionMode();
}

function exitWithoutSaving() {
    possessedCards = new Set(initialPossessedCards);
    const rows = document.querySelectorAll('#character-table tr:not(:first-child)');
    rows.forEach(row => {
        const checkbox = row.cells[2].querySelector('.checkbox');
        if (checkbox) {
            checkbox.remove();
        }
    });
    document.querySelector('.possession-buttons').style.display = 'none';
    possessionMode = false;
}

document.addEventListener('DOMContentLoaded', function() {
    const menu = document.querySelector('.menu');
    const menuContent = document.querySelector('.menu-content');
    const popup = document.querySelector('.popup');
    const popupHeader = document.querySelector('.popup-header');
    const popupContent = document.querySelector('.popup-content');
    const popupClose = document.querySelector('.popup-close');

    menu.addEventListener('click', function() {
        menuContent.style.display = menuContent.style.display === 'block' ? 'none' : 'block';
    });

    window.addEventListener('click', function(event) {
        if (!menu.contains(event.target)) {
            menuContent.style.display = 'none';
        }
    });

    document.querySelectorAll('.menu-content a').forEach(item => {
        item.addEventListener('click', function() {
            const menuName = this.innerText;
            popupHeader.innerText = menuName;
            if (menuName === 'エクスポート' || menuName === 'インポート') {
                menuContent.style.display = 'none';
            } else if (menuName === 'つかいかた') {
                popupContent.innerText = 'アイプラのゲーム内で実装されている\nアイドルの詳細を確認できます。\n\nフィルタ・並び替え・検索機能や\n所持アイドルチェック機能もご活用ください。';
                popup.style.display = 'block';
            } else if (menuName === 'このツールについて') {
                popupContent.innerHTML = 'このツールはmikiが開発しています。<br>改善要望・不具合報告は<br><a href="https://x.com/miki_aipr">twitter(@miki_aipr)</a>までお願いします。';
                popup.style.display = 'block';
            } else if (menuName === '更新情報') {
                popupContent.innerHTML = '2025/1/18更新<br><br>ゲームリリース時点の登場アイドルを追加しました。';
                popup.style.display = 'block';
            } else if (menuName === '所持アイドルチェックについて') {
                popupContent.innerText = '所持アイドルチェックでは、保存、エクスポートを忘れずにしましょう。';
                popup.style.display = 'block';
            }
        });
    });

    popupClose.addEventListener('click', function() {
        popup.style.display = 'none';
    });

    possessedCards = new Set(JSON.parse(localStorage.getItem('possessedCards') || '[]'));

    document.getElementById('possession-info').addEventListener('click', function() {
        const popupHeader = document.querySelector('.popup-header');
        const popupContent = document.querySelector('.popup-content');
        popupHeader.innerText = '所持アイドルチェックについて';
        popupContent.innerHTML = '<p style="text-align:left">○所持アイドルチェック<br><br>所持アイドルをチェックできます。<br>所持アイドル情報はフィルタに使用できます。<br><br>○エクスポート<br><br>所持アイドル情報はブラウザー上に保存されているため、別の環境には引き継がれません。<br>別の環境に所持アイドル情報を移すには、テキストをコピーして移行先の環境でインポートしてください。<br><br>○インポート<br><br>エクスポートしたテキストをペーストして、インポートボタンを押してください。<br>所持アイドル情報が引き継がれます。</p>';
        document.querySelector('.popup').style.display = 'block';
    });

    document.getElementById('news').addEventListener('click', function() {
        const popupHeader = document.querySelector('.popup-header');
        const popupContent = document.querySelector('.popup-content');
        popupHeader.innerText = '更新情報';
        popupContent.innerHTML = '2025/1/18更新<br><br>ゲームリリース時点の登場アイドルを追加しました。';
        document.querySelector('.popup').style.display = 'block';
    });

    document.getElementById('possession-check').addEventListener('click', togglePossessionMode);
    document.getElementById('possession-export').addEventListener('click', exportPossession);
    document.getElementById('possession-import').addEventListener('click', importPossession);

    document.querySelector('.export-popup button.copy').addEventListener('click', copyToClipboard);
    document.querySelector('.export-popup button.close').addEventListener('click', function() {
        document.querySelector('.export-popup').style.display = 'none';
    });

    document.querySelector('.import-popup button.save').addEventListener('click', saveImportedPossession);
    document.querySelector('.import-popup button.close').addEventListener('click', function() {
        document.querySelector('.import-popup').style.display = 'none';
    });

    document.querySelector('.possession-buttons .deselect-all').addEventListener('click', deselectAllPossession);
    document.querySelector('.possession-buttons .exit-without-saving').addEventListener('click', exitWithoutSaving);

    const hintIcons = document.querySelectorAll('.hint-icon');
    const hintPopups = document.querySelectorAll('.hint-popup');

    hintIcons.forEach((hintIcon, index) => {
        const hintPopup = hintPopups[index];
        hintIcon.addEventListener('click', function() {
            hintPopup.style.display = hintPopup.style.display === 'block' ? 'none' : 'block';
        });
    });

    window.addEventListener('click', function(event) {
        hintIcons.forEach((hintIcon, index) => {
            const hintPopup = hintPopups[index];
            if (!hintIcon.contains(event.target) && !hintPopup.contains(event.target)) {
                hintPopup.style.display = 'none';
            }
        });
    });

    const settingsPopup = document.querySelector('.settings-popup');
    const settingsButton = document.querySelector('#settings');
    const settingsCloseButton = settingsPopup.querySelector('.close');
    const imageDisplayCheckbox = settingsPopup.querySelector('input[name="image-display"]');

    settingsButton.addEventListener('click', function() {
        settingsPopup.style.display = 'block';
    });

    settingsCloseButton.addEventListener('click', function() {
        settingsPopup.style.display = 'none';
    });

    imageDisplayCheckbox.addEventListener('change', function() {
        localStorage.setItem('imageDisplay', this.checked);
        applyImageDisplaySetting();
    });

    function applyImageDisplaySetting() {
        const displayImages = JSON.parse(localStorage.getItem('imageDisplay') || 'true');
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.style.display = displayImages ? '' : 'none';
        });
    }

    applyImageDisplaySetting();
    imageDisplayCheckbox.checked = JSON.parse(localStorage.getItem('imageDisplay') || 'true');
});
