class FluidGradient {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.app = new PIXI.Application({
            resizeTo: window,
            backgroundColor: 0x000000,
            antialias: true,
            // Quan trọng: Phải ưu tiên WebGL 2 để dùng tính năng mô phỏng chất lỏng
            preferWebgl2: true 
        });
        this.container.appendChild(this.app.view);

        this.simRes = 512;
        this.mouse = { x: 0.5, y: 0.5, px: 0.5, py: 0.5 };
        this.didSplat = false;

        this.init();
    }

    init() {
        const gl = this.app.renderer.gl;
        
        // Kiểm tra xem máy có hỗ trợ ghi dữ liệu Float vào Texture không
        // Đây là nguyên nhân chính gây màn hình đen
        const supportFloat = gl.getExtension('EXT_color_buffer_float') || 
                             gl.getExtension('OES_texture_float');
        
        const type = supportFloat ? PIXI.TYPES.FLOAT : PIXI.TYPES.UNSIGNED_BYTE;
        const format = PIXI.FORMATS.RGBA;

        // Tạo 2 texture để hoán đổi (Double Buffering)
        this.velocity1 = PIXI.RenderTexture.create({ width: this.simRes, height: this.simRes, type, format });
        this.velocity2 = PIXI.RenderTexture.create({ width: this.simRes, height: this.simRes, type, format });

        const baseVertex = `
            attribute vec2 aVertexPosition;
            attribute vec2 aTextureCoord;
            varying vec2 vUv;
            void main() {
                vUv = aTextureCoord;
                gl_Position = vec4(aVertexPosition, 0.0, 1.0);
            }
        `;

        const advectFrag = `
            precision highp float;
            varying vec2 vUv;
            uniform sampler2D uSampler;
            uniform float dt;
            void main() {
                vec2 vel = texture2D(uSampler, vUv).xy;
                vec2 coord = vUv - dt * vel;
                gl_FragColor = texture2D(uSampler, coord) * 0.97; 
            }
        `;

        const splatFrag = `
            precision highp float;
            varying vec2 vUv;
            uniform sampler2D uSampler;
            uniform vec2 point;
            uniform vec3 color;
            uniform float radius;
            void main() {
                float d = distance(vUv, point);
                float m = exp(-d * d / radius);
                vec3 base = texture2D(uSampler, vUv).xyz;
                gl_FragColor = vec4(base + m * color, 1.0);
            }
        `;

        const renderFrag = `
            precision highp float;
            varying vec2 vUv;
            uniform sampler2D uSampler;
            uniform vec2 aspect;

            vec3 gradient(vec2 uv) {
                vec3 c1=vec3(0.05, 0.07, 0.15); // Màu tối sâu
                vec3 c2=vec3(0.1, 0.2, 0.4);
                vec3 c3=vec3(0.5, 0.8, 0.8);
                vec3 c4=vec3(0.9, 0.4, 0.1);
                float d = (uv.x - 0.5) * aspect.x + (uv.y - 0.5) * aspect.y + 0.5;
                vec3 col = mix(c1, c2, smoothstep(-0.5, 0.5, d));
                col = mix(col, c3, smoothstep(0.0, 1.0, d));
                col = mix(col, c4, smoothstep(0.5, 1.5, d));
                return col;
            }

            void main() {
                vec2 vel = texture2D(uSampler, vUv).xy;
                // Nếu velocity bị lỗi đen, uv sẽ giữ nguyên vUv
                vec2 uv = vUv + vel * 0.1; 
                gl_FragColor = vec4(gradient(uv), 1.0);
            }
        `;

        this.advectFilter = new PIXI.Filter(baseVertex, advectFrag, { dt: 0.016 });
        this.splatFilter = new PIXI.Filter(baseVertex, splatFrag, { point: [0, 0], color: [0, 0, 0], radius: 0.0008 });
        this.renderFilter = new PIXI.Filter(baseVertex, renderFrag, { aspect: [1, 1] });

        this.outputSprite = new PIXI.Sprite(PIXI.Texture.WHITE);
        this.app.stage.addChild(this.outputSprite);

        window.addEventListener('pointermove', (e) => {
            this.mouse.px = this.mouse.x;
            this.mouse.py = this.mouse.y;
            this.mouse.x = e.clientX / window.innerWidth;
            this.mouse.y = 1.0 - e.clientY / window.innerHeight;
            this.didSplat = true;
        });

        this.app.ticker.add(() => this.update());
    }

    update() {
        // Cập nhật kích thước sprite chính
        this.outputSprite.width = this.app.screen.width;
        this.outputSprite.height = this.app.screen.height;

        const aspect = this.app.screen.width > this.app.screen.height 
            ? [this.app.screen.width / this.app.screen.height, 1.0] 
            : [1.0, this.app.screen.height / this.app.screen.width];
        this.renderFilter.uniforms.aspect = aspect;

        if (this.didSplat) {
            this.splatFilter.uniforms.point = [this.mouse.x, this.mouse.y];
            this.splatFilter.uniforms.color = [(this.mouse.x - this.mouse.px) * 20, (this.mouse.y - this.mouse.py) * 20, 0];
            this.applyFilter(this.splatFilter, this.velocity1, this.velocity2);
            this.swapVelocity();
            this.didSplat = false;
        }

        this.applyFilter(this.advectFilter, this.velocity1, this.velocity2);
        this.swapVelocity();

        this.outputSprite.filters = [this.renderFilter];
        this.renderFilter.uniforms.uSampler = this.velocity1;
    }

    applyFilter(filter, input, output) {
        this.app.renderer.render(this.outputSprite, {
            renderTexture: output,
            clear: true,
            skipUpdateTransform: true
        });
        // Gán texture đầu vào cho shader tiếp theo
        filter.uniforms.uSampler = input; 
    }

    swapVelocity() {
        let temp = this.velocity1;
        this.velocity1 = this.velocity2;
        this.velocity2 = temp;
    }
}