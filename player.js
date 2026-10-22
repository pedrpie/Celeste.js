class Player {

    constructor() {
        this.playerImage = new Image(); // Cria um objeto de imagem para o jogador
        this.playerImage.src = 'assets/astronauta.png';

        // Direção: 1 = direita, -1 = esquerda
        this.direcao = 1;

        // Projéteis disparados pelo jogador
        this.projeteis = [];

        // Carrega as imagens dos corações
        this.heartFull = new Image();
        this.heartFull.src = 'assets/heart_full.png';
        this.heartEmpty = new Image();
        this.heartEmpty.src = 'assets/heart_empty.png';

        // Sistema de Vidas
        this.maxVidas = 3;
        this.vidas = 3;
        this.tempoInvulneravel = 0; // Frames de invulnerabilidade após levar dano

    }

    // Informações do jogador
    width = 50; // Largura do jogador
    height = 50; // Altura do jogador
    pos_x = 550; // Posição horizontal do jogador
    pos_y = 558; // Posição vertical do jogador
    speed = 2; // Velocidade de movimento do jogador
    velocityY = 0; // Velocidade vertical do jogador
    gravity = 0.2; // Gravidade aplicada ao jogador
    jumpForce = 8; // Força do pulo do jogador
    onGround = true; // Indica se o jogador está no chão
    jumpWasDown = false; // Indica se a tecla de pulo estava pressionada na atualização anterior
    keys = {}; // Armazena o estado das teclas pressionadas

    // Desenha o jogador no canvas
    drawPlayer() {
        if (!this.playerImage.complete) {
            // Se a imagem ainda não foi carregada, desenha um retângulo vermelho como marcador
            ctx.fillStyle = "red";
            // Desenha o retângulo no lugar do jogador
            ctx.fillRect(
                this.pos_x, this.pos_y,
                this.width, this.height
            );
            return;
        }

        // Se estiver invulnerável, pisca ficando semitransparente
        if (this.tempoInvulneravel > 0 && Math.floor(this.tempoInvulneravel / 6) % 2 === 0) {
            ctx.globalAlpha = 0.4;
        } else {
            ctx.globalAlpha = 1.0;
        }

        // Identifica a direção pelas teclas pressionadas
        if (this.keys["ArrowRight"] || this.keys["d"]) {
            this.direcao = 1;
        } else if (this.keys["ArrowLeft"] || this.keys["a"]) {
            this.direcao = -1;
        }
        // Verifica se o jogador está andando (pressionando as teclas de movimento)
        const andando =
            this.keys["ArrowRight"] || this.keys["d"] ||
            this.keys["ArrowLeft"] || this.keys["a"];

        // A spritesheet possui 4 colunas e 2 linhas.
        // Cada quadro mede 64 x 80 pixels.
        let frameX = 0;
        let frameY = 80;

        // Se o jogador estiver no ar, usa o quadro de pulo
       if (!this.onGround) {
            frameX = 200; // Sem animacao do fogo = 128            
            frameY = 80; //Sem animacao do fogo = 80
            // Se o jogador estiver andando, alterna os quadros para simular caminhada
        } else if (andando) {
            // Alterna os quadros para simular caminhada
            frameX = (Math.floor(this.pos_x / 20) % 2) * 60;
        }
        ctx.save();

        // Espelha o astronauta quando ele deve olhar para a direita
        if (this.direcao === 1) {
            // Espelha a imagem horizontalmente
            ctx.translate(this.pos_x + this.width, this.pos_y);
            // Inverte a escala horizontal
            ctx.scale(-1, 1);
            //
            ctx.drawImage(
                // Desenha a imagem espelhada, voltada para a direita
                this.playerImage,
                frameX, frameY, 60, 80,
                0, 0, this.width, this.height
            );
        } 
        // Desenha a imagem original, voltada para a esquerda
        if(this.direcao === -1){
            // Desenha a imagem original, voltada para a esquerda
             ctx.drawImage(
            this.playerImage,
            frameX, frameY, 60, 80,
            this.pos_x, this.pos_y,
            this.width, this.height
        );
}
// Restaura o estado do contexto para evitar que a escala invertida afete outros elementos
ctx.restore();
ctx.globalAlpha = 1.0; // <--- Restaura a opacidade normal para os projéteis e corações!
        // Desenha os projéteis na cor azul
        ctx.fillStyle = "#00BFFF";
        // Desenha cada projétil como um círculo
        for (const projetil of this.projeteis) {
            ctx.beginPath();// Inicia um novo caminho para o círculo do projétil
            ctx.arc( 
                projetil.x, projetil.y, 
                4, 0, Math.PI * 2 // Desenha um círculo completo (360 graus) para representar o projétil
            );
            ctx.fill(); // Preenche o círculo do projétil com a cor definida anteriormente
        }
    }

    // Comando de disparo: deverá ser chamado pelo controle do jogo
    atirar() {
        // Adiciona um novo projétil à lista de projéteis do jogador
        this.projeteis.push({
            x: this.direcao === 1 // Se a direção for 1 (direita), o projétil é disparado a partir da borda direita do jogador
                ? this.pos_x + this.width // Se a direção for -1 (esquerda), o projétil é disparado a partir da borda esquerda do jogador
                : this.pos_x, // Posição horizontal do projétil
            y: this.pos_y + this.height / 2, // Posição vertical do projétil (metade da altura do jogador)
            velocidade: 7 * this.direcao
        });
    }

    // Atualiza a posição dos projéteis
    atualizarProjeteis() {
        // Com base na sua velocidade
        for (const projetil of this.projeteis) {
            projetil.x += projetil.velocidade;
        }
        // Remove projéteis que saíram da tela
        this.projeteis = this.projeteis.filter(
            projetil =>
                projetil.x >= 0 && // Mantém apenas os projéteis que estão dentro da largura do canvas
                projetil.x <= canvas.width // Mantém apenas os projéteis que estão dentro da largura do canvas
        );
    }

    // função que faz o jogador andar e pular pelo canvas
    updatePlayer(platforms){

        if(this.keys["ArrowRight"] || this.keys["d"]){
            this.pos_x += this.speed;
        }
        

        if(this.keys["ArrowLeft"] || this.keys["a"]){
            this.pos_x -= this.speed;
        }

        const jumpKeyDown = this.keys["ArrowUp"] || this.keys["w"];

        if(jumpKeyDown && !this.jumpWasDown && this.onGround){
            this.velocityY = -this.jumpForce;
            this.onGround = false;
        }

        this.jumpWasDown = jumpKeyDown;

        if (this.tempoInvulneravel > 0) {
        this.tempoInvulneravel--;
}

        // Mantém o jogador dentro das bordas do canvas.
        this.pos_x = Math.max(0, Math.min(this.pos_x, canvas.width - this.width));

        // Guarda a posição dos pés antes do movimento para detectar se cruzaram uma plataforma.
        const previousBottom = this.pos_y + this.height;
        this.velocityY += this.gravity;
        this.pos_y += this.velocityY;
        this.onGround = false;

        for (const platform of platforms) {
            const overlapsHorizontally =
                this.pos_x < platform.x + platform.width &&
                this.pos_x + this.width > platform.x;
            const currentBottom = this.pos_y + this.height;

            if (
                // Aterrissa apenas ao cair, vindo de cima e sobrepondo a plataforma na horizontal.
                this.velocityY >= 0 &&
                previousBottom <= platform.y &&
                currentBottom >= platform.y &&
                overlapsHorizontally
            ) {
                this.pos_y = platform.y - this.height;
                this.velocityY = 0;
                this.onGround = true;
            }
        }

        
    }

        levarDano() {
        if (this.tempoInvulneravel > 0 || this.vidas <= 0) return;

        this.vidas--;
        this.tempoInvulneravel = 60; // Fica cerca de 1 segundo invulnerável (piscando)

        if (this.vidas <= 0) {
            console.log("Game Over!");
            gameStatus = "gameover"; 
            // Aqui você pode reiniciar a fase ou mudar o status do jogo
        }
    }



    desenharVidas(contexto) {
        const tamanhoCoracao = 32; // Ajuste a largura/altura desejada
        const margem = 10;
        const larguraTotal = this.maxVidas * tamanhoCoracao + (this.maxVidas - 1) * margem;
        const inicioX = (contexto.canvas.width - larguraTotal) / 2;
        const inicioY = 20;

        for (let i = 0; i < this.maxVidas; i++) {
            // Se o índice atual for menor que as vidas restantes, usa o coração cheio
            const img = (i < this.vidas) ? this.heartFull : this.heartEmpty;

            if (img.complete) {
                contexto.drawImage(
                    img,
                    inicioX + i * (tamanhoCoracao + margem),
                    inicioY,
                    tamanhoCoracao,
                    tamanhoCoracao
                );
            }
        }
    }
}
