let ytPlayer;
let ytVideoId = null;
let volumeAtual = 70;

function createYouTubePlayer(videoId) {
    ytPlayer = new YT.Player('youtube-audio-wrapper', {
        height: '0',
        width: '0',
        videoId: videoId,
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'disablekb': 1,
            'fs': 0,
            'rel': 0
        },
        events: {
            'onReady': function (event) {
                document.getElementById('yt-play-btn').addEventListener('click', function () {
                    if (ytPlayer.getPlayerState() === YT.PlayerState.PLAYING) {
                        ytPlayer.pauseVideo();
                        this.innerHTML = '<i class="fas fa-play"></i>';
                    } else {
                        ytPlayer.playVideo();
                        this.innerHTML = '<i class="fas fa-pause"></i>';
                    }
                });

                ytPlayer.setVolume(volumeAtual);

                document.getElementById('volume-slider').addEventListener('input', handleVolumeChange);
                document.getElementById('volume-down').addEventListener('click', decreaseVolume);
                document.getElementById('volume-up').addEventListener('click', increaseVolume);
            }
        }
    });


}

function buscarVideoAoVivo() {
    fetch('/api/live')
        .then(response => response.json())
        .then(data => {
            if (data.videoId) {
                ytVideoId = data.videoId;
                createYouTubePlayer(ytVideoId);
                document.getElementById('yt-current-track').innerText = data.title;
            } else {
                document.getElementById('yt-play-btn').disabled = true;
                document.getElementById('yt-current-track').innerText = "No momento não estamos com nenhuma reprodução ao vivo.";
            }
        })
        .catch(error => {
            console.error('Erro ao buscar live:', error);
        });
}

function handleVolumeChange(e) {
    const volume = parseInt(e.target.value);
    volumeAtual = volume;
    ytPlayer.setVolume(volumeAtual);
    updateVolumeUI(volumeAtual);
}

function decreaseVolume() {
    slider = document.getElementById('volume-slider')
    volumeAtual = Math.max(0, slider.target.value);
    ytPlayer.setVolume(volumeAtual);
    updateVolumeUI(volumeAtual);
}

function increaseVolume() {
    slider = document.getElementById('volume-slider')
    volumeAtual = Math.min(100, slider.target.value);
    ytPlayer.setVolume(volumeAtual);
    updateVolumeUI(volumeAtual);
}

function updateVolumeUI(volume) {
    document.getElementById('volume-slider').value = volume;
    // document.getElementById('volume-value').textContent = volume;
}

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
    buscarVideoAoVivo();
}

// Botão voltar ao topo
const backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Botão WhatsApp
document.getElementById('whatsapp-btn').addEventListener('click', function() {
    const phoneNumber = '5519992468171';
    const defaultMessage = 'Olá, estou ouvindo a Rádio Vida na Vida!';
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;
    window.open(whatsappUrl, '_blank');
});