document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.getElementById('cursor');
    const sphereOrange = document.querySelector('.gradient-sphere.orange');
    const sphereBlue = document.querySelector('.gradient-sphere.blue');
    const siteHeader = document.querySelector('header');
    const filterItems = document.querySelectorAll('.portfolio-menu__item');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    // 1. Điều khiển Con trỏ chuột Custom & Hiệu ứng Parallax Nền
    window.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

      // Di chuyển cursor
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';

     
        const moveX = (mouseX - window.innerWidth / 2) * 0.03;
        const moveY = (mouseY - window.innerHeight / 2) * 0.03;

        if (sphereOrange) {
            sphereOrange.style.transform = `translate(${moveX}px, ${moveY}px) scaleX(1.4)`;
        }
        if (sphereBlue) {
            sphereBlue.style.transform = `translate(${-moveX * 1.5}px, ${-moveY * 1.5}px)`;
        }
    });

    // 2. Hiệu ứng ẩn Header khi scroll
    // window.addEventListener('scroll', () => {
    //     if (window.scrollY > 50) {
    //         siteHeader.classList.add('is-scrolled');
    //     } else {
    //         siteHeader.classList.remove('is-scrolled');
    //     }
    // });

    // 3. Tính năng Filter Dự án (Danh mục bên trái)
    filterItems.forEach(item => {
        item.addEventListener('click', () => {
            // Xóa class active cũ và thêm vào item vừa click
            filterItems.forEach(i => i.classList.remove('is-active'));
            item.classList.add('is-active');

            const filterValue = item.getAttribute('data-filter');

            // Logic lọc nội dung (có thể mở rộng khi bạn đổ dữ liệu thật)
            portfolioCards.forEach(card => {
                if (filterValue === 'all') {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                } else {
                    // Giả lập lọc: chỉ hiện card nếu trùng filter (hoặc ẩn bớt để demo)
                    card.style.opacity = '0.3'; 
                    // Ở đây bạn có thể thêm logic card.getAttribute('data-category') === filterValue
                }
            });
        });
    });

    // 4. Hiệu ứng Hover cho các thẻ Portfolio Card (Sáng lên)
    portfolioCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-expand'); // Bạn có thể thêm CSS cho class này để phóng to cursor
            card.style.transition = 'all 0.4s ease';
            card.style.filter = 'brightness(1.2)';
        });
        card.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-expand');
            card.style.filter = 'brightness(1)';
        });
    });
});