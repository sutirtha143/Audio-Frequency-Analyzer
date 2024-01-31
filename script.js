const input = document.querySelector("input");
const audioElement = document.querySelector("audio");
const canvas = document.querySelector("canvas");

const context = canvas.getContext('2d')
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

input.addEventListener("change", () => {
    const file = input.files[0];
    if(!file) return;

    audioElement.src = URL.createObjectURL(file);
    audioElement.play();


    const audioContext = new AudioContext();

    const audioSource = audioContext.createMediaElementSource(audioElement);

    const analyser = audioContext.createAnalyser();

    audioSource.connect(analyser);

    analyser.connect(audioContext.destination);

    analyser.fftSize = 512;
    const bufferDataLength = analyser.frequencyBinCount;
    
    const bufferDataArray = new Uint8Array(bufferDataLength);

    const barWidth = canvas.width / bufferDataLength;
    let x = 0;

    function drawSoundBars() {
        x = 0;
        context.clearRect(0, 0, canvas.width, canvas.height)
        analyser.getByteFrequencyData(bufferDataArray);

        bufferDataArray.forEach(dataValue => {
            const barHeight = dataValue;
            
            const red = Math.floor(Math.random() * 256)
            const green = Math.floor(Math.random() * 256)
            const blue = Math.floor(Math.random() * 256)
            context.fillStyle = `rgb(${red},${green},${blue})`;
            context.fillRect(x, canvas.height - barHeight, barWidth, barHeight)
            x += barWidth
        })

        if(!audioElement.ended) requestAnimationFrame(drawSoundBars);
    }

    drawSoundBars();

})
