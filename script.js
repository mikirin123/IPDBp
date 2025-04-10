// ==========================
// 更新情報のHTML
// ==========================
const update_info = '<div class="news-content"><b>2025/4/6更新</b><br><br>・全アイドルの能力詳細を追加<br>・詳細ページに変化前イラストを掲載(パソコンのみ)<br><br><hr><b>2025/3/25更新</b><br><br>・2024年3月までのアイドルを追加<br>・詳細ページにプロフィールと他アイドルを掲載<br><br><hr><b>2025/3/24更新</b><br><br>・2023年12月までのアイドルを追加<br><br><hr><b>2025/3/15更新</b><br><br>・2023年6月までのアイドルを追加<br>・エールの表示をアイコンに変更<br><br><hr><b>2025/2/16更新</b><br><br>・2023年3月までのアイドルを追加<br>・ステータスの項目にパワーを追加<br>・検索バーを追加<br><br><hr><b>2025/2/7更新</b><br><br>・2022年4月までのアイドルを追加<br>・ステータスランキングページを追加<br><br><hr><b>2025/2/5更新</b><br><br>・2021年12月までのアイドルを追加<br>・バナータップ時にページ上部に移動<br><br><hr><b>2025/1/25更新</b><br><br>・スマホでの表示簡略化<br>・ポップアップにオーバーレイ追加<br>・設定に所持キャラチェックのボタン配置切り替えを追加<br><br><hr><b>2025/1/23更新</b><br><br>・実装順、降順昇順での並び替えの追加<br>・所持キャラチェックモードのボタン追加<br>・詳細ページの戻るボタン追加<br>・全体的なデザインの改善<br><br><hr><b>2025/1/18更新</b><br><br>・リリース時までの登場アイドルの追加</div>';
// ==========================
// フィルタ適用機能
// ==========================
function applyFilters() {
    // フィルタフォームのデータを取得
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
        sort: formData.get('sort')
    };
    const sortOrder = formData.get('sort-order') || 'asc';
    const keyword = document.getElementById('search-bar').value.toLowerCase();

    // テーブルの行をフィルタリング
    const rows = Array.from(document.querySelectorAll('#character-table tr:not(:first-child)'));
    rows.forEach(row => {
        const cells = row.getElementsByTagName('td');
        const character = {
            character: cells[1].innerText,
            rarity: cells[3].innerText,
            obtain: cells[19].innerText,
            trend: cells[4].getAttribute("value"),
            type: cells[5].getAttribute("value"),
            skill: cells[6].innerText,
            support: cells[18].getAttribute("value"),
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

        // フィルタ条件に基づいて表示/非表示を切り替え
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
    });

    // 並び替え処理
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

// ==========================
// フィルタリセット機能
// ==========================
function resetFilters() {
    const form = document.getElementById('filter-form');
    form.reset();
    document.getElementById('search-bar').value = '';
    const rows = Array.from(document.querySelectorAll('#character-table tr:not(:first-child)'));
    rows.forEach(row => {
        row.style.display = '';
    });

    // ID順に並び替え
    rows.sort((a, b) => {
        const aId = parseInt(a.getElementsByTagName('td')[0].innerText);
        const bId = parseInt(b.getElementsByTagName('td')[0].innerText);
        return aId - bId;
    });

    const table = document.getElementById('character-table');
    rows.forEach(row => table.appendChild(row));
}

// ==========================
// スクロールトップボタンの表示制御
// ==========================
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

// ==========================
// スクロールトップボタンのクリックイベント
// ==========================
document.getElementById('scrollToTopBtn').addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ==========================
// ページ読み込み時の初期化処理
// ==========================
document.addEventListener('DOMContentLoaded', function() {
    // メニューの設定
    const menu = document.querySelector('.menu');
    menu.tagName = 'button'; // タグをbuttonに変更
    menu.style.position = 'absolute';
    menu.style.right = '60px';
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
            popupHeader.innerText = menuName; // ポップアップのヘッダーにタイトルを設定
            if (menuName === 'つかいかた') {
                popupContent.innerHTML = '<div class="news-content"><b>メインページ</b><br><br>ゲーム内で実装されている全アイドルの詳細を確認できます。<br>フィルタ・並び替え・検索機能も活用してみてください。<br><br><hr><b>能力詳細</b><br><br>対象アイドルのステータスやスキル効果などを確認できます。<br><br><hr><b>ステータスランキング</b><br><br>全アイドルのステータスを一覧できます。<br>項目名をクリックすると、<br>昇順・降順で数値を並び替えることもできます。</div>';
                popup.style.display = 'block';
                popupOverlay.style.display = 'block';
            } else if (menuName === 'このツールについて') {
                popupContent.innerHTML = 'このツールはmikiが開発しています。<br>改善要望・不具合報告は<br><a href="https://x.com/miki_aipr">twitter</a>または<a href="https://forms.gle/Ke99JPag1pFawJw89">Googleフォーム</a>までお願いします。';
                popup.style.display = 'block';
                popupOverlay.style.display = 'block';
            } else if (menuName === '更新情報') {
                popupContent.innerHTML = update_info;
                popup.style.display = 'block';
                popupOverlay.style.display = 'block';
            }
        });
    });

    // ポップアップの設定
    const popupOverlay = document.createElement('div');
    popupOverlay.classList.add('popup-overlay');
    document.body.appendChild(popupOverlay);

    function closePopup() {
        popup.style.animation = 'fadeOut 0.3s ease-in-out';
        popupOverlay.style.animation = 'fadeOut 0.3s ease-in-out';
        setTimeout(() => {
            popup.style.display = 'none';
            popupOverlay.style.display = 'none';
        }, 300);
    }

    popupClose.addEventListener('click', closePopup);
    popupOverlay.addEventListener('click', closePopup);

    // ヒントアイコンの設定
    const hintIcons = document.querySelectorAll('.hint-icon');
    const hintPopups = document.querySelectorAll('.hint-popup');
    hintIcons.forEach((hintIcon, index) => {
        const hintPopup = hintPopups[index];
        hintIcon.addEventListener('click', function(event) {
            event.stopPropagation();
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

    const bannerTitle = document.querySelector('.banner_title');
    bannerTitle.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 検索バーの設定
    const searchBarContainer = document.createElement('div');
    searchBarContainer.className = 'search-bar-container';

    const searchIcon = document.createElement('span');
    searchIcon.className = 'search-icon';

    const searchBar = document.createElement('input');
    searchBar.type = 'text';
    searchBar.id = 'search-bar';
    searchBar.className = 'search-bar';
    searchBar.placeholder = 'アイドル名、衣装・髪型、スキル名・効果で検索';

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
                    live_skill3_effect: cells[17].innerText,
                    awakening_costume: cells[20].innerText,
                    awakening_skill_name: cells[21].innerText,
                    awakening_skill_effect: cells[22].innerText
                };
                let show = (
                    character.card_name.toLowerCase().includes(keyword) ||
                    character.costume.toLowerCase().includes(keyword) ||
                    character.live_skill1_name.toLowerCase().includes(keyword) ||
                    character.live_skill1_effect.toLowerCase().includes(keyword) ||
                    character.live_skill2_name.toLowerCase().includes(keyword) ||
                    character.live_skill2_effect.toLowerCase().includes(keyword) ||
                    character.live_skill3_name.toLowerCase().includes(keyword) ||
                    character.live_skill3_effect.toLowerCase().includes(keyword) ||
                    character.awakening_costume.toLowerCase().includes(keyword) ||
                    character.awakening_skill_name.toLowerCase().includes(keyword) ||
                    character.awakening_skill_effect.toLowerCase().includes(keyword)
                );
                row.style.display = show ? '' : 'none';
            });
        }
    });
});
