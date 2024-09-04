
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
        if (isNaN(seconds) || seconds < 0) {
                return "00:00";
        }

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);

        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');

        return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {

        currFolder = folder;

        let a = await fetch(`http://127.0.0.1:5501/${folder}/`)
        let response = await a.text()

        let div = document.createElement("div")
        div.innerHTML = response;

        let as = div.getElementsByTagName("a")

        songs = []
        for (let index = 0; index < as.length; index++) {
                const element = as[index];
                if (element.href.endsWith(".mp3")) {
                        songs.push(element.href.split(`/${folder}/`)[1])
                }
        }
       
         // show all the in the playlist
         let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
         songUL.innerHTML = ""
         for (const song of songs) {
                 songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="Music.svg" alt="">
                          <div class="info">
                              <div>${song.replaceAll("%20", " ")}</div>
                              <div>Ayush Jaiswal</div>
                          </div>
                          <div class="playnow">
                              <span>Play Now</span>
                              <img class="invert" src="play.svg" alt="">
                          </div>
                          </li>`;
         }
 
         // attach a event listner to each song
         Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
                 e.addEventListener("click", element => {
                         playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
 
                 })
         })
         return songs;
}

const playMusic = (track, pause = false) => {
        // let audio = new Audio("/songs/" +track)
        currentSong.src = `/${currFolder}/` + track
        if (!pause) {
                currentSong.play()
                play.src = "pause.svg"
        }

        document.querySelector(".songinfo").innerHTML = decodeURI(track)
        document.querySelector(".songtime").innerHTML = "00:00 /00:00"

        
}

async function displayAlbums() {
        let a = await fetch(`http://127.0.0.1:5501/songs/`)
        let response = await a.text()
        let div = document.createElement("div")
        div.innerHTML = response;
        let anchors = div.getElementsByTagName("a");
        
        
        let cardContainer = document.querySelector(".cardContainer")


        let array=  Array.from(anchors)
                for (let index = 0; index < array.length; index++) {
                        const e = array[index];
                        
                if (e.href.includes("/songs/")) {
                        let folder = e.href.split("/").slice(-1)[0]

                        // get the metadata of the folder 
                        let a = await fetch(`http://127.0.0.1:5501/songs/${folder}/info.json`)
                        let response = await a.json()
                        
                        cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder ="${folder}" class="card ">
                        <div  class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48"
                                color="#000000" fill="none">
                                <!-- Green background circle without border -->
                                <circle cx="12" cy="12" r="12" fill="green" />
                                <!-- Original path -->
                                <path
                                    d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z"
                                    fill="currentColor" />
                            </svg>
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
                }
        }
          // load the playlist when the card is clicked

          Array.from(document.getElementsByClassName("card")).forEach(e => {
                e.addEventListener("click", async item => {
                        songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
                        playMusic(songs[0])
                })
        })
}

async function main() {
        // get the list of all the song

        //  songs = await getSongs("songs/cs")
        await getSongs("songs/cs")
        playMusic(songs[0], true)

        // Display all the albums of the page
        displayAlbums()

        play.addEventListener("click", () => {
                if (currentSong.paused) {
                        currentSong.play()
                        play.src = "pause.svg"
                }
                else {
                        currentSong.pause()
                        play.src = "play.svg"
                }
        })
        // timeupdate Event
        currentSong.addEventListener("timeupdate", () => {
                document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
                document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
        })

        // add an addEventListener to seekbar
        document.querySelector(".seekbar").addEventListener("click", e => {
                let percentage = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
                document.querySelector(".circle").style.left = percentage + "%";
                currentSong.currentTime = ((currentSong.duration) * percentage) / 100

        })

        // add an eventlistner for hameburger
        document.querySelector(".hameburger").addEventListener("click", e => {
                document.querySelector(".left").style.left = "0"
        })

        // add an eventlistner for close button
        document.querySelector(".close").addEventListener("click", e => {
                document.querySelector(".left").style.left = "-120%"
        })

        previous.addEventListener("click", () => {
                currentSong.pause()
                let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
                if ((index - 1) >= 0) {
                        playMusic(songs[index - 1])
                }
        })

        // Add an event listener to next
        next.addEventListener("click", () => {
                currentSong.pause()
                let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
                if ((index + 1) < songs.length) {
                        playMusic(songs[index + 1])
                }
        })

        //     add an event to volume
        document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", e => {
                currentSong.volume = parseInt(e.target.value) / 100
                if (currentSong.volume >0){
                        document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
                    } 
        })
      
        // add Event listner to mute the volume 
        document.querySelector(".volume>img").addEventListener("click", e => {
                if (e.target.src.includes("volume.svg")) {
                        e.target.src= e.target.src.replace("volume.svg","mute.svg")
                        currentSong.volume = 0;
                        document.querySelector(".range").getElementsByTagName("input")[0].value=0;
                }
                else{
                        currentSong.volume = .10;
                        e.target.src= e.target.src.replace("mute.svg","volume.svg")
                        document.querySelector(".range").getElementsByTagName("input")[0].value=10;
                }
        })
}

main()