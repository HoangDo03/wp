// Khởi tạo PixiJS Application
const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x0a0a0a, // Màu nền Monopo
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
});

// Thêm canvas vào DOM
document.getElementById('pixi-container').appendChild(app.view);

// Đảm bảo canvas luôn full màn hình khi resize
window.addEventListener('resize', () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    // Cập nhật các đối tượng nếu cần, ví dụ: vị trí text, kích thước filter
});

// --- Tải tài nguyên (displace.png) ---
// Bạn cần một ảnh displace.png (ảnh nhiễu trắng đen) trong cùng thư mục với main.js
// Hoặc thay đổi đường dẫn tới ảnh của bạn
PIXI.Assets.load('displace.png').then((displacementTexture) => {
    setupScene(displacementTexture);
});

function setupScene(displacementTexture) {
    // --- 1. Tạo các Filter (Hiệu ứng) ---
    // RGB Split Filter - tạo hiệu ứng tách màu
    // Shader đơn giản để tách các kênh màu R, G, B
    const rgbSplitFilter = new PIXI.Filter(null, `
        precision mediump float;
        varying vec2 vTextureCoord;
        uniform sampler2D uSampler;
        uniform vec2 offset; // Độ lệch cho hiệu ứng tách màu

        void main() {
            vec4 color = texture2D(uSampler, vTextureCoord);
            vec4 red = texture2D(uSampler, vTextureCoord + offset);
            vec4 green = texture2D(uSampler, vTextureCoord); // Giữ nguyên xanh
            vec4 blue = texture2D(uSampler, vTextureCoord - offset);

            gl_FragColor = vec4(red.r, green.g, blue.b, color.a);
        }
    `, { offset: new PIXI.Point(0, 0) }); // Khởi tạo offset là 0

    // Displacement Filter - tạo hiệu ứng biến dạng
    const displacementFilter = new PIXI.filters.DisplacementFilter(displacementTexture);
    displacementFilter.scale.x = 0; // Không biến dạng ban đầu
    displacementFilter.scale.y = 0;
    displacementFilter.padding = 100; // Để tránh lỗi ở rìa

    // --- 2. Tạo Văn bản (Text) ---
    const textStyle = new PIXI.TextStyle({
        fontFamily: 'Inter', // Đảm bảo font này được tải (ví dụ qua Google Fonts)
        fontSize: 120,
        fill: 0xFFFFFF, // Màu trắng
        align: 'center',
        fontWeight: 'bold',
        letterSpacing: 10,
    });

    // Văn bản tiếng Anh (hiển thị mặc định)
    const englishText = new PIXI.Text('MONOPO\nVIBE', textStyle);
    englishText.anchor.set(0.5);
    englishText.x = app.screen.width / 2;
    englishText.y = app.screen.height / 2;
    englishText.resolution = 2; // Tăng độ phân giải cho text sắc nét

    // Văn bản tiếng Nhật (hoặc một version "effect" khác, bị ẩn dưới)
    const japaneseText = new PIXI.Text('モノポ\nバイブ', textStyle); // Ví dụ chữ Nhật
    japaneseText.anchor.set(0.5);
    japaneseText.x = app.screen.width / 2;
    japaneseText.y = app.screen.height / 2;
    japaneseText.resolution = 2;
    japaneseText.filters = [rgbSplitFilter, displacementFilter]; // Chỉ áp dụng filter cho text bị biến dạng

    // Container cho toàn bộ phần văn bản
    const textContainer = new PIXI.Container();
    textContainer.addChild(englishText);
    textContainer.addChild(japaneseText); // japaneseText sẽ nằm dưới englishText


    // --- 3. Tạo "Lense" và "Mask" ---
    // Thấu kính (một hình tròn mờ)
    const lense = new PIXI.Graphics();
    lense.beginFill(0xFFFFFF, 0.2); // Màu trắng mờ
    lense.drawCircle(0, 0, 150); // Bán kính 150px
    lense.endFill();
    lense.filters = [displacementFilter]; // Lense cũng bị biến dạng nhẹ

    // Mask (một hình tròn khác, dùng để cắt bỏ phần English text)
    const circleMask = new PIXI.Graphics();
    circleMask.beginFill(0xFFFFFF); // Màu bất kỳ, miễn là đặc
    circleMask.drawCircle(0, 0, 100); // Bán kính nhỏ hơn lense
    circleMask.endFill();

    // English text bị mask bởi circleMask
    englishText.mask = circleMask;


    // --- 4. Sắp xếp các lớp (Container) ---
    // Các đối tượng chính được thêm vào stage
    app.stage.addChild(lense);
    app.stage.addChild(textContainer);
    app.stage.addChild(circleMask); // Mask phải nằm trên cùng để hoạt động

    // --- 5. Tương tác chuột ---
    let mouseX = app.screen.width / 2;
    let mouseY = app.screen.height / 2;
    let targetDisplacement = 0; // Giá trị biến dạng mục tiêu
    let targetRgbOffset = 0; // Giá trị tách màu mục tiêu

    app.view.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Khi di chuột, tăng mức biến dạng và tách màu
        targetDisplacement = 50; // Mức biến dạng
        targetRgbOffset = 0.005; // Mức tách màu
    });

    // Khi chuột rời khỏi canvas, giảm hiệu ứng
    app.view.addEventListener('mouseleave', () => {
        targetDisplacement = 0;
        targetRgbOffset = 0;
    });

    // --- 6. Vòng lặp Animation (Ticker) ---
    app.ticker.add(() => {
        // Làm mượt chuyển động của lense và mask theo chuột (Lerp)
        lense.x += (mouseX - lense.x) * 0.1;
        lense.y += (mouseY - lense.y) * 0.1;
        
        circleMask.x = lense.x;
        circleMask.y = lense.y;

        // Làm mượt mức biến dạng và tách màu
        displacementFilter.scale.x += (targetDisplacement - displacementFilter.scale.x) * 0.1;
        displacementFilter.scale.y += (targetDisplacement - displacementFilter.scale.y) * 0.1;
        
        rgbSplitFilter.uniforms.offset.x += (targetRgbOffset - rgbSplitFilter.uniforms.offset.x) * 0.1;
        rgbSplitFilter.uniforms.offset.y += (targetRgbOffset - rgbSplitFilter.uniforms.offset.y) * 0.1;

        // Di chuyển text nền (japaneseText) một chút để tạo hiệu ứng lớp
        japaneseText.x = englishText.x + rgbSplitFilter.uniforms.offset.x * 100;
        japaneseText.y = englishText.y + rgbSplitFilter.uniforms.offset.y * 100;
    });
}