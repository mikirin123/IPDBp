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

function saveTableAsImage() {
    const table = document.getElementsByClassName('content');

    html2canvas(table).then(canvas => {
        const link = document.createElement('a');
        link.download = 'interact-present.png';
        link.href = canvas.toDataURL();
        link.click();
    }).catch(err => {
        console.error('画像の生成に失敗しました: ', err);
    });
}