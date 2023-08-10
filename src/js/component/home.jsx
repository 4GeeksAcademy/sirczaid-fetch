import React, { useState, useRef, useEffect } from "react";
import "./Home.css";

const Home = () => {
	const [songs, setSongs] = useState([]);
	const [isPlayActive, setIsPlayActive] = useState(false);
	const [idActive, setIdActive] = useState(0);

	// USE REF
	const listElements = useRef();
	const audio = useRef();

	const getSongsData = () => {
		// HACER LA PETICIÓN
		fetch("http://playground.4geeks.com/apis/fake/sound/songs")
			.then((res) => res.json()) // CONVERTIR A JSON
			.then((data) => setSongs(data)) // GUARDAR
			.catch((error) => console.log(error)); // ATRAPAR error
	}

	const handleSelectedSong = (id, url) => {
		if ( url === "" || !url ) {
			url = songs.find(song => song.id === id + 1).url;
		
			console.log(url);
		}

		setIsPlayActive(false)
		const songHtmlNodes = listElements.current.childNodes; // GET UL'S CHILD NODES
		let getSongSelected = "";

		// DESELECT SONGS
		for (let i = 0; i < songHtmlNodes.length; i++) {
			const arr = songHtmlNodes[i].classList;
			if ( arr.value.includes("active") ) songHtmlNodes[i].classList.remove("active");
		}

		// FIND SONG SELECTED
		for (let i = 0; i < songHtmlNodes.length; i++) {
			if (Number(songHtmlNodes[i].getAttribute("id")) === id) {
				getSongSelected = songHtmlNodes[i];
			}
		}
		getSongSelected.classList.add("active"); // ADD STYLES TO THE CLASS
		
		audio.current.src = "https://assets.breatheco.de/apis/sound/" + url;
		setIdActive(id); // SAVE ACTUAL SONG ID
		playAudio(); // PLAY ACTUAL SONG
	}

	const playAudio = () => {
		setIsPlayActive(true)
		audio.current.play().then(() => console.log("Ha comenzado a reproducirse"));
		audio.current.volume = 0.1;
	}

	const stopAudio = () => {
		setIsPlayActive(false)
		audio.current.pause();
	}
	
	const playPrevSong = () => { 
		setIsPlayActive(false);
		if (idActive > 0) {
			handleSelectedSong(idActive - 1);
		}
	}

	const playNextSong = () => {
		setIsPlayActive(false);
		if (idActive < 17) {
			handleSelectedSong(idActive + 1);
		}
		
	}

	useEffect(() => {
		getSongsData();
	}, []);

	return (
		<div className="">
			<ul className="list-group rounded-0" ref={listElements}>
				{ songs.map( (song, id) => 
					<li className="list-group-item bg-dark p-3 text-white" key={id} aria-current="true" id={id} onClick={() => handleSelectedSong(id, song.url)}>
						<span className="song_id pe-4">{id}</span>
						<span className="song_name">{song.name}</span>
					</li>
				)}
			</ul>
			<div className="bg-dark p-4 position-fixed bottom-0 end-0 start-0">
				<div className="text-center text-white">
					<audio ref={audio} src="" >Hola</audio>
					<i className="fa fa-play fs-5 me-4 p-1 rotate bg-white text-black" onClick={playPrevSong}></i>
					{
						isPlayActive 
							? <i className="fa fa-pause fs-4" onClick={stopAudio}></i>
							: <i className="fa fa-play fs-4" onClick={playAudio}></i>
					}
					<i className="fa fa-play fs-5 ms-4 p-1 bg-white text-black" onClick={playNextSong}></i>
				</div>
			</div>
		</div>
	);
};

export default Home;
