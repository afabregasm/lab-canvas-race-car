window.onload = () => {
  // Cuando haya cargado window se ejecuta el código

  const LIMITE_IZQ = 65;
  const LIMITE_DER = 385;

  class RaceCar {
    constructor() {
      this.x = 225;
      this.y = 600;
      this.width = 50;
      this.height = 90;
      this.carImage = new Image();
      this.carImage.src = "images/car.png";
      this.velocity = 10;
    }

    print(contexto) {
      contexto.drawImage(
        this.carImage,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }

    moveLeft() {
      console.log("MOVIENDO IZQUIERDA", this.x);
      this.x -= this.velocity;
      if (this.x < LIMITE_IZQ) this.x = LIMITE_IZQ;
    }
    moveRight() {
      console.log("MOVIENDO DERECHA", this.x);
      this.x += this.velocity;
      if (this.x > LIMITE_DER) this.x = LIMITE_DER;
    }
  }

  class Obstacle {
    constructor(canvas) {
      this.y = -40;
      this.height = 40;
      this.width =
        Math.floor(Math.random() * ((LIMITE_DER - LIMITE_IZQ) / 2 - 100)) + 100;
      this.x = Math.floor(Math.random() * (canvas.width - this.width));
      this.velocity = 5;
      this.color = "red";
    }

    print(context) {
      context.fillStyle = this.color;
      context.fillRect(this.x, this.y, this.width, this.height);
    }

    move() {
      this.y += this.velocity;
    }
  }

  class Game {
    constructor() {
      this.canvas = document.getElementById("canvas");
      this.ctx = this.canvas.getContext("2d");
      this.roadImage = document.createElement("img");
      this.roadImage.src = "images/road.png";
      this.raceCar = new RaceCar();
      this.obstacles = [];
      this.intervalId = undefined;
      this.iteration = 0;
    }

    start() {
      if (this.intervalId == undefined) {
        this.intervalId = setInterval(() => {
          this.iteration++;
          this.clear();
          this.recalculate();
          this.print();
        }, 20);
      }
    }
    stop() {
      if (this.intervalId) clearInterval(this.intervalId);
    }
    clear() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    print() {
      this.ctx.drawImage(
        this.roadImage,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
      this.raceCar.print(this.ctx);
      this.obstacles.forEach((obstacle) => {
        obstacle.print(this.ctx);
      });
    }
    recalculate() {
      if (this.iteration % 70 === 0) {
        let obstacle = new Obstacle(this.canvas);
        this.obstacles.push(obstacle);
      }

      this.obstacles.forEach((obstacle) => {
        obstacle.move();
        // Controlar las colisiones
        if (
          !(
            this.raceCar.x + this.raceCar.width < obstacle.x ||
            this.raceCar.x > obstacle.x + obstacle.width ||
            this.raceCar.y > obstacle.y + obstacle.height ||
            this.raceCar.y + this.raceCar.height < obstacle.y
          )
        ) {
          this.stop();
        }
      });
    }
  }

  const partida = new Game();

  document.getElementById("start-button").onclick = () => {
    startGame();
  };

  function startGame() {
    partida.start();
    // document.getElementsByClassName("game-intro")[0].style.display = "none";
  }

  document
    .getElementsByTagName("body")[0]
    .addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowLeft":
          partida.raceCar.moveLeft();
          break;
        case "ArrowRight":
          partida.raceCar.moveRight();
          break;
      }
    });
};
