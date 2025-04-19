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
    const pastResults = []; // 過去の計算結果を保存する配列

    // 数値を簡略化して表示する関数
    function formatSimplifiedNumber(num) {
        if (num >= 1e8) {
            return `${Math.ceil(num / 1e8)}億`; // 切り上げ
        } else if (num >= 1e4) {
            return `${Math.ceil(num / 1e4)}万`; // 切り上げ
        } else {
            return num.toLocaleString();
        }
    }

    const calculateBtn = document.getElementById('calculateBtn');
    calculateBtn.addEventListener('click', function() {
        const currentLevel = parseInt(document.getElementById('currentLevel').value, 10);
        const targetLevel = parseInt(document.getElementById('targetLevel').value, 10);
        const idolCount = parseInt(document.getElementById('idolCount').value, 10); // アイドル数

        if (isNaN(currentLevel) || isNaN(targetLevel) || isNaN(idolCount) || currentLevel >= targetLevel || idolCount <= 0) {
            alert('正しい値を入力してください。');
            return;
        }

        fetch('exp_list.csv')
            .then(response => response.text())
            .then(data => {
                const rows = data.split('\n').slice(1); // ヘッダー行を除外
                let totalExp = 0;

                for (let i = currentLevel; i < targetLevel; i++) {
                    const row = rows[i]; // 現在のレベルに対応する行を取得 (インデックスは0ベース)
                    if (row) {
                        const exp = parseInt(row.split(',')[1], 10); // 必要経験値を取得
                        if (!isNaN(exp)) {
                            totalExp += exp;
                        }
                    }
                }

                totalExp *= idolCount; // アイドル数を掛ける

                const resultElement = document.getElementById('result');
                const simplifiedResult = formatSimplifiedNumber(totalExp);
                resultElement.textContent = `必要経験値: ${totalExp.toLocaleString()} (${simplifiedResult})`; // カンマ区切りと簡略表記を追加

                // 過去の計算結果を保存
                pastResults.push(`現在のレベル: ${currentLevel}, 目標レベル: ${targetLevel}, アイドル数: ${idolCount}, 必要経験値: ${totalExp.toLocaleString()} (${simplifiedResult})`);
                updatePastResults();
            })
            .catch(err => console.error('CSVの読み込みに失敗しました: ', err));
    });

    // 過去の計算結果を更新する関数
    function updatePastResults() {
        const pastResultsElement = document.getElementById('pastResults');
        pastResultsElement.innerHTML = ''; // 一旦クリア
        pastResults.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.textContent = result;
            pastResultsElement.appendChild(resultItem);
        });
    }

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