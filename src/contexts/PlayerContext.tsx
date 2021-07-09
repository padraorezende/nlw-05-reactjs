import { createContext, ReactNode, useContext } from "react";
import { useState } from 'react';

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
};

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    isLooping: boolean;
    isShuffling: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
    play: (episode: Episode) => void;
    togglePlay: () => void;
    setPlayingState: (state: boolean) => void;
    playList: (list: Episode[], index: number) => void;
    playNext: () => void;
    playPrevious: () => void;
    toggleLooping: () => void;
    toggleShuffle:() => void;
    clearPlayerState:() => void;
};

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
    children: ReactNode;
}

export function PlayerContextProvider({children}: PlayerContextProviderProps){
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);

    function play(episode : Episode) {
      setEpisodeList([episode]);
      setCurrentEpisodeIndex(0);
      setIsPlaying(true);
    }

    function playList(list : Episode[], index : number){
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }

    function toggleShuffle() {
        setIsPlaying(!isPlaying);
      }

    function toggleLooping() {
        setIsShuffling(!isShuffling);
      }
  
    function togglePlay() {
      setIsPlaying(!isPlaying);
    }
  
    function setPlayingState(state: boolean) {
      setIsPlaying(state);
    }

    function clearPlayerState() {
        setEpisodeList([]);
        setCurrentEpisodeIndex(0);
    }

    const hasPrevious = currentEpisodeIndex > 0;
    const hasNext = isShuffling || currentEpisodeIndex +1 < episodeList.length

    function playNext(){
        if(isShuffling){
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
            setCurrentEpisodeIndex(nextRandomEpisodeIndex);
        }else if(hasNext) {
            setCurrentEpisodeIndex(currentEpisodeIndex+1);
        }
    }

    function playPrevious() {
        if(hasPrevious){
            setCurrentEpisodeIndex(currentEpisodeIndex-1);
        }
    }  

    return (
      <PlayerContext.Provider value={{ episodeList, currentEpisodeIndex, hasPrevious,hasNext, isPlaying,isLooping, isShuffling,  play, togglePlay, setPlayingState, playList, playNext, playPrevious, toggleLooping, toggleShuffle, clearPlayerState}}>
          {children}
      </PlayerContext.Provider>
    );
}

export const usePlayer = () => {
    return useContext(PlayerContext);
}