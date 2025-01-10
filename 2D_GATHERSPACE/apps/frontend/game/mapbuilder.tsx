import React from 'react';
import { useRef, useEffect } from 'react'
import { MapManager } from './classes/mapmanager';
import Elementslist from './elementslist';



const Mapbuilder = () => {

  const gameref = useRef<HTMLDivElement | null>(null)
  const game = useRef<Phaser.Game | null>(null)
  const sidebarref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {

    if (!gameref.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameref.current,
      physics: {
        default: 'arcade', // Enable Arcade Physics
        arcade: {
            gravity: { x: 0, y: 0 }, // Optional: Set gravity (if needed)
            debug: false,       // Optional: Enable debug mode for visual debugging
        }
    },
      scene: new MapManager(),
    };


    game.current = new Phaser.Game(config);



    return () => {
      game.current?.destroy(true);
      game.current = null;
    };
  }, []);

  useEffect(() => {

    const handleClickEvent = (event: MouseEvent) => {
      if ((!gameref.current?.contains(event.target as Node)) && (!sidebarref.current?.contains(event.target as Node))) {
        console.log("clicked outside");
        if (MapManager.getInstance().getGhostElements()) {
          MapManager.getInstance().clearSelectedElements()
          MapManager.getInstance().clearGhostElements()
        }
      }
    }

    window.addEventListener("click", handleClickEvent)

    return () => {
      window.removeEventListener("click", handleClickEvent)
    }
  }, [])

  const selector = (e: any) => {
    console.log(e.key);

    MapManager.getInstance().setSelectedElements(e.key, e.static)




  }

  return (
    <>
      <div ref={gameref} style={{ width: "800px", height: "600px" }}></div>
      <div ref={sidebarref} > {Elementslist.map((e) => (
        <div ><img onClick={() => selector(e)} src={e.sprite} alt="" /></div>
      ))} </div>
    </>
  )
}

export default Mapbuilder