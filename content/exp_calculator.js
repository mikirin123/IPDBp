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

                const resultContent = document.querySelector('#result .result-content');
                const simplifiedResult = formatSimplifiedNumber(totalExp);
                resultContent.innerHTML = `
                    <div>現在のレベル: ${currentLevel}</div>
                    <div>目標レベル: ${targetLevel}</div>
                    <div>アイドル数: ${idolCount}</div>
                    <div>必要経験値: ${totalExp.toLocaleString()} (${simplifiedResult})</div>
                `;

                // 計算結果を表示
                document.getElementById('result').style.display = 'block';

                // 過去の計算結果を保存
                pastResults.push(`現在のレベル: ${currentLevel}, 目標レベル: ${targetLevel}, アイドル数: ${idolCount}, 必要経験値: ${totalExp.toLocaleString()} (${simplifiedResult})`);
                updatePastResults();
            })
            .catch(err => console.error('CSVの読み込みに失敗しました: ', err));
    });

    // 過去の計算結果を更新する関数
    function updatePastResults() {
        const pastResultsElement = document.getElementById('pastResults');
        const resultsContainer = document.getElementById('resultsContainer');

        if (!resultsContainer) {
            const container = document.createElement('div');
            container.id = 'resultsContainer';
            pastResultsElement.appendChild(container);
        } else {
            resultsContainer.innerHTML = ''; // 一旦クリア
        }

        pastResults.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.textContent = result;
            resultsContainer.appendChild(resultItem);
        });
    }

    const compareBtn = document.getElementById('compareBtn');
    compareBtn.addEventListener('click', function() {
        const currentLevel1 = parseInt(document.getElementById('currentLevel1').value, 10);
        const targetLevel1 = parseInt(document.getElementById('targetLevel1').value, 10);
        const idolCount1 = parseInt(document.getElementById('idolCount1').value, 10);

        const currentLevel2 = parseInt(document.getElementById('currentLevel2').value, 10);
        const targetLevel2 = parseInt(document.getElementById('targetLevel2').value, 10);
        const idolCount2 = parseInt(document.getElementById('idolCount2').value, 10);

        if (
            isNaN(currentLevel1) || isNaN(targetLevel1) || isNaN(idolCount1) ||
            isNaN(currentLevel2) || isNaN(targetLevel2) || isNaN(idolCount2) ||
            currentLevel1 >= targetLevel1 || idolCount1 <= 0 ||
            currentLevel2 >= targetLevel2 || idolCount2 <= 0
        ) {
            alert('正しい値を入力してください。');
            return;
        }

        fetch('exp_list.csv')
            .then(response => response.text())
            .then(data => {
                const rows = data.split('\n').slice(1); // ヘッダー行を除外
                const calculateTotalExp = (currentLevel, targetLevel, idolCount) => {
                    let totalExp = 0;
                    for (let i = currentLevel; i < targetLevel; i++) {
                        const row = rows[i - 1]; // レベルに対応する行を取得 (インデックスは0ベース)
                        if (row) {
                            const exp = parseInt(row.split(',')[1], 10); // 必要経験値を取得
                            if (!isNaN(exp)) {
                                totalExp += exp;
                            }
                        }
                    }
                    return totalExp * idolCount; // アイドル数を掛ける
                };

                const totalExp1 = calculateTotalExp(currentLevel1, targetLevel1, idolCount1);
                const totalExp2 = calculateTotalExp(currentLevel2, targetLevel2, idolCount2);

                const resultContent = document.querySelector('#compareResult .result-content');
                resultContent.innerHTML = `
                    <div>計算1: 現在のレベル: ${currentLevel1}, 目標レベル: ${targetLevel1}, アイドル数: ${idolCount1}, 必要経験値: ${totalExp1.toLocaleString()} (${formatSimplifiedNumber(totalExp1)})</div>
                    <div>計算2: 現在のレベル: ${currentLevel2}, 目標レベル: ${targetLevel2}, アイドル数: ${idolCount2}, 必要経験値: ${totalExp2.toLocaleString()} (${formatSimplifiedNumber(totalExp2)})</div>
                    <div>差分: ${(totalExp1 - totalExp2).toLocaleString()} (${formatSimplifiedNumber(Math.abs(totalExp1 - totalExp2))})</div>
                `;

                // 比較結果を表示
                document.getElementById('compareResult').style.display = 'block';

                // 過去の計算結果に追加
                pastResults.push(`【比較計算】計算1: ${totalExp1.toLocaleString()} (${formatSimplifiedNumber(totalExp1)}), 計算2: ${totalExp2.toLocaleString()} (${formatSimplifiedNumber(totalExp2)}), 差分: ${(totalExp1 - totalExp2).toLocaleString()} (${formatSimplifiedNumber(Math.abs(totalExp1 - totalExp2))})`);
                updatePastResults();
            })
            .catch(err => console.error('CSVの読み込みに失敗しました: ', err));
    });
});