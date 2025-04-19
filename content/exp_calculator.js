document.addEventListener('DOMContentLoaded', function() {
    const bannerTitle = document.querySelector('.banner_title');
    bannerTitle.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // スクロールトップボタンの追加
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollToTopBtn.style.display = 'block';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });

    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 必要経験値計算機のロジック
    const calculateBtn = document.getElementById('calculateBtn');
    calculateBtn.addEventListener('click', function() {
        const currentLevel = parseInt(document.getElementById('currentLevel').value, 10);
        const targetLevel = parseInt(document.getElementById('targetLevel').value, 10);
        const characterCount = parseInt(document.getElementById('characterCount').value, 10);

        if (isNaN(currentLevel) || isNaN(targetLevel) || isNaN(characterCount) || currentLevel >= targetLevel || characterCount <= 0) {
            alert('正しい値を入力してください。');
            return;
        }

        fetch('exp_list.csv')
            .then(response => response.text())
            .then(data => {
                const rows = data.split('\n');
                let totalExp = 0;

                for (let i = currentLevel; i < targetLevel; i++) {
                    const row = rows.find(row => row.startsWith(`${i},`));
                    if (row) {
                        const exp = parseInt(row.split(',')[1], 10);
                        if (!isNaN(exp)) {
                            totalExp += exp;
                        }
                    }
                }

                totalExp *= characterCount; // キャラの数を掛ける

                const resultElement = document.getElementById('result');
                resultElement.textContent = `必要経験値: ${totalExp.toLocaleString()}`; // カンマ区切りを追加
            })
            .catch(err => console.error('CSVの読み込みに失敗しました: ', err));
    });

    // 計算結果を画像として保存
    const saveResultBtn = document.getElementById('saveResultBtn');
    saveResultBtn.addEventListener('click', function() {
        const calculator = document.querySelector('.calculator');
        html2canvas(calculator).then(canvas => {
            const link = document.createElement('a');
            link.download = 'exp_calculation_result.png';
            link.href = canvas.toDataURL();
            link.click();
        }).catch(err => {
            console.error('画像の生成に失敗しました: ', err);
        });
    });
});

function saveTableAsImage() {
    const content = document.querySelector('.content'); // 修正: class="content"を取得

    html2canvas(content).then(canvas => {
        const link = document.createElement('a');
        link.download = 'interact-present.png';
        link.href = canvas.toDataURL();
        link.click();
    }).catch(err => {
        console.error('画像の生成に失敗しました: ', err);
    });
}