<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QuantumHash vs. NFTs Tradicionais</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      background: radial-gradient(circle, #050505, #000022);
      font-family: Arial, sans-serif;
      color: white;
      user-select: none;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    /* Container dos cards */
    .cards-container {
      display: flex;
      gap: 30px;
      flex-wrap: wrap;
      justify-content: center;
    }
    .nft-card {
      width: 300px;
      height: 400px;
      perspective: 1000px;
      cursor: grab;
      position: relative;
    }
    .nft-inner {
      width: 100%;
      height: 100%;
      position: relative;
      transform-style: preserve-3d;
      transition: transform 0.4s ease;
    }
    /* Controle de exibição das faces:
       Se não estiver com a classe .flipped, a face traseira é oculta;
       Se estiver com .flipped, a face frontal é oculta. */
    .nft-inner:not(.flipped) .nft-back {
      display: none;
    }
    .nft-inner.flipped .nft-front {
      display: none;
    }
    /* Faces da carta */
    .nft-front,
    .nft-back {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 10px;
      backface-visibility: hidden;
      overflow: hidden;
      top: 0;
      left: 0;
    }
    /* Face frontal do NFT Tradicional (imagem estática) */
    .traditional-front {
      background-image: url('nft.png');
      background-size: cover;
      background-position: center;
      border: 2px solid rgba(255, 0, 0, 0.8);
      box-shadow: 0 0 15px rgba(255, 0, 0, 0.5);
    }
    /* Face frontal do NFT QuantumHash – contém a animação */
    .quantum-front {
      border: 2px solid rgba(0, 255, 255, 0.8);
      box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
      position: relative;
      z-index: 2;
    }
    /* Face traseira para ambas as cartas – imagem estática */
    .nft-back {
      background-image: url('quantumhash.png');
      background-size: cover;
      background-position: center;
      transform: rotateY(180deg);
      border: 2px solid rgba(0, 255, 255, 0.8);
      box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
      z-index: 1;
    }
    .card-label {
      position: absolute;
      bottom: 10px;
      left: 10px;
      background: rgba(0, 0, 0, 0.6);
      padding: 5px 10px;
      border-radius: 5px;
      font-size: 14px;
      z-index: 10;
    }
    /* Painel de Informações */
    .info-panel {
      position: absolute;
      top: 20px;
      left: 20px;
      background: rgba(0, 0, 0, 0.7);
      padding: 20px;
      border-radius: 10px;
      max-width: 300px;
      z-index: 100;
      line-height: 1.4;
    }
    /* Itens internos da face frontal do QuantumHash */
    canvas.quantum-canvas,
    .three-container {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      pointer-events: none;
    }
    /* Tabela de Dados */
    .data-table-container {
      margin-top: 40px;
      max-width: 800px;
      width: 100%;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      background: rgba(0, 0, 0, 0.7);
      color: #fff;
    }
    th, td {
      padding: 10px;
      border: 1px solid #444;
      text-align: center;
    }
    th {
      background: rgba(0, 0, 0, 0.8);
    }
    /* Texto Explicativo */
    .data-info {
      margin-top: 20px;
      max-width: 800px;
      background: rgba(0, 0, 0, 0.7);
      padding: 15px;
      border-radius: 5px;
      font-size: 14px;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <!-- Painel de Informações -->
  <div class="info-panel">
    <h2>QuantumHash vs. NFTs Tradicionais</h2>
    <p><strong>NFT Tradicional:</strong> Imagem estática armazenada na blockchain.</p>
    <p><strong>QuantumHash NFT:</strong> Animação dinâmica e interativa que simula interações quânticas.</p>
    <p>Arraste para girar a carta. Dê duplo clique em qualquer carta para alternar entre a face frontal (com animação ou imagem) e a face traseira (imagem estática).</p>
  </div>

  <!-- Container de Cards -->
  <div class="cards-container">
    <!-- Carta do NFT Tradicional -->
    <div class="nft-card" id="traditionalCard">
      <div class="nft-inner">
        <div class="nft-front traditional-front">
          <span class="card-label">NFT Tradicional</span>
        </div>
        <div class="nft-back"></div>
      </div>
    </div>
    <!-- Carta do NFT QuantumHash -->
    <div class="nft-card" id="quantumCard">
      <div class="nft-inner">
        <div class="nft-front quantum-front">
          <span class="card-label">QuantumHash NFT</span>
          <!-- Canvas para Partículas -->
          <canvas id="quantumCanvas" class="quantum-canvas"></canvas>
          <!-- Container para Render 3D (Dodecaedro Duplo) -->
          <div class="three-container" id="threeContainer"></div>
        </div>
        <div class="nft-back"></div>
      </div>
    </div>
  </div>

  <!-- Tabela de Dados (duas linhas fixas: NFT Tradicional e QuantumHash NFT) -->
  <div class="data-table-container">
    <table id="dynamicData">
      <thead>
        <tr>
          <th>Tipo de NFT</th>
          <th>NFT ID</th>
          <th>Timestamp</th>
          <th>Status</th>
          <th>Hash</th>
        </tr>
      </thead>
      <tbody>
        <tr id="rowTrad">
          <td>NFT Tradicional</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="rowQuantum">
          <td>QuantumHash NFT</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Texto Explicativo sobre os Dados -->
  <div class="data-info">
    <p><strong>Explicação dos Dados:</strong></p>
    <ul>
      <li><strong>NFT ID:</strong> Identificador único para o NFT.</li>
      <li><strong>Timestamp:</strong> Horário da transação/evolução registrada.</li>
      <li><strong>Status:</strong> "Confirmado" para NFT Tradicional ou "Evoluindo" para QuantumHash NFT.</li>
      <li><strong>Hash:</strong> String que simula o hash da transação. No QuantumHash, este valor muda dinamicamente.</li>
    </ul>
    <p>A tabela demonstra como um NFT tradicional possui dados estáticos, enquanto o QuantumHash NFT evolui automaticamente, atualizando seu hash e outros atributos em tempo real.</p>
  </div>

  <!-- Scripts -->
  <!-- Three.js -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script>
    document.addEventListener("DOMContentLoaded", () => {

      /* ===== Função para Arrastar e Girar a Carta ===== */
      function makeCardDraggable(card) {
        const inner = card.querySelector('.nft-inner');
        let isDragging = false, startX, startY, currentRotationX = 0, currentRotationY = 0;
        card.addEventListener('mousedown', (e) => {
          isDragging = true;
          card.style.cursor = 'grabbing';
          startX = e.clientX;
          startY = e.clientY;
        });
        document.addEventListener('mousemove', (e) => {
          if (!isDragging) return;
          const dx = e.clientX - startX;
          const dy = e.clientY - startY;
          const rotationY = currentRotationY + dx * 0.3;
          const rotationX = currentRotationX - dy * 0.3;
          inner.style.transform = `rotateY(${rotationY}deg) rotateX(${rotationX}deg)`;
        });
        document.addEventListener('mouseup', (e) => {
          if (!isDragging) return;
          const dx = e.clientX - startX;
          const dy = e.clientY - startY;
          currentRotationY += dx * 0.3;
          currentRotationX -= dy * 0.3;
          isDragging = false;
          card.style.cursor = 'grab';
        });
      }
      document.querySelectorAll('.nft-card').forEach(makeCardDraggable);

      /* ===== Flip Manual: Duplo Clique Alterna a Face da Carta ===== */
      document.querySelectorAll('.nft-card').forEach(card => {
        const inner = card.querySelector('.nft-inner');
        card.addEventListener('dblclick', () => {
          inner.classList.toggle("flipped");
        });
      });

      /* ===== Animação QuantumHash – Canvas de Partículas com Fusões ===== */
      // Objeto global que armazena dados do QuantumHash (evolução)
      let currentQuantumData = { nftID: "INIT", timestamp: new Date().toLocaleTimeString(), status: "Inicial", hash: "INIT" };

      function initQuantumHash() {
        const canvas = document.getElementById("quantumCanvas");
        const ctx = canvas.getContext("2d");
        canvas.width = 300;
        canvas.height = 400;
        let particles = [];
        const config = {
          particleCount: 40,
          maxConnections: 8,
          connectionDistance: 50,
          fusionDistance: 30,
          hueRange: [200, 250],
          particleSpeed: 0.4,
          energyDecay: 0.04,
          maxSize: 12,
          minSize: 3
        };

        class Particle {
          constructor(x = Math.random() * canvas.width, y = Math.random() * canvas.height, nftID = null) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * (config.maxSize - config.minSize) + config.minSize;
            this.speedX = (Math.random() - 0.5) * config.particleSpeed;
            this.speedY = (Math.random() - 0.5) * config.particleSpeed;
            this.color = this.generateColor();
            this.life = Math.random() * 400 + 300;
            this.energy = Math.random() * 100;
            this.nftID = nftID || this.generateHash();
          }
          generateColor() {
            return `hsl(${Math.random() * (config.hueRange[1] - config.hueRange[0]) + config.hueRange[0]}, 100%, 70%)`;
          }
          generateHash() {
            return Math.random().toString(36).substring(2, 12);
          }
          update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life--;
            this.energy -= config.energyDecay;
            if (this.size > config.minSize) this.size -= 0.02;
            // Chance de atualizar o hash (evolução)
            if (Math.random() > 0.995) {
              this.nftID = this.generateHash();
            }
          }
          // Fundir duas partículas e gerar uma "filho"
          fuseWith(other) {
            const newX = (this.x + other.x) / 2;
            const newY = (this.y + other.y) / 2;
            const newSpeedX = (this.speedX + other.speedX) / 2;
            const newSpeedY = (this.speedY + other.speedY) / 2;
            const newSize = ((this.size + other.size) / 2) * 1.2;
            const newEnergy = this.energy + other.energy;
            const filho = new Particle(newX, newY);
            filho.speedX = newSpeedX;
            filho.speedY = newSpeedY;
            filho.size = newSize;
            filho.energy = newEnergy;
            filho.color = this.color;
            filho.nftID = this.generateHash();
            // Atualiza os dados globais do QuantumHash
            currentQuantumData = {
              nftID: filho.nftID,
              timestamp: new Date().toLocaleTimeString(),
              status: "Evoluindo",
              hash: filho.nftID
            };
            return filho;
          }
          draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 20;
            ctx.shadowColor = this.color;
            ctx.fill();
            // Desenha conexões entre partículas
            this.connections.forEach(other => {
              ctx.beginPath();
              ctx.moveTo(this.x, this.y);
              ctx.lineTo(other.x, other.y);
              ctx.strokeStyle = `rgba(255, 255, 255, ${1 - Math.sqrt((other.x - this.x) ** 2 + (other.y - this.y) ** 2) / config.connectionDistance})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            });
            // Opcional: exibe o hash da partícula
            ctx.fillStyle = "white";
            ctx.font = "10px Arial";
            ctx.fillText(this.nftID, this.x + 5, this.y - 5);
          }
        }

        // Cria partículas iniciais
        for (let i = 0; i < config.particleCount; i++) {
          particles.push(new Particle());
        }
        // Adiciona partículas extras ao mover o mouse sobre o canvas
        canvas.addEventListener("mousemove", (event) => {
          const rect = canvas.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          const numParticles = Math.random() * 3 + 2;
          for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle(x, y));
          }
        });

        function animateParticles() {
          // Cria o efeito "trail" com fundo semitransparente
          ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          let novos = [];
          for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            p.update();
            p.draw();
            // Verifica conexões e possíveis fusões
            for (let j = i + 1; j < particles.length; j++) {
              let other = particles[j];
              let dx = other.x - p.x;
              let dy = other.y - p.y;
              let dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < config.connectionDistance) {
                // Desenha linha de conexão
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(other.x, other.y);
                ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dist / config.connectionDistance})`;
                ctx.lineWidth = 1;
                ctx.stroke();
                // Se estiverem muito próximos, há chance de fusão
                if (dist < config.fusionDistance && Math.random() > 0.99) {
                  const filho = p.fuseWith(other);
                  particles[i] = null;
                  particles[j] = null;
                  novos.push(filho);
                }
              }
            }
          }
          // Remove partículas marcadas como null e adiciona as novas partículas "filho"
          particles = particles.filter(p => p !== null).concat(novos);
          // Remove partículas que “morreram”
          particles = particles.filter(p => p.life > 0 && p.energy > 0);
          requestAnimationFrame(animateParticles);
        }
        animateParticles();
      }
      initQuantumHash();

      /* ===== Render 3D – Dodecaedro Duplo ===== */
      function initThreeJS() {
        const container = document.getElementById("threeContainer");
        const width = container.clientWidth;
        const height = container.clientHeight;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        container.appendChild(renderer.domElement);
        // Dodecaedro maior
        const geometry = new THREE.DodecahedronGeometry(5);
        const material = new THREE.MeshStandardMaterial({ color: 0x0033ff, wireframe: true });
        const dodecahedron = new THREE.Mesh(geometry, material);
        scene.add(dodecahedron);
        // Dodecaedro menor (filho) que gira em sentido oposto
        const smallGeometry = new THREE.DodecahedronGeometry(2);
        const smallMaterial = new THREE.MeshStandardMaterial({ color: 0xff00ff, wireframe: true });
        const smallDodecahedron = new THREE.Mesh(smallGeometry, smallMaterial);
        dodecahedron.add(smallDodecahedron);
        smallDodecahedron.position.set(0, 0, 0);
        const light = new THREE.PointLight(0xffffff, 1, 100);
        light.position.set(10, 10, 10);
        scene.add(light);
        camera.position.z = 10;
        function animate3D() {
          requestAnimationFrame(animate3D);
          // Rota o dodecaedro maior lentamente
          dodecahedron.rotation.x += 0.004;
          dodecahedron.rotation.y += 0.004;
          // Rota o dodecaedro menor em sentido oposto e um pouco mais rápido
          smallDodecahedron.rotation.x -= 0.01;
          smallDodecahedron.rotation.y -= 0.01;
          renderer.render(scene, camera);
        }
        animate3D();
      }
      initThreeJS();

      /* ===== Tabela de Dados Dinâmicos ===== */
      // Obtém as linhas fixas da tabela
      const rowTrad = document.getElementById("rowTrad");
      const rowQuantum = document.getElementById("rowQuantum");
      
      // Dados estáticos para o NFT Tradicional (gerados uma única vez)
      const tradData = {
        nftID: Math.random().toString(36).substring(2, 10).toUpperCase(),
        timestamp: new Date().toLocaleTimeString(),
        status: "Confirmado",
        hash: Math.random().toString(36).substring(2, 14)
      };
      function updateTradRow() {
        rowTrad.innerHTML = `
          <td>NFT Tradicional</td>
          <td>${tradData.nftID}</td>
          <td>${tradData.timestamp}</td>
          <td>${tradData.status}</td>
          <td>${tradData.hash}</td>
        `;
      }
      updateTradRow();
      
      // Atualiza a linha do QuantumHash NFT a cada 3 segundos usando o objeto global currentQuantumData
      function updateQuantumRow() {
        rowQuantum.innerHTML = `
          <td>QuantumHash NFT</td>
          <td>${currentQuantumData.nftID}</td>
          <td>${currentQuantumData.timestamp}</td>
          <td>${currentQuantumData.status}</td>
          <td>${currentQuantumData.hash}</td>
        `;
      }
      setInterval(updateQuantumRow, 3000);

    }); // Fim DOMContentLoaded
  </script>
</body>
</html>
