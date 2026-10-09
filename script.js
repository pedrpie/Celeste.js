const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
		
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
		
const GRAVIDADE = 0.65;
const teclas = {};
		
class Player{
	width = 30;
	height = 60;
	color = "black";
			
	posicaoX = 100;
	posicaoY = canvas.height - this.height;
	velocidadeX = 0;
	velocidadeY = 0;
	forcaDoPulo = -14;
	estaNoChao = true;
			
			
	draw(){
		ctx.fillStyle = this.color;
		ctx.fillRect(this.posicaoX, this.posicaoY, this.width, this.height);
	}
			
	update(){
		this.velocidadeX = 0;

		if (teclas["KeyA"]) {
			this.velocidadeX = -6;
		}

		if (teclas["KeyD"]) {
			this.velocidadeX = 6;
		}

		this.posicaoX += this.velocidadeX;
			
		this.velocidadeY += GRAVIDADE;
		this.posicaoY += this.velocidadeY;
				
		if (this.posicaoY + this.height >= canvas.height){
			this.posicaoY = canvas.height - this.height;
			this.velocidadeY = 0;
			this.estaNoChao = true;
		} else {
			this.estaNoChao = false;
		}
	}
			
	pular(){
		if (this.estaNoChao) {
			this.velocidadeY = this.forcaDoPulo;
			this.estaNoChao = false;
		}
	}
}
		
const jogador = new Player();
		
function animate() {
	requestAnimationFrame(animate);
			
	ctx.clearRect(0, 0, canvas.width, canvas.height);
			
	jogador.update();
			
	jogador.draw();
}
		
animate();
		
window.addEventListener("keydown", (event) => {
	teclas[event.code] = true;

	if (event.code === "Space") {
		event.preventDefault();

		if (!event.repeat) {
			jogador.pular();
		}
	}		
});

window.addEventListener("keyup", (event) => {
	teclas[event.code] = false;
});