
let caixa = document.querySelector(".caixa-media");
async function cliquenobotao() {
    let cidade = document.querySelector(".input-cidade").value;

    let endereco = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${chave}&units=metric&lang=pt_br`;

    let respostaServidor = await fetch(endereco);
    let dados = await respostaServidor.json();

    console.log(dados);

    caixa.innerHTML = `
        <h2 class="cidade">${dados.name}</h2>
        <p class="temperatura">${Math.floor(dados.main.temp)}°C</p>
        <img class="icone" src="https://openweathermap.org/img/wn/${dados.weather[0].icon}.png" alt="Icone do tempo">
        <p class="umidade">Umidade: ${dados.main.humidity}%</p>
    <button class="botao-ia" onclick="pedirSugestaoRoupas()">Sugestão de Roupas</button>
        <p class="resposta-ia"></p>
    `;
}

function detectaVoz() {
    let reconhecimento = new window.webkitSpeechRecognition();
    reconhecimento.lang = "pt-BR";
    reconhecimento.start();

    reconhecimento.onresult = function (evento) {
        let textoTranscrito = evento.results[0][0].transcript;
        document.querySelector(".input-cidade").value = textoTranscrito;
        cliquenobotao();
    };
}

async function pedirSugestaoRoupas() {
    let temperatura = document.querySelector(".temperatura").textContent;
    let umidade = document.querySelector(".umidade").textContent;
    let cidade = document.querySelector(".cidade").textContent;

    let resposta = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "Authorization": "Bearer " + chaveIA
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            "messages": [
                {
                    "role": "user",
                    "content": "Me dê uma sugestão de roupas para o clima atual da cidade " + cidade + ", onde a temperatura é " + temperatura + " e a umidade é " + umidade + "Só que em frase curtas e divisão em paragrafos"
                }
            ],
    
        })
    });

    let dados = await resposta.json();
    document.querySelector(".resposta-ia").innerHTML = dados.choices[0].message.content;
    console.log(dados);
}