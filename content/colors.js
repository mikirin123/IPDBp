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
});

function copyColorCode(colorCode) {
    navigator.clipboard.writeText(colorCode).then(() => {
        alert(`カラーコード ${colorCode} をコピーしました！`);
    }).catch(err => {
        console.error('コピーに失敗しました: ', err);
    });
}

function saveTableAsImage() {
    const table = document.getElementById('color_table');
    html2canvas(table).then(canvas => {
        const link = document.createElement('a');
        link.download = 'color_table.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }).catch(err => {
        console.error('テーブルの画像保存に失敗しました: ', err);
    });
}