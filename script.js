const update_info = '<div class="news-content"><b>2025/2/16更新</b><br><br>・2023年3月までのアイドルを追加<br>・ステータスの項目にパワーを追加<br>・検索バーを追加<br><br><hr><b>2025/2/7更新</b><br><br>・2022年4月までのアイドルを追加<br>・ステータスランキングページを追加<br><br><hr><b>2025/2/5更新</b><br><br>・2021年12月までのアイドルを追加<br>・バナータップ時にページ上部に移動<br><br><hr><b>2025/1/25更新</b><br><br>・スマホでの表示簡略化<br>・ポップアップにオーバーレイ追加<br>・設定に所持キャラチェックのボタン配置切り替えを追加<br><br><hr><b>2025/1/23更新</b><br><br>・実装順、降順昇順での並び替えの追加<br>・所持キャラチェックモードのボタン追加<br>・詳細ページの戻るボタン追加<br>・全体的なデザインの改善<br><br><hr><b>2025/1/18更新</b><br><br>・リリース時までの登場アイドルの追加</div>';

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
        possession: formData.get('possession')
    };
    const sortOrder = formData.get('sort-order') || 'asc';
    const keyword = document.getElementById('search-bar').value.toLowerCase();

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
        if (filters.possession === '所持' && !possessedCards.has(character.card_name)) show = false;
        if (keyword && !(
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

        row.style.display = show ? '' : 'none';
        if (show) {
            if (character.trend === 'ボーカル') {
                cells[4].style.color = '#FF469D';
                cells[4].classList.add('trend-vocal');
            } else if (character.trend === 'ダンス') {
                cells[4].style.color = '#3ABAFF';
                cells[4].classList.add('trend-dance');
            } else if (character.trend === 'ビジュアル') {
                cells[4].style.color = '#FFA900';
                cells[4].classList.add('trend-visual');
            }

            if (character.type === 'スコアラー') {
                cells[5].classList.add('type-scorer');
            } else if (character.type === 'バッファー') {
                cells[5].classList.add('type-buffer');
            } else if (character.type === 'サポーター') {
                cells[5].classList.add('type-supporter');
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
    document.getElementById('search-bar').value = '';
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
        if (window.innerWidth > 768) {
            scrollToTopBtn.style.display = "block";
        }
    } else {
        scrollToTopBtn.style.display = "none";
    }
};

document.getElementById('scrollToTopBtn').addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
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
    const exportPopupOverlay = document.querySelector('.export-popup-overlay');
    const textarea = exportPopup.querySelector('textarea');
    const ids = Array.from(possessedCards).map(cardName => {
        const row = Array.from(document.querySelectorAll('#character-table tr')).find(row => row.cells[2].innerText === cardName);
        return row ? row.cells[0].innerText : '';
    }).filter(id => id !== '');
    textarea.value = ids.join('\n');
    exportPopup.style.display = 'block';
    exportPopupOverlay.style.display = 'block';
}

function closeExportPopup() {
    const exportPopup = document.querySelector('.export-popup');
    const exportPopupOverlay = document.querySelector('.export-popup-overlay');
    exportPopup.style.display = 'none';
    exportPopupOverlay.style.display = 'none';
}

function copyToClipboard() {
    const textarea = document.querySelector('.export-popup textarea');
    textarea.select();
    document.execCommand('copy');
}

function importPossession() {
    const importPopup = document.querySelector('.import-popup');
    const importPopupOverlay = document.querySelector('.import-popup-overlay');
    importPopup.style.display = 'block';
    importPopupOverlay.style.display = 'block';
}

function closeImportPopup() {
    const importPopup = document.querySelector('.import-popup');
    const importPopupOverlay = document.querySelector('.import-popup-overlay');
    importPopup.style.display = 'none';
    importPopupOverlay.style.display = 'none';
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
    document.querySelector('.import-popup-overlay').style.display = 'none'; // 追加
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
    menu.tagName = 'button'; // Change the tag to button
    menu.style.position = 'absolute';
    menu.style.right = '60px'; // Adjusted from 30px to 50px
    menu.style.top = '50%';
    menu.style.transform = 'translateY(-50%)';
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
                popupContent.innerHTML = 'アイプラのゲーム内で実装されている<br>アイドルの詳細を確認できます。<br><br>フィルタ・並び替え・検索機能や<br>所持アイドルチェック機能もご活用ください。<br><br><hr><div class="news-content"><b>ステータスランキング</b><br><br>アイドルのステータス、パワーを<br>ランキング形式で確認できます。<br><br><hr><b>所持アイドルチェック</b><br><br>所持アイドルをチェックできます。<br>所持アイドル情報はフィルタに使用できます。<br><br><b>エクスポート</b><br><br>所持アイドル情報はブラウザー上に保存されており、<br>別の環境には引き継がれません。<br>別の環境に所持アイドル情報を移すとき<br>テキストをコピーしてください。<br><br><b>インポート</b><br><br>エクスポートしたテキストを貼り付けて<br>インポートボタンを押してください。<br>所持アイドル情報が引き継がれます。</p><hr></div>';
                popup.style.display = 'block';
                popupOverlay.style.display = 'block';
            } else if (menuName === 'このツールについて') {
                popupContent.innerHTML = 'このツールはmikiが開発しています。<br>改善要望・不具合報告は<br><a href="https://x.com/miki_aipr">twitter(@miki_aipr)</a>までお願いします。';
                popup.style.display = 'block';
                popupOverlay.style.display = 'block';
            } else if (menuName === '更新情報') {
                popupContent.innerHTML = update_info;
                popup.style.display = 'block';
                popupOverlay.style.display = 'block';
            } else if (menuName === '所持アイドルチェックについて') {
                popupContent.innerHTML = '';
                popup.style.display = 'block';
                popupOverlay.style.display = 'block';
            }
        });
    });

    const popupOverlay = document.createElement('div');
    popupOverlay.classList.add('popup-overlay');
    document.body.appendChild(popupOverlay);

    function closePopup() {
        popup.style.display = 'none';
        popupOverlay.style.display = 'none';
    }

    popupClose.addEventListener('click', closePopup);
    popupOverlay.addEventListener('click', closePopup);

    possessedCards = new Set(JSON.parse(localStorage.getItem('possessedCards') || '[]'));

    document.getElementById('possession-check').addEventListener('click', togglePossessionMode);
    document.getElementById('possession-export').addEventListener('click', exportPossession);
    document.getElementById('possession-import').addEventListener('click', importPossession);

    document.querySelector('.export-popup button.copy').addEventListener('click', copyToClipboard);
    document.querySelector('.export-popup button.close').addEventListener('click', closeExportPopup);
    document.querySelector('.export-popup-overlay').addEventListener('click', closeExportPopup);

    document.querySelector('.import-popup button.save').addEventListener('click', saveImportedPossession);
    document.querySelector('.import-popup button.close').addEventListener('click', closeImportPopup);
    document.querySelector('.import-popup-overlay').addEventListener('click', closeImportPopup);

    document.querySelector('.possession-buttons .deselect-all').addEventListener('click', deselectAllPossession);
    document.querySelector('.possession-buttons .exit-without-saving').addEventListener('click', exitWithoutSaving);

    const hintIcons = document.querySelectorAll('.hint-icon');
    const hintPopups = document.querySelectorAll('.hint-popup');

    hintIcons.forEach((hintIcon, index) => {
        const hintPopup = hintPopups[index];
        hintIcon.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent event from bubbling up
            hintPopup.style.display = hintPopup.style.display === 'block' ? 'none' : 'block';
        });
    });

    window.addEventListener('click', function(event) {
        hintPopups.forEach(hintPopup => {
            if (!hintPopup.contains(event.target)) {
                hintPopup.style.display = 'none';
            }
        });
    });

    const settingsPopup = document.querySelector('.settings-popup');
    const settingsButton = document.querySelector('#settings');
    const settingsCloseButton = settingsPopup.querySelector('.close');
    const imageDisplayCheckbox = settingsPopup.querySelector('input[name="image-display"]');
    const buttonLayoutCheckbox = settingsPopup.querySelector('input[name="button-layout"]');

    settingsButton.addEventListener('click', openSettingsPopup);
    settingsCloseButton.addEventListener('click', closeSettingsPopup);

    imageDisplayCheckbox.addEventListener('change', function() {
        localStorage.setItem('imageDisplay', this.checked);
        applyImageDisplaySetting();
    });

    buttonLayoutCheckbox.addEventListener('change', function() {
        localStorage.setItem('buttonLayout', this.checked);
        applyButtonLayoutSetting();
    });

    function applyImageDisplaySetting() {
        const displayImages = JSON.parse(localStorage.getItem('imageDisplay') || 'true');
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.style.display = displayImages ? '' : 'none';
        });
    }

    function applyButtonLayoutSetting() {
        const horizontalLayout = JSON.parse(localStorage.getItem('buttonLayout') || 'false');
        const possessionButtons = document.querySelector('.possession-buttons');
        if (horizontalLayout) {
            possessionButtons.style.flexDirection = 'row';
        } else {
            possessionButtons.style.flexDirection = 'column';
        }
    }

    applyImageDisplaySetting();
    imageDisplayCheckbox.checked = JSON.parse(localStorage.getItem('imageDisplay') || 'true');

    applyButtonLayoutSetting();
    buttonLayoutCheckbox.checked = JSON.parse(localStorage.getItem('buttonLayout') || 'false');

    function updateColumnNamesForMobile() {
        const isMobile = window.innerWidth <= 768;
        const tableHeaders = document.querySelectorAll('#character-table th');
        tableHeaders.forEach(header => {
            if (header.innerText.includes('ボーカル') || header.innerText.includes('Vo.')) {
                header.innerHTML = isMobile ? '<font color="#FF469D">Vo.</font>' : '<font color="#FF469D">ボーカル</font>';
            } else if (header.innerText.includes('ダンス') || header.innerText.includes('Da.')) {
                header.innerHTML = isMobile ? '<font color="#3ABAFF">Da.</font>' : '<font color="#3ABAFF">ダンス</font>';
            } else if (header.innerText.includes('ビジュアル') || header.innerText.includes('Vi.')) {
                header.innerHTML = isMobile ? '<font color="#FFA900">Vi.</font>' : '<font color="#FFA900">ビジュアル</font>';
            } else if (header.innerText.includes('スタミナ') || header.innerText.includes('St.')) {
                header.innerHTML = isMobile ? 'St.' : 'スタミナ';
            }
        });
    }

    window.addEventListener('resize', updateColumnNamesForMobile);
    updateColumnNamesForMobile();

    const bannerTitle = document.querySelector('.banner_title');
    bannerTitle.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    const searchBarContainer = document.createElement('div');
    searchBarContainer.className = 'search-bar-container';

    const searchIcon = document.createElement('span');
    searchIcon.className = 'search-icon';

    const searchBar = document.createElement('input');
    searchBar.type = 'text';
    searchBar.id = 'search-bar';
    searchBar.className = 'search-bar';
    searchBar.placeholder = 'アイドル名、衣装・ヘアスタイル、スキル名・効果で検索';

    searchBarContainer.appendChild(searchIcon);
    searchBarContainer.appendChild(searchBar);
    document.body.insertBefore(searchBarContainer, document.querySelector('.container'));

    searchBar.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const keyword = searchBar.value.toLowerCase();
            const rows = Array.from(document.querySelectorAll('#character-table tr:not(:first-child)'));
            rows.forEach(row => {
                const cells = row.getElementsByTagName('td');
                const character = {
                    card_name: cells[2].innerText,
                    costume: cells[7].innerText,
                    live_skill1_name: cells[12].innerText,
                    live_skill1_effect: cells[13].innerText,
                    live_skill2_name: cells[14].innerText,
                    live_skill2_effect: cells[15].innerText,
                    live_skill3_name: cells[16].innerText,
                    live_skill3_effect: cells[17].innerText
                };
                let show = (
                    character.card_name.toLowerCase().includes(keyword) ||
                    character.costume.toLowerCase().includes(keyword) ||
                    character.live_skill1_name.toLowerCase().includes(keyword) ||
                    character.live_skill1_effect.toLowerCase().includes(keyword) ||
                    character.live_skill2_name.toLowerCase().includes(keyword) ||
                    character.live_skill2_effect.toLowerCase().includes(keyword) ||
                    character.live_skill3_name.toLowerCase().includes(keyword) ||
                    character.live_skill3_effect.toLowerCase().includes(keyword)
                );
                row.style.display = show ? '' : 'none';
            });
        }
    });
});

function openSettingsPopup() {
    const settingsPopup = document.querySelector('.settings-popup');
    const settingsPopupOverlay = document.querySelector('.settings-popup-overlay');
    settingsPopup.style.display = 'block';
    settingsPopupOverlay.style.display = 'block';
}

function closeSettingsPopup() {
    const settingsPopup = document.querySelector('.settings-popup');
    const settingsPopupOverlay = document.querySelector('.settings-popup-overlay');
    settingsPopup.style.display = 'none';
    settingsPopupOverlay.style.display = 'none';
}

document.querySelector('#settings').addEventListener('click', openSettingsPopup);
document.querySelector('.settings-popup button.close').addEventListener('click', closeSettingsPopup);
document.querySelector('.settings-popup-overlay').addEventListener('click', closeSettingsPopup);
